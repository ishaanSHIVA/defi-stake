import { useEthers } from '@usedapp/core'
import { useEffect } from 'react'
import { makeStyles,Button } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        padding: theme.spacing(4),
        justifyContent: 'flex-end',
        gap : theme.spacing(1)

    }
}))

export const Header = () => {
        const classes = useStyles()
        const { activateBrowserWallet, account ,deactivate } = useEthers()

        const isConnected = account != null

        useEffect(() => {
            console.log("Account :- ",account)
        },[account])
        
        

        return (
            <div className={classes.container}>
            <div>
                {
                    isConnected ? (
                    <Button variant={"contained"} color="primary"
                    onClick={deactivate}
                    
                    >
                    
                        Disconnect
                    </Button>) : (
                        <Button variant={"contained"} color="secondary"
                             onClick={() => activateBrowserWallet()}

                        >
                        Connect
                    </Button>
                    )
                }
            </div>
            </div>
        )

}