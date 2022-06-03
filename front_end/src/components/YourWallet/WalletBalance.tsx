import {Token} from "../Main"
import { useEthers ,useTokenBalance} from "@usedapp/core";
import { formatUnits } from '@ethersproject/units'
import {BalanceMessage} from "../BalanceMessage"


export interface WalletBalanceProps {
    token: Token, //
}

export const WalletBalance = ({token}:WalletBalanceProps) => {
    const { image,address,name } = token;
    const { account } = useEthers()

    console.log(address,account)

    const tokenBalance = useTokenBalance(address,account)
    const formattedtokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance,18)) : 0

    if (formattedtokenBalance) {
            console.log("TOKEN BALANCE :- ",formattedtokenBalance)

    }

    return  (
        <BalanceMessage
            label={`Your unstaked ${name} balance`}
            tokenImageSrc={image}
            amount={formattedtokenBalance}
        />
    )



}