// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyToken
 * @dev Re-use 에서 사용할 ERC20 토큰 컨트랙트
 * 원화(KRW)와 1:1 매칭을 위한 decimals : 0으로 설정
 * 컨트랙트의 소유자만이 추가 토큰을 발행 할 수 있습니다.
 */
contract MyToken is ERC20, Ownable {
  event Minted(address indexed to, uint256 amount);
  event Burned(address indexed from, uint256 amount);

  
  constructor (string memory name, string memory symbol, uint256 initialSupply) 
  ERC20(name, symbol) 
  Ownable(msg.sender)
  {
    _mint(msg.sender, initialSupply);
    emit Minted(msg.sender, initialSupply);
  }
  
  function decimals() public view virtual override returns (uint8) {
    return 0; // 1 원 = 1 토큰
  }
  
  function mint(address to, uint256 amount) public onlyOwner {
    require(to != address(0), "ERC20: mint to the zero address");
    require(amount > 0, "ERC20: mint amount must be greater than 0");
    
    _mint(to, amount);
    
    emit Minted(to, amount);
  }
  
  function burn(uint256 amount) public {
    require(amount > 0, "ERC20: burn amount must be greater than 0");
    require(balanceOf(msg.sender) >= amount, "ERC20: burn amount exceeds balance");

    _burn(msg.sender, amount);
    emit Burned(msg.sender, amount);
  }
}


