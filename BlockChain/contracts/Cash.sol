// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MyToken.sol"; // ERC20 RU 토큰
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Cash is AccessControl {
    bytes32 public constant CASH_ADMIN_ROLE = keccak256("CASH_ADMIN_ROLE");
    MyToken public immutable ruToken;

    // 이벤트 정의
    event CashCharged(
        address indexed user,
        uint256 amount,
        string externalTxId
    );
    event CashWithdrawn(
        address indexed user,
        uint256 amount,
        string externalTxId
    );

    constructor(address _ruToken) {
        require(_ruToken != address(0), "Invalid RU Token Address");
        ruToken = MyToken(_ruToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CASH_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev 사용자의 Ru 충전
     * @param user 충전 대상
     * @param amount 충전 금액
     * @param externalTxId 백엔드 결제 트랜잭션 ID - 외부 결제(페이먼츠, 에스크로)
     */
    function chargeRU(
        address user,
        uint256 amount,
        string calldata externalTxId
    ) external onlyRole(CASH_ADMIN_ROLE) {
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Amount must be > 0");

        ruToken.mint(user, amount);
        emit CashCharged(user, amount, externalTxId);
    }

    /**
     * @dev 사용자의 Ru 출금
     * @param user 출금 대상
     * @param amount 출금 금액
     * @param externalTxId 오프체인 출금 트랜잭션
     */
    function withdrawRU(
        address user,
        uint256 amount,
        string calldata externalTxId
    ) external onlyRole(CASH_ADMIN_ROLE) {
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Amount must be > 0");
        require(ruToken.balanceOf(user) >= amount, "Insufficient balance");

        ruToken.burnFrom(user, amount); // RU 소각
        emit CashWithdrawn(user, amount, externalTxId);
    }

    /**
     * @dev 관리자 역할 추가
     */
    function addCashAdmin(
        address account
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(account != address(0), "Invalid account");
        grantRole(CASH_ADMIN_ROLE, account);
    }
}
