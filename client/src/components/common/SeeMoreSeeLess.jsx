import React, { useState } from 'react';
import { Collapse, Button, Typography } from '@mui/material';

const SeeMoreSeeLess = ({  collapsedHeight = 100,children }) => {
    const [expanded, setExpanded] = useState(false);

    const handleToggle = () => {
        setExpanded(!expanded);
    };

    return (
        <div>
            <Collapse in={expanded} collapsedSize={collapsedHeight}>
               {children}
            </Collapse>
            <Button sx={{fontSize:16,px:0}}  size={"small"} onClick={handleToggle}>
                {expanded ? 'See less' : 'See more'}
            </Button>
        </div>
    );
};

export default SeeMoreSeeLess;