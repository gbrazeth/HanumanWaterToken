// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockPriceFeed
 * @dev Mock do oráculo Chainlink para testes
 */
contract MockPriceFeed is AggregatorV3Interface, Ownable {
    int256 private _latestPrice;
    uint8 private constant _decimals = 8;
    string private constant _description = "Mock ETH/USD Price Feed";
    uint256 private _latestRoundId = 0;
    uint256 private _startedAt;
    uint256 private _updatedAt;
    
    constructor() Ownable(msg.sender) {
        _latestPrice = 200000000000; // $2000 com 8 casas decimais
        _startedAt = block.timestamp;
        _updatedAt = block.timestamp;
    }
    
    function setLatestPrice(int256 price) external onlyOwner {
        _latestPrice = price;
        _latestRoundId++;
        _updatedAt = block.timestamp;
    }
    
    function decimals() external pure override returns (uint8) {
        return _decimals;
    }
    
    function description() external pure override returns (string memory) {
        return _description;
    }
    
    function version() external pure override returns (uint256) {
        return 1;
    }
    
    function getRoundData(uint80 _roundId) external view override returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) {
        return (
            uint80(_roundId),
            _latestPrice,
            _startedAt,
            _updatedAt,
            uint80(_roundId)
        );
    }
    
    function latestRoundData() external view override returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) {
        return (
            uint80(_latestRoundId),
            _latestPrice,
            _startedAt,
            _updatedAt,
            uint80(_latestRoundId)
        );
    }
}
