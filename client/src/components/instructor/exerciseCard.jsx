// @mui
import { styled } from '@mui/material/styles'
// components
import Page from '../Page'
// sections
import {
    Avatar,
    Box,
    IconButton,
    ListItemButton,
    Stack,
    Typography,
    Button,
    ButtonBase,
    Divider,
} from '@mui/material'
import { useEffect } from 'react'
import axios from 'axios'
import { IconButtonAnimate, varFade } from '../animate'
import Iconify from '../Iconify'
import DurationPopover from './durationPopover'
import { useNavigate } from 'react-router'
import MenuPopover from '../MenuPopover'
import { useRef, useState } from 'react'
import UpdateWorkoutDay from './updateWorkoutDayPopOver'
import { computePath } from 'src/utils/routepath'
import CircularProgress from 'src/components/progress/Circular'
import { useSelector } from 'react-redux'
// ----------------------------------------------------------------------
import EditExerciseCard from './exerciseCardEdit'
const BoxStyle = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 10px',
    maxWidth: 'xs',
    zIndex: 100,
}))
const WorkoutDay = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '12px 0',
}))

const RootStyle = styled(Box)(() => ({
    backgroundColor: '#fff',
    padding: '16px',
    // margin: "12px 0",
    boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
    borderRadius: '16px',
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

// ----------------------------------------------------------------------

export default function ExerciseCard(props) {
    const { newCard } = props
    const navigate = useNavigate()
    const [editMode, setEditMode] = useState(props.newCard)
    const uploadData = useSelector((s) =>
        Object.values(s.Sync.programs).filter(
            (i) =>
                i.week == props.w && i.day == props.d && i.index == props.index
        )
    )
    return (
        <EditExerciseCard
            {...props}
            setEditMode={setEditMode}
            onClickDelete={props.deleteExercise}
            clientSide={props.clientSide}
        />
    )
}

const VideoImage = (props) => {
    const [url, setUrl] = useState('')
    useEffect(() => {
        axios
            .get(
                `https://vimeo.com/api/oembed.json?url=https://player.vimeo.com/video/${
                    props?.link?.split('https://vimeo.com/')[1]
                }`
            )
            .then((res) => {
                setUrl(
                    props.withPlay
                        ? res.data.thumbnail_url_with_play_button
                        : res.data.thumbnail_url
                )
            })
    }, [props.link])

    return (
        <Avatar
            onClick={props.onClick}
            variant="rounded"
            sx={{ width: '60px', height: '60px', marginRight: 1 }}
            src={url || '/images/instructor/exerciseImage.png'}
        />
    )
}
