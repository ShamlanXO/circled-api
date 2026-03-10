import React from 'react'
// @material-ui/core components
import Fade from '@mui/material/Fade'
import { createStyles, makeStyles } from '@mui/styles'
import { PullToRefresh } from 'react-js-pull-to-refresh'
import {
    PullDownContent,
    ReleaseContent,
    RefreshContent,
} from 'react-js-pull-to-refresh'
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100vh',
        display: 'flex',
        background: '#fff',
        //display: "-webkit-box",
        flexDirection: 'column',
        '& video': {
            objectFit: 'contain',
        },
    },
}))
export default function SectionNavbars(props) {
    const classes = useStyles()
    return (
        <Fade in={true} timeout={700}>
            <div
                className={classes.root}
                style={{ touchAction: 'none', ...props.style }}
            >
                {props.children}
            </div>
        </Fade>
    )
}
