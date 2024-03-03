// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Dao {
    uint public data;
    function setData(uint _data) public {
        data = _data;
    }
}
