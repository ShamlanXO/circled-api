// @mui
import { styled } from '@mui/material/styles'
// components
import Page from '../Page'
// sections
import {
    Avatar,
    Box,
    ButtonBase,
    IconButton,
    InputAdornment,
    ListItemButton,
    Stack,
    TextField,
    Typography,
} from '@mui/material'

import { IconButtonAnimate, varFade } from '../animate'
import Iconify from '../Iconify'
import DurationPopover from './durationPopover'
import { useNavigate } from 'react-router'
import { useRef, useState } from 'react'
import { validateEmail } from 'src/utils/validator'
import MOdal from '../../pages/createProgram/addEmailRecievers'
import { start } from 'nprogress'
// ----------------------------------------------------------------------

const WorkoutDay = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
    backgroundColor: '#fff',
    padding: '5px 10px',
    margin: '12px 0',
    boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
    borderRadius: '8px',
}))

const InsideBoxStyle = styled(Box)(() => ({
    position: 'absolute',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: 52,
    paddingBottom: 24,
    zIndex: 100,
    top: 0,
}))
const BoxStyle = styled(Box)(() => ({
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    maxWidth: 'xs',
    backgroundColor: '#F5F7FA',
    zIndex: 100,
    borderRadius: '8px',
}))
// ----------------------------------------------------------------------

export default function SendProgramEmails(props) {
    const [modalOpen, setModal] = useState(false)
    const { allRecievers, setAllRecievers, errors, navigate, modal, showText } =
        props

    const handleChangeData = (val, index) => {
        let newRecievers = [...allRecievers]
        newRecievers[index] = val
        setAllRecievers(newRecievers)
    }
    const handleAddNew = () => {
        let newRecievers = [...allRecievers]
        newRecievers.push('')
        setAllRecievers(newRecievers)
    }
    const handleDelete = (index) => {
        let newRecievers = [...allRecievers]
        newRecievers.splice(index, 1)
        setAllRecievers(newRecievers)
    }
    return (
        <Box>
            {' '}
            {showText && (
                <Typography variant="h6" color="text.primary">
                    <Typography
                        variant="subtitle1"
                        color="text.primary"
                        sx={{ fontWeight: 600, display: 'flex' }}
                    >
                        Send to &nbsp;
                        <Typography color="text.secondary">optional</Typography>
                    </Typography>
                </Typography>
            )}
            {allRecievers?.map((item, index) => (
                <Box
                    display={'flex'}
                    justifyContent="space-around"
                    alignItems={'center'}
                    style={{ marginTop: 8 }}
                    key={'reciever' + index}
                >
                    <TextFieldCOm
                        handleChangeData={handleChangeData}
                        item={item}
                        index={index}
                        errors={errors}
                    />

                    {/* <BoxStyle>
            <Box display="flex" alignItems={"center"}>
              <Typography variant="body1" color="text.primary">
                shamlan@gmail.com
              </Typography>
            </Box>
            <Box display="flex" alignItems={"center"}>
              <IconButton onClick={() => navigate("/workoutDay")}>
              
              </IconButton>
            </Box>
          </BoxStyle>{" "} */}
                    <IconButton
                        onClick={() => handleDelete(index)}
                        style={{ marginLeft: 2 }}
                    >
                        <Iconify
                            icon={'eva:close-fill'}
                            color="text.primary"
                            width={24}
                            height={24}
                        />
                    </IconButton>
                </Box>
            ))}
            <Box marginTop={2}>
                <ButtonBase
                InputAdornment={
                    {
                        startAdornment: (
                            <InputAdornment position="start">
                                <Iconify
                                    icon={'eva:email'}
                                    color="text.secondary"
                                    width={24}
                                    height={24}
                                />
                            </InputAdornment>
                        ),
                    }
                }
                    id="addmore"
                    onClick={() =>
                        modal && allRecievers.length
                            ? setModal(true)
                            : handleAddNew()
                    }
                >
                    &nbsp;&nbsp;
                    <Typography variant="subtitle1" color="primary.main">
                        Add more
                    </Typography>
                </ButtonBase>
            </Box>
            <MOdal
                open={modalOpen}
                handleClose={() => setModal(false)}
                allRecievers={allRecievers}
                setAllRecievers={setAllRecievers}
                errors={errors}
                showText
            />
        </Box>
    )
}

const TextFieldCOm = ({ item, index, handleChangeData, errors }) => {
    const ref = useRef(null)
    const [isFocused, setFocused] = useState(false)
    return (
        <TextField
            ref={ref}
            fullWidth
            flex={1}
            placeholder="example@email.com"
            value={item}
            type="email"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => {
                handleChangeData(e.target.value, index)
            }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <Iconify
                            icon={'wpf:message-outline'}
                            color="text.secondary"
                        />
                    </InputAdornment>
                ),
            }}
            error={!isFocused && errors?.[index] && item?.length}
            helperText={
                !isFocused && errors?.[index] && item?.length
                    ? 'Enter Valid email address'
                    : ''
            }
        />
    )
}
