//SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract Random{

    function random(address [] memory _players) public view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, _players)));
    }
}