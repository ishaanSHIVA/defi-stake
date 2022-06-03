/* eslint-disable spaced-comment  */
/// <reference types="react-scripts" />

import { useEthers } from "@usedapp/core"
import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import brownieConfig from "../brownie-config.json"
import { constants } from "ethers"
import { Container } from "@material-ui/core"
import dappImage from "../dapp.png"
import daiImage from "../dai.png"
import ethImage from "../eth.png"
import {YourWallet} from "./YourWallet/YourWallet"


export type Token = {
    image : string,
    address : string,
    name: string
}


export const Main = () => {
    // Show token values

    // Get addresses of diff values
    // Get balances of diff values

    // send brownieconfig file and build folder 

    const { chainId } = useEthers()

    

    if (chainId) {
        console.log('Chain ID :- ',chainId.toString())
    }

    const networkName = chainId ? helperConfig[chainId.toString()] : "dev"

    if (networkName) {
        console.log("network Name: " + networkName)
    }

    const dappTokenAddress = chainId ?  networkMapping[String(chainId)]["DappToken"][0] : constants.AddressZero

    if (dappTokenAddress) {
        console.log("DappToken Address :- ",dappTokenAddress)
    }

    const wethTokenAddress = chainId ? brownieConfig["networks"][networkName.toLowerCase()]['weth_token'] : constants.AddressZero

    if (wethTokenAddress ) {
        console.log("Weth Address :- ",wethTokenAddress )
    }

    const fauTokenAddress = chainId ? brownieConfig["networks"][networkName.toLowerCase()]['fau_token'] : constants.AddressZero

    if (fauTokenAddress ) {
        console.log("Fau Address :- ",wethTokenAddress )
    }

    const supportedTokens: Array<Token> = [
        {
            image: dappImage,
            address: dappTokenAddress,
            name: "DAPP"
        },
        {
            image: ethImage,
            address: wethTokenAddress,
            name: "ETH"
        },
        {
            image: daiImage,
            address: fauTokenAddress,
            name: "DAI"
        },

    ]

    // const dappTokenAddress = 
    return (
        <Container>
            <YourWallet supportedTokens={supportedTokens}/>
        </Container>
    )
}