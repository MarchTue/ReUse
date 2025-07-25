// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Escrow is AccessControl {
    using ECDSA for bytes32;

    enum EscrowStatus {
        DEPOSIT,
        DELIVERED,
        COMPLETED,
        RELEASE,
        DISPUTED,
        CANCLED
    }

    struct DeliveryInfo {
        string trackingNumber;
        string courier;
        string currentStatus;
        string location;
        uint256 lastUpdated;
    }

    struct EscrowInfo {
        address seller;
        address buyer;
        uint256 amount;
        address tokenAddress;
        EscrowStatus status;
        uint256 deliveryConfirmTime;
        
    }
}
