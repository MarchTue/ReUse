// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// import "@openzeppelin/contracts/utils/Context.sol";

/**
 * @title MyToken
 * @dev Re-use 에서 사용할 ERC20 토큰 컨트랙트
 * 원화(KRW)와 1:1 매칭을 위한 decimals : 0으로 설정
 * 컨트랙트의 소유자만이 추가 토큰을 발행 할 수 있습니다.
 */
contract MyToken is ERC20, AccessControl {
    event Minted(address indexed to, uint256 amount);
    event Burned(address indexed from, uint256 amount);

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    modifier onlyOwner() {
        require(
            hasRole(ADMIN_ROLE, _msgSender()),
            "MyToken: caller is not the owner"
        );
        _;
    }

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    )
        // address[] memory admins
        ERC20(name, symbol)
    {
        _grantRole(ADMIN_ROLE, _msgSender());
        _setRoleAdmin(DEFAULT_ADMIN_ROLE, ADMIN_ROLE);
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _mint(msg.sender, initialSupply);
        emit Minted(msg.sender, initialSupply);
        decimals();
    }

    function decimals() public view virtual override returns (uint8) {
        return 0; // 1 원 = 1 토큰
    }

    function mint(address to, uint256 amount) public onlyRole(ADMIN_ROLE) {
        require(to != address(0), "ERC20: mint to the zero address");
        require(amount > 0, "ERC20: mint amount must be greater than 0");

        _mint(to, amount);

        emit Minted(to, amount);
    }

    function burn(uint256 amount) public {
        require(amount > 0, "ERC20: burn amount must be greater than 0");
        require(
            balanceOf(msg.sender) >= amount,
            "ERC20: burn amount exceeds balance"
        );

        _burn(msg.sender, amount);
        emit Burned(msg.sender, amount);
    }

    function addAdmin(address account) public onlyOwner {
        require(account != address(0), "ERC20: add admin to the zero address");
        grantRole(ADMIN_ROLE, account);
    }
}
