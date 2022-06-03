import {Token} from "../Main"
import {Box,Tab} from "@material-ui/core"
import {TabList,TabContext,TabPanel} from "@material-ui/lab"
import { useState } from 'react'
import React from 'react'

import {WalletBalance} from "./WalletBalance"
import { StakeForm } from "./StakeForm"


interface YourWalletProps {
    supportedTokens: Array<Token>;
}

export const YourWallet = ({ supportedTokens } : YourWalletProps) => {

    const [ selectedTokenIndex,setSelectedTokenIndex ] = useState<number>(0)

    const handleChange = ( event: React.ChangeEvent<{}> , newValue : string ) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    return (
        <Box>
            <h1>Your wallets!</h1>
            <Box>
                <TabContext value={selectedTokenIndex.toString()}>
                    <TabList onChange={handleChange} aria-label="stake form tabs">
                        {supportedTokens.map( (token,index) => {
                            return (
                                <Tab  label={token.name} value={index.toString()} key={index} />
                            )
                        })}
                    </TabList>
                    {supportedTokens.map( (token,index) =>{
                        console.log(supportedTokens[selectedTokenIndex]['address'])
                        return (
                            <TabPanel  
                                value={index.toString()}
                                key={index}
                            >
                                <div className="">
                                    <WalletBalance token={supportedTokens[selectedTokenIndex]} />
                                    <StakeForm token={supportedTokens[selectedTokenIndex]} ></StakeForm>
                                </div>
                            </TabPanel>
                        )
                    })}

                </TabContext>
            </Box>
        </Box>
    )

}