//SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./Random.sol";

contract Lottery is Random{

/**
* @dev Current owner address.
*/
  address private owner;

  uint private minimumAmount; // Value in wei

/**
* @dev Stores the Address and wei pair of the 
* amount given for the lottery, to check the history 
* of the lottery.
*/
  mapping(address => uint) public playersData;

/**
* @dev Stores the list of all player
*/
  address[] public players;

  constructor () payable{
      require(msg.value != 0, "No min value");
      owner = msg.sender;
      minimumAmount = msg.value;
  }

/**
* @dev Checks if the function is called by owner
*/
  modifier isOwner(){
      require(owner == msg.sender,"Not Auth");
      _;
  }

/**
* @dev Error thrown when given Wei is less
*       than mentioned by Owner
*
* @param weiGiven uint value of Wei provided by user
* @param requiredWei uint value required mantioned by Owner
*/
  error NotEnoughEther(uint weiGiven, uint requiredWei);

/**
* @dev Enter the Lottery by paying an amount of Wei
* higher than what is mentioned by the owner
*/
  function enterLottery() public payable{
      if (msg.value < minimumAmount){
          revert NotEnoughEther(msg.value,minimumAmount);
      }
      playersData[msg.sender] = msg.value;
      players.push(msg.sender);
  }

/**
* @dev Owner can pick a random winner   
*/
  function getWinner() public payable isOwner{
      uint winnerIndex = random(players) % players.length;
      payable(players[winnerIndex]).transfer(address(this).balance);
      players = new address[](0); // Reset the players array

  }

  function getPlayers() public view returns (address [] memory){
      return players;
  }

}