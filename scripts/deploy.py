from audioop import add
from scripts.helpful_scripts import get_account, get_contract
from brownie import DappToken, TokenFarm, network, config
from web3 import Web3
import json
import yaml
import shutil
import os


KEPT_BALANCE = Web3.toWei(100, "ether")


def add_allowed_tokens(tokenFarm, dictOfAllowedTokens, account):
    for token in dictOfAllowedTokens:
        add_tx = tokenFarm.addAllowedTokens(token.address, {"from": account})
        add_tx.wait(1)
        set_tx = tokenFarm.setPriceFeedContract(
            token.address, dictOfAllowedTokens[token], {"from": account}
        )
        set_tx.wait(1)

    return tokenFarm


def deploy_token_farm_and_dapp_token(updateFrontEnd=False):
    account = get_account()
    dapp_token = DappToken.deploy({"from": account})
    tokenFarm = TokenFarm.deploy(
        dapp_token.address,
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )

    tx = dapp_token.transfer(
        tokenFarm.address, dapp_token.totalSupply() - KEPT_BALANCE, {"from": account}
    )
    tx.wait(1)

    # dapp_token,wethToken,fauToken

    dictOfAllowedTokens = {}

    weth_token = get_contract("weth_token")
    fau_token = get_contract("fau_token")

    print(f"Weth token : ", weth_token)
    print(f"Fau token : ", fau_token)

    dictOfAllowedTokens = {
        dapp_token: get_contract("dai_usd_price_feed"),
        weth_token: get_contract("eth_usd_price_feed"),
        fau_token: get_contract("dai_usd_price_feed"),
    }

    if updateFrontEnd:
        update_front_end()

    add_allowed_tokens(tokenFarm, dictOfAllowedTokens, account)
    return tokenFarm, dapp_token


def copy_folders_to_front_end(src, destination):
    if os.path.exists(destination):
        shutil.rmtree(destination)
    shutil.copytree(src, destination)


def update_front_end():

    # send build folder to front end

    copy_folders_to_front_end("build", "front_end/src/chain-info")

    # sending brownie config in json to front end
    with open("brownie-config.yaml", "r") as file:
        config_dict = yaml.load(file, Loader=yaml.FullLoader)
        with open("front_end/src/brownie-config.json", "w") as brownieConfigJson:
            json.dump(config_dict, brownieConfigJson)
        print(f"Front end updated")


def main():
    deploy_token_farm_and_dapp_token(True)
