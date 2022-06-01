from brownie import network, exceptions
from scripts.helpful_scripts import (
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
    get_account,
    get_contract,
    INITIAL_VALUE
)
import pytest
from scripts.deploy import deployTokenFarm_and_deploydapp_token


def test_set_price_feed():
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    account = get_account()
    non_owner = get_account(index=1)
    token_farm, dapp_token = deployTokenFarm_and_deploydapp_token()

    # Act
    priceFeedAddress = get_contract("eth_usd_price_feed")
    token_farm.setPriceFeedContract(
        dapp_token.address, priceFeedAddress, {"from": account}
    )
    # Assert
    assert token_farm.tokenPriceFeed(dapp_token.address) == priceFeedAddress
    with pytest.raises(exceptions.VirtualMachineError):
        token_farm.setPriceFeedContract(
            dapp_token.address, priceFeedAddress, {"from": non_owner}
        )


def test_stake_tokens(amount_staked):
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    account = get_account()
    token_farm, dapp_token = deployTokenFarm_and_deploydapp_token()
    # Act
    dapp_token.approve(token_farm.address, amount_staked, {"from": account})
    token_farm.stakeTokens(amount_staked, dapp_token.address, {"from": account})
    # Assert
    assert (
        token_farm.stakingBalance(dapp_token.address, account.address) == amount_staked
    )
    assert token_farm.uniqueTokenStaked(account.address) == 1
    assert token_farm.stakers(0) == account.address
    return (
        token_farm,
        dapp_token,
    )


def test_issue_tokens(amount_staked):
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    account = get_account()
    token_farm, dapp_token = test_stake_tokens(amount_staked)
    startingBalance = dapp_token.balanceOf(account.address)
    # Act
    token_farm.issueTokens({"from": account})
    # Assert
    # we are staking 1 dappToken == 1 eth token
    # we should get 2000 dappTokens in reward
    # since the price of eth is $2000
    assert dapp_token.balanceOf(account.address) == startingBalance + INITIAL_VALUE
