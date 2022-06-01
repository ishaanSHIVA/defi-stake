// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract TokenFarm is Ownable {
    // stakeTokens - done
    //  unstakeToken
    // issueTokens - done
    // addAllowedTokens - done
    // getEthValue - done

    address[] public allowedTokens;

    // mappings for tracking hoe much stake Tokens to address
    // mapping token address -> staker address -> amount
    mapping(address => mapping(address => uint256)) public stakingBalance;
    address[] public stakers;
    // how much unique tokens have staked!
    mapping(address => uint256) public uniqueTokenStaked;

    mapping(address => address) public tokenPriceFeed;

    IERC20 public DAPP_TOKEN;

    //  Stake 100 ETH value
    // 1: 1
    // 100 eth => 100 token

    constructor(address _dappTokenAddress) public {
        DAPP_TOKEN = IERC20(_dappTokenAddress);
    }

    function setPriceFeedContract(address _token, address _priceFeed)
        public
        onlyOwner
    {
        tokenPriceFeed[_token] = _priceFeed;
    }

    function issueTokens() public onlyOwner {
        // Issue tokens to all stakers
        for (
            uint256 stakersIndex = 0;
            stakersIndex < stakers.length;
            stakersIndex++
        ) {
            address recipient = stakers[stakersIndex];
            // send token reward
            uint256 userTotalValue = getUserTotalValue(recipient);
            DAPP_TOKEN.transfer(recipient, userTotalValue);
        }
    }

    function getUserTotalValue(address _user) public view returns (uint256) {
        uint256 userTotal = 0;
        require(uniqueTokenStaked[_user] > 0);
        for (
            uint256 allowedTokensIndex = 0;
            allowedTokensIndex < allowedTokens.length;
            allowedTokensIndex++
        ) {
            userTotal += getUserSingleTokenValue(
                _user,
                allowedTokens[allowedTokensIndex]
            );
        }
        return userTotal;
    }

    function getUserSingleTokenValue(address _user, address _token)
        public
        view
        returns (uint256)
    {
        //  1 ETH => 2000 DOLLARS
        //  2000
        // 200 DAI => 200 eth
        // 200

        if (uniqueTokenStaked[_user] <= 0) {
            return 0;
        }

        // price of token * stakingBalance[_token][_user]

        // stakingBalance[_token][_user] => quantity of token staked

        // 10 ETH
        // eth/usd -> 100
        // 10*100 = 1000
        // 1000/
        (uint256 price, uint256 decimals) = getTokenValue(_token);
        return (stakingBalance[_token][_user] * price) / (10**decimals);
    }

    function getTokenValue(address _token)
        public
        view
        returns (uint256, uint256)
    {
        // price feed address
        address priceFeedAddress = tokenPriceFeed[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 decimals = priceFeed.decimals();
        return (uint256(price), decimals);
    }

    function stakeTokens(uint256 _amount, address _token)
        public
        returns (uint256)
    {
        // what token to stake
        // how much ?
        require(_amount > 0, "Amount must be greater than 0");
        require(tokenIsAllowed(_token), "Token not allowed");
        // whole point is line below;
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        updateUniqueTokensStaked(msg.sender, _token);

        // transferFrom function on ERC20 token
        // abi
        stakingBalance[_token][msg.sender] =
            _amount +
            stakingBalance[_token][msg.sender];
        if (uniqueTokenStaked[msg.sender] == 1) {
            stakers.push(msg.sender);
        }
        return stakingBalance[_token][msg.sender];
    }

    function unstakeTokens(address _token) public returns (uint256) {
        uint256 balance = stakingBalance[_token][msg.sender];
        require(balance > 0, "Balance must be greater than 0");
        IERC20(_token).transfer(msg.sender, balance);
        stakingBalance[_token][msg.sender] = 0;
        uniqueTokenStaked[msg.sender]--;
        return balance;
    }

    function updateUniqueTokensStaked(address _user, address _token) internal {
        // update unique tokens staked
        // if token is not in unique tokens staked
        // add token to unique tokens staked
        // if token is in unique tokens staked
        // do nothing
        if (stakingBalance[_token][_user] <= 0) {
            uniqueTokenStaked[_user] = uniqueTokenStaked[_user] + 1;
        }
    }

    function addAllowedTokens(address _token) public onlyOwner {
        // add allowed token
        allowedTokens.push(_token);
    }

    function tokenIsAllowed(address _token) public returns (bool) {
        for (
            uint256 allowedTokensIndex = 0;
            allowedTokensIndex < allowedTokens.length;
            allowedTokensIndex++
        ) {
            if (allowedTokens[allowedTokensIndex] == _token) {
                return true;
            }
        }
        return false;
    }
}
