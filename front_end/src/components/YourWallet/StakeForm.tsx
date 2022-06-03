import { useEthers ,useTokenBalance} from "@usedapp/core"
import { formatUnits } from "@ethersproject/units";
import React, { useState } from "react"


import { Button,Input } from "@material-ui/core"

import {useStakeToken}  from "../../hooks";
import { Token } from "../Main"

import { utils } from "ethers"

export interface StakeFormProps {
    token: Token,

}



export const StakeForm = ({ token }: StakeFormProps ) => {
    const { address, name } = token;
    const {  account } = useEthers();

    const tokenBalance = useTokenBalance(address,account)
    const formattedtokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance,18)) : 0

    const [amount,setAmount] = useState<number | string | Array<number | string> >(0)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === '' ? "" : Number(event.target.value)
        setAmount(newAmount);
        console.log(amount)
    }

    const {approve,stateApproveERC20} = useStakeToken(address)

    const handleStakeSubmit = () => {
        const amtToWei = utils.parseEther(String(amount))
        return approve(String(amtToWei))
    }

    


    return (
        <>
            <Input onChange={handleInputChange} value={amount} />
            <Button onClick={handleStakeSubmit} color="primary" size="large" >
                STAKE!!!
            </Button>
        </>
    )

    


}