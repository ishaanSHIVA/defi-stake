import { useEthers ,useContractFunction} from '@usedapp/core'
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import { useEffect,useState } from 'react'
import networkMapping from "../chain-info/deployments/map.json"
import { constants } from "ethers"
import { utils } from 'ethers'
import { Contract } from "@ethersproject/contracts"

export const  useStakeToken = (tokenAddress: string) => {

    
    // TOKEN FARM CONTRACT ADDRESS

    // chainId
    const { chainId } = useEthers()

    // address
    const tokenFarmAddress = chainId ?  networkMapping[String(chainId)]["DappToken"][0] : constants.AddressZero

    // abi
    const { abi } = TokenFarm

    // interface
    const tokenFarmInterface = new utils.Interface(abi)

    // TokenFarm Contract
    const tokenFarmContract = new Contract(tokenFarmAddress,tokenFarmInterface)

    

    // ERC20 INTERFACE 
    const erc20Interface = new utils.Interface(ERC20.abi)
    const erc20Contract = new Contract(tokenAddress,erc20Interface)


    // APPROVE

    const {
        send: approveERC20,
        state : stateApproveERC20
     } = useContractFunction(
         erc20Contract,
         "approve",
         {
             transactionName:"Approve Contract"
         }
     )

     const [amountToStake,setAmountToStake] = useState<String>();

     const approve = (amount: string) => {
         console.log("approve ", amount)
         setAmountToStake(amount);
         return approveERC20( tokenFarmAddress, amount)
     }

    //  stake tokens
    //  stakeTokens(uint256 _amount, address token)
     const {
         send: stakeSend,
         state,
     } = useContractFunction(
            tokenFarmContract,
            "stakeTokens",
            {
                transactionName:"Stake Tokens"
            }
     )

    //  const [state,setState] = useState(stateApproveERC20)

    // useEffect
    useEffect(() => {
        // if stateapproved then stake the token
        if (stateApproveERC20.status === "Success") {
            console.log("Approved")
            console.log("sending stake tokens!!!")
            stakeSend(amountToStake,tokenAddress)
            console.log("state tokens completed!")
        }
    },[stateApproveERC20])

     return {approve,stateApproveERC20}



    // stake tokens

}