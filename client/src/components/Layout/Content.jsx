import React from 'react'

import classNames from 'classnames'
import { createStyles, makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            //display: "-webkit-box",
            flex: 1,
            flexDirection: 'column',
            overflowY: 'scroll',
            background: '#FFF',
        },
        padding: {
            paddingLeft: 16,
            paddingRight: 16,
        },

        flex: {
            display: 'flex',
            //display: "-webkit-box",
            flex: 1,
            flexDirection: 'column',
        },
    })
)

export default React.forwardRef((props, ref) => {
    const classes = useStyles()
    const root = classNames({
        [classes.root]: true,
        [classes.flex]: props.flex,
        [classes.padding]: props.withoutPadding ? false : true,
    })
    return (
        <div className={root} ref={ref} id="circled-content" {...props}>
            {props.children}
        </div>
    )
})
