import React from 'react'
import { useRef, useEffect, useState } from 'react'
// @material-ui/core components
import { createStyles, makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            position: 'fixed',
            bottom: 0,
            width: '100%',
            paddingBottom: `max(12px,env(safe-area-inset-bottom))`,
            backgroundColor: 'white',
            zIndex: 1000,
        },
    })
)
export default function SectionNavbars(props) {
    const classes = useStyles()
    const myRef = useRef(null)
    const [height, setHeight] = useState(props?.height || 0)
    useEffect(() => {
        if (myRef.current) {
            setHeight(myRef.current.clientHeight)
        }
    }, [myRef, props.height])

    return (
        <div
            style={{
                backgroundColor: props?.outerbg || '#fff',

                width: '100%',

                height: props.height
                    ? props.height
                    : props.actionButton
                    ? height + 20
                    : height,
                border: props?.bordered ? '1px solid #ECEEEF' : undefined,
            }}
        >
            <div
                className={classes.root}
                ref={myRef}
                {...props}
                style={
                    props?.actionButton
                        ? {
                              boxShadow:
                                  props?.withboxShadow &&
                                  '0px 4px 54px 0px #E1E7F0',
                              marginBottom: 20,
                              borderTopRightRadius: props?.borderRadius,
                              borderTopLeftRadius: props?.borderRadius,
                          }
                        : {
                              boxShadow:
                                  props?.withboxShadow &&
                                  '0px 4px 54px 0px #E1E7F0',
                              borderTopRightRadius: props?.borderRadius,
                              borderTopLeftRadius: props?.borderRadius,
                          }
                }
            >
                {props?.actionButton ? (
                    <div>{props.children}</div>
                ) : (
                    props.children
                )}
            </div>
        </div>
    )
}
