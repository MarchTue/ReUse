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
    event DeliveryDetailsUpdated(
        uint256 indexed escrowId,
        string trackingNumber,
        string courier,
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
            unicode"상품 준비 중",
            block.timestamp,
            _proposalId
        );

        return (currentEscrowId, _proposalId);
    } // deposit
}
