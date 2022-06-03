import {makeStyles} from "@material-ui/core"

const styles = makeStyles(
    (theme) => ({
        container: {
            display: 'inline-grid',
            gridTemplateColumns: "auto auto auto",
            gap: theme.spacing(1),
            alignItems: 'center',

        },
        tokenImg: {
             width: '32px'
        },
        amount: {
            fontWeight: 700
        }
    })
)


interface BalanceMessageProps {
    label: string,
    amount: number,
    tokenImageSrc: string,
}

export const BalanceMessage: React.FC<BalanceMessageProps>  = (props: BalanceMessageProps ) => {
    const classes = styles();

    const { label, amount, tokenImageSrc } = props;

    return (
        <div className={classes.container}>
            <div className="">{label}</div>
            <div className={classes.amount}>{amount}</div>
            <img src={tokenImageSrc} className={classes.tokenImg} />
        </div>
    )
}