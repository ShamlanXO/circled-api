import * as React from 'react'
import PropTypes from 'prop-types'
import { IMaskInput } from 'react-imask'
import NumberFormat from 'react-number-format'
import InputBase from '@mui/material/InputBase'
import { Input, OutlinedInput } from '@mui/material'

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(
    props,
    ref
) {
    const { onChange, suffix, prefix, ...other } = props

    return (
        <NumberFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                })
            }}
            prefix={prefix}
            isNumericString
            suffix={suffix}
        />
    )
})

NumberFormatCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default function FormattedInputs(props) {
    return (
        <OutlinedInput
            variant="outlined"
            {...props}
            sx={{ textAlign: 'center' }}
            inputProps={{
                suffix: props.suffix,
                prefix: props.prefix,
                ...props.inputProps,
                style: {
                    textAlign: 'center',
                },
            }}
            inputComponent={NumberFormatCustom}
            helper
        />
    )
}
