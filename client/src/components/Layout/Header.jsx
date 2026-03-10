import React from 'react';
// @material-ui/core components
import { createStyles, makeStyles } from '@mui/styles';
import { AppBar } from '@mui/material';
import { useRef, useEffect, useState } from 'react';
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      color: '#000',
      boxShadow: 'none',
    },
  }),
);
export default function SectionNavbars(props) {
  const classes = useStyles();
  const myRef = useRef(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (myRef.current) {
      setHeight(myRef.current.clientHeight);
    }
  }, [myRef?.current?.clientHeight, props.headerDependency]);
  return (
    <div
      style={{
        height: props.position == 'fixed' ? 0 : props.reducedHeight ? height - props.reducedHeight : height,
      }}
    >
      <AppBar
        ref={myRef}
        className={classes.root}
        color="primary"
        position={props.position || 'fixed'}
        style={{
          background: props.noColor ? 'transparent' : '#fff',
          boxShadow: props.boxShadow ? '0px 4px 54px rgba(225, 231, 240, 0.5)' : 'none',
          ...props.style,
          color: '#000',
        }}
      >
        {props.children}
      </AppBar>
    </div>
  );
}
