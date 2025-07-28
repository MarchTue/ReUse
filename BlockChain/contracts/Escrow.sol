// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";

contract Escrow is AccessControl {
    using ECDSA for bytes32;

    enum EscrowStatus {
        DEPOSIT,
        DELIVERING,
        DELIVERED,
        COMPLETED,
        RELEASE,
        DISPUTED,
        CANCELED
    }

    struct DeliveryInfo {
        string trackingNumber; // 운송장 번호
        string courier; // 택배사 이름
        string currentStatus; // 현재 배송 상태
        string location; // 위치 - 짧을수록 좋음.
        uint256 lastUpdated;
    }

    struct EscrowInfo {
        address seller;
        address buyer;
        uint256 amount;
        address tokenAddress;
        EscrowStatus status;
        uint256 deliveryConfirmTime;
        bool raisedDispute;
        bytes32 proposalId;
        DeliveryInfo deliveryDetails; // 배송 상세 정보 구조체
    }

    mapping(uint256 => EscrowInfo) public escrows;
    uint256 private nextEscrowId;

    bytes32 private _DOMAIN_SEPARATOR; // eip712 서명 충돌 방지 도메인 분리자.

    uint256 public immutable AUTO_RELEASE_DELAY;

    bytes32 public constant ARBITER_ROLE = keccak256("ARBITER_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    // 이벤트
    // proposalId 를 Created 제외 넣어줄 필요가 있나?
    event EscrowCreated(
        uint256 indexed escrowId,
        address indexed seller,
        address indexed buyer,
        uint256 amount,
        address tokenAddress,
        bytes32 proposalId
    );
    event FundsDeposited(
        uint256 indexed escrowId,
        address indexed buyer,
        uint256 amount,
        bytes32 proposalId
    );
    event DeliveryStatusUpdated(
        uint256 indexed escrowId,
        bool isConfirmed,
        uint256 confirmTime,
        bytes32 proposalId
    );
    event FundsReleased(
        uint256 indexed escrowId,
        address indexed recipient,
        uint256 amount,
        bytes32 proposalId
    );
    event FundsRefunded(
        uint256 indexed escrowId,
        address indexed recipient,
        uint256 amount,
        bytes32 proposalId
    );
    event DisputeRaised(
        uint256 indexed escrowId,
        address indexed disputeParty,
        bytes32 proposalId
    );
    event DisputeResolved(
        uint256 indexed escrowId,
        address indexed resolver,
        bool toSeller,
        bytes32 proposalId
    );
    event EscrowCanceled(
        uint256 indexed escrowId,
        address indexed canceler,
        bytes32 proposalId
    );
    event EscrowFinalized(uint256 indexed escrowId, bytes32 proposalId);

    /**
     * @dev 배송 정보 업데이트에 관한 이벤트
     * @param escrowId 블록체인에서 부여될 에스크로의 ID
     * @param trackingNumber 운송장번호
     * @param courier 배송사
     * @param status 배송 상태 - 배송상태는 회사별로 다를 것으로 예상되어 enum 구조화는 진행하지 아니하였소.
     * @param location 배송 현재 위치 - 단 최대한 짧게 유지해야 함
     * @param lastUpdated  마지막 수정 시각
     * @param proposalId  백엔드에서 사용할 제안과 관련된 ID (변경 가능)
     */
    event DeliveryDetailsUpdated(
        uint256 indexed escrowId,
        string trackingNumber,
        string courier,
        string status,
        string location,
        uint256 lastUpdated,
        bytes32 proposalId
    );

    constructor(uint256 _autoReleaseDelay) {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender()); // 배포자 권한 부여
        nextEscrowId = 1;

        _DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256("Re-Use Escrow"),
                keccak256("1"),
                block.chainid,
                address(this)
            )
        );

        AUTO_RELEASE_DELAY = _autoReleaseDelay;
    }

    function deposit(
        address _buyer,
        address _seller,
        uint256 _amount,
        address _tokenAddress,
        uint256 _permitValue,
        uint256 _deadline,
        uint8 _v,
        bytes32 _r,
        bytes32 _s,
        bytes32 _proposalId
    ) public returns (uint256 escrowId, bytes32 proposalId) {
        // 조건
        require(_buyer != address(0), "Escrow : Buyer cannot be zero address ");
        require(
            _seller != address(0),
            "Escrow : Seller cannot be zero address"
        );
        require(_amount > 0, "Escrow : Amount must be greater than zero");
        require(
            _tokenAddress != address(0),
            "Escrow : TokenAddress cannot be zero address"
        );
        require(
            _buyer != _seller,
            "Escrow : Buyer and seller cannot be the same"
        );

        // erc 20 permit - 서명.
        IERC20Permit(_tokenAddress).permit(
            _buyer,
            address(this),
            _permitValue,
            _deadline,
            _v,
            _r,
            _s
        );

        uint256 currentEscrowId = nextEscrowId++;
        escrows[currentEscrowId] = EscrowInfo({
            seller: _seller,
            buyer: _buyer,
            amount: _amount,
            tokenAddress: _tokenAddress,
            status: EscrowStatus.DEPOSIT,
            deliveryConfirmTime: 0,
            raisedDispute: false,
            proposalId: _proposalId,
            // set delivery init data
            deliveryDetails: DeliveryInfo({
                trackingNumber: "",
                courier: "",
                currentStatus: unicode"상품 준비 중",
                location: unicode"",
                lastUpdated: block.timestamp
            })
        });
        // 구매자 -> Escrow 토큰 전송
        IERC20(escrows[currentEscrowId].tokenAddress).transferFrom(
            _buyer,
            address(this),
            _amount
        );

        // 에스크로 생성 이벤트 및 토큰 예치 이벤트 emit
        emit EscrowCreated(
            currentEscrowId,
            _seller,
            _buyer,
            _amount,
            _tokenAddress,
            _proposalId
        );
        emit FundsDeposited(currentEscrowId, _buyer, _amount, _proposalId);

        // 배송 정보 이벤트
        emit DeliveryDetailsUpdated(
            currentEscrowId,
            unicode"", // 초기 운송장 번호 없음
            unicode"", // 초기 택배사 정보 없음
            unicode"상품 준비 중", // status
            // location
            "",
            block.timestamp,
            _proposalId
        );

        return (currentEscrowId, _proposalId);
    } // deposit

    /**
     * @dev 판매자 또는 오라클이 상품 배송을 시작했음을 알리고 에스크로 상태를 DELIVERING으로 변경.
     * @param _escrowId 해당 에스크로 ID
     * @param _trackingNumber 운송장 번호
     * @param _courier 택배사 이름
     * @param _proposalId 백엔드 제안 ID
     */
    function startDelivery(
        uint256 _escrowId,
        string memory _trackingNumber,
        string memory _courier,
        bytes32 _proposalId
    ) public {
        EscrowInfo storage escrow = escrows[_escrowId];
        require(
            _msgSender() == escrow.seller || hasRole(ORACLE_ROLE, _msgSender()),
            "Escrow: Only seller or oracle can start delivery"
        );
        require(
            escrow.status == EscrowStatus.DEPOSIT,
            "Escrow: Can only start delivery from DEPOSIT state"
        );

        escrow.status = EscrowStatus.DELIVERING;

        escrow.deliveryDetails.trackingNumber = _trackingNumber;
        escrow.deliveryDetails.courier = _courier;
        escrow.deliveryDetails.lastUpdated = block.timestamp;
        escrow.deliveryDetails.location = "";
        escrow.deliveryDetails.currentStatus = unicode"배송 중";

        emit DeliveryDetailsUpdated(
            _escrowId,
            _trackingNumber,
            _courier,
            escrow.deliveryDetails.currentStatus,
            escrow.deliveryDetails.location,
            block.timestamp,
            _proposalId
        );
    }

    /**
     * @dev 오라클이 배달 완료 상태를 최종적으로 확인하고 에스크로 상태를 DELIVERED로 변경.
     * @param _escrowId 해당 에스크로 ID
     * @param _isConfirmed 배달 완료 여부 (true여야 함)
     * @param _proposalId 백엔드 제안 ID
     */
    function confirmDeliveryStatus(
        uint256 _escrowId,
        bool _isConfirmed,
        bytes32 _proposalId
    ) public onlyRole(ORACLE_ROLE) {
        EscrowInfo storage escrow = escrows[_escrowId];

        require(
            escrow.status == EscrowStatus.DELIVERING,
            "Escrow: Can only confirm delivery status from DELIVERING state"
        );
        require(_isConfirmed, "Escrow: Delivery confirmation must be true");

        escrow.status = EscrowStatus.DELIVERED;
        escrow.deliveryConfirmTime = block.timestamp;

        emit DeliveryStatusUpdated(
            _escrowId,
            _isConfirmed,
            block.timestamp,
            _proposalId
        );
    }

    // 배송정보 업데이트
    function updateDeliveryDetails(
        uint256 _escrowId,
        string memory _trackingNumber,
        string memory _courier,
        string memory _currentStatus,
        string memory _location,
        bytes32 _proposalId
    ) public onlyRole(ORACLE_ROLE) {
        EscrowInfo storage escrow = escrows[_escrowId];

        require(
            escrow.status != EscrowStatus.COMPLETED &&
                escrow.status != EscrowStatus.RELEASE &&
                escrow.status != EscrowStatus.CANCELED,
            "Escrow : Cannot update delivery details for finalized or canceled escrow"
        );

        escrow.deliveryDetails.trackingNumber = _trackingNumber;
        escrow.deliveryDetails.courier = _courier;
        escrow.deliveryDetails.currentStatus = _currentStatus;
        escrow.deliveryDetails.location = _location;
        escrow.deliveryDetails.lastUpdated = block.timestamp;

        emit DeliveryDetailsUpdated(
            _escrowId,
            _trackingNumber,
            _courier,
            escrow.deliveryDetails.currentStatus,
            _location,
            block.timestamp,
            _proposalId
        );
    }

    // 구매자가 직접 대금을 정산
    function claimFunds(uint256 _escrowId, bytes32 _proposalId) public {
        EscrowInfo storage escrow = escrows[_escrowId];
        require(_msgSender() == escrow.buyer);
        require(escrow.status == EscrowStatus.DELIVERED);
        require(!escrow.raisedDispute);

        escrow.status = EscrowStatus.COMPLETED;
        IERC20(escrow.tokenAddress).transfer(escrow.seller, escrow.amount);
        emit FundsReleased(
            _escrowId,
            escrow.seller,
            escrow.amount,
            _proposalId
        );
    }

    // 누구든지 가스비 지불하고 자동 정산 트리거 가능
    function autoReleaseFunds(uint256 _escrowId, bytes32 _proposalId) public {
        EscrowInfo storage escrow = escrows[_escrowId];
        require(escrow.status == EscrowStatus.DELIVERED);
        require(!escrow.raisedDispute);
        require(
            block.timestamp >= escrow.deliveryConfirmTime + AUTO_RELEASE_DELAY
        ); // 자동 정산 지연 시간 경과 확인

        escrow.status = EscrowStatus.COMPLETED;
        IERC20(escrow.tokenAddress).transfer(escrow.seller, escrow.amount);
        emit FundsReleased(
            _escrowId,
            escrow.seller,
            escrow.amount,
            _proposalId
        );
    }

    // 관리자 역할이 강제로 에스크로 자금을 판매자에게 전달
    function releaseFunds(
        uint256 _escrowId,
        bytes32 _proposalId
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        EscrowInfo storage escrow = escrows[_escrowId];
        // DEPOSIT, DELIVERING, DELIVERED, DISPUTED 상태에서 강제 지급 가능
        require(
            escrow.status == EscrowStatus.DEPOSIT ||
                escrow.status == EscrowStatus.DELIVERING || // DELIVERING 상태 포함
                escrow.status == EscrowStatus.DELIVERED ||
                escrow.status == EscrowStatus.DISPUTED,
            "Escrow: Funds cannot be released from current state by admin"
        );

        escrow.status = EscrowStatus.COMPLETED; // 상태를 COMPLETED로 변경
        IERC20(escrow.tokenAddress).transfer(escrow.seller, escrow.amount); // 판매자에게 토큰 지급
        emit FundsReleased(
            _escrowId,
            escrow.seller,
            escrow.amount,
            _proposalId
        );
    }

    // 관리자 역할이 강제로 에스크로 자금을 구매자에게 환불
    function refundFunds(
        uint256 _escrowId,
        bytes32 _proposalId
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        EscrowInfo storage escrow = escrows[_escrowId];
        // DEPOSIT, DELIVERING, DELIVERED, DISPUTED 상태에서 강제 환불 가능
        require(
            escrow.status == EscrowStatus.DEPOSIT ||
                escrow.status == EscrowStatus.DELIVERING || // DELIVERING 상태 포함
                escrow.status == EscrowStatus.DELIVERED ||
                escrow.status == EscrowStatus.DISPUTED,
            "Escrow: Funds cannot be refunded from current state by admin"
        );

        escrow.status = EscrowStatus.CANCELED; // 상태를 CANCELED로 변경
        IERC20(escrow.tokenAddress).transfer(escrow.buyer, escrow.amount); // 구매자에게 토큰 환불
        emit FundsRefunded(_escrowId, escrow.buyer, escrow.amount, _proposalId);
    }

    // 분쟁 부분은 보류합니다.

    /**
     *  @dev 관리자 역할에 해당하는 계정이, ORACLE_ROLE 을 부여하는 기능
     *  @dev 해당 기능은 추후 확장성을 고려한 관리적 성격의 구현입니다.
     *  @param _address : ORACLE_ROLE을 부여받을 address
     *  */
    function grantOracleRole(
        address _address
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            _address != address(0),
            "Danger! : Oracle address cannot be zero."
        );
        _grantRole(ORACLE_ROLE, _address);
    }

    /**
     * @dev ORACLE_ROLE에 대한 권한을 회수하는 함수
     * @dev 관리자 권한 必, 추후 확장성을 고려한 관리적 성격의 구현
     * @param _address : ORACLE_ROLE을 회수할 address
     */
    function revokeOracleRole(
        address _address
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            _address != address(0),
            "Danger! : Cannot revoke 0x0 address' Role"
        );
        _revokeRole(ORACLE_ROLE, _address);
    }
}
