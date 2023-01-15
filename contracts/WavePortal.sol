// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

struct Guest {
    address addr;
    uint256 count;
    uint256 lastWavedAt;
}

struct Wave {
    address waver; // The address of the user who waved.
    string message; // The message the user sent.
    uint256 timestamp; // The timestamp when the user waved.
}

contract WavePortal {
    event NewWave(address indexed from, uint256 timestamp, string message);

    uint256 totalWaves;
    uint256 totalKeys;
    Wave[] waves;
    mapping(address => Guest) wavers;
    mapping(uint => address) waversKeys;
    uint256 private seed;

    constructor() payable {
        console.log("Que miras bobo? Que miras boba? Andapallabobo");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        require(
            wavers[msg.sender].lastWavedAt + 15 minutes < block.timestamp,
            "Wait 15m"
        );

        console.log("%s has waved!", msg.sender);

        totalWaves += 1;
        if (wavers[msg.sender].count == 0) {
            waversKeys[totalKeys] = msg.sender;
            totalKeys += 1;
        }
        waves.push(Wave(msg.sender, _message, block.timestamp));
        wavers[msg.sender] = Guest({
            addr: msg.sender,
            count: wavers[msg.sender].count + 1,
            lastWavedAt: block.timestamp
        });

        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("Random # generated: %d", seed);

        if (seed <= 50) {
            console.log("%s won!", msg.sender);
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }
        emit NewWave(msg.sender, block.timestamp, _message);

    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

    function getWavers() public view {
        console.log("The following people waved!");
        for (uint i = 0; i < totalKeys; i++) {
            console.log("%s . %s waved", i, wavers[waversKeys[i]].addr);
        }
    }

    function getWaver(address addr) public view returns (Guest memory) {
        Guest memory waver = wavers[addr];
        console.log("Waver %s, waved %s times", waver.addr, waver.count);
        return wavers[addr];
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }
}
