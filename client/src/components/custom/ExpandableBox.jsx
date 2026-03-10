import React, { useState } from 'react'
import { Box, Button, Collapse } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const ExpandableBox = ({ fixedHeight, expandedHeight, children, ...props }) => {
    const [expanded, setExpanded] = useState(false)

    const toggleExpanded = () => {
        setExpanded(!expanded)
    }

    return (
        <Box overflow="hidden" transition="height 1s" {...props}>
            <Collapse in={expanded} collapsedSize={fixedHeight}>
                {children}
            </Collapse>
            <center>
                {' '}
                <Button
                    onClick={toggleExpanded}
                    endIcon={<ExpandMoreIcon />}
                    size="small"
                    variant="text"
                    sx={{ fontSize: 16, color: 'text.primary', mt: 2 }}
                >
                    {expanded ? 'Show Less' : 'Show More'}
                </Button>
            </center>
        </Box>
    )
}

export default ExpandableBox
