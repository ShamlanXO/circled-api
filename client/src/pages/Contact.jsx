// @mui
import { styled } from '@mui/material/styles'
import { Grid, Container, Typography } from '@mui/material'
// components
import Page from '../components/Page'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
import ArrowRight from 'src/assets/IconSet/ArrowRight'
import Smile from 'src/assets/IconSet/Smile'
import Question from 'src/assets/IconSet/Question'
import Support from 'src/assets/IconSet/Support'
import Message from 'src/assets/IconSet/Message'
import DFT from 'src/assets/IconSet/Dft'
import Notification from 'src/assets/IconSet/Notification'
import Share from 'src/assets/IconSet/Share'
import Email from 'src/assets/IconSet/Email'
import Image from 'src/assets/IconSet/Image'
import Profile from 'src/assets/IconSet/Profile'
import Qrcode from 'src/assets/IconSet/Qrcode'
import Eye from 'src/assets/IconSet/eye'
import Globe from 'src/assets/IconSet/Globe'
import More from 'src/assets/IconSet/More'
import Camera from 'src/assets/IconSet/camera'
import Edit from 'src/assets/IconSet/edit'
import SnapChat from 'src/assets/IconSet/SnapChat'
import CheckDoc from 'src/assets/IconSet/CheckDoc'
import Archive from 'src/assets/IconSet/Archive'
import Payment from 'src/assets/IconSet/Payment'
import Settings from 'src/assets/IconSet/Setting'
import Add from 'src/assets/IconSet/Add'
import Send from 'src/assets/IconSet/Send'
import Program from 'src/assets/IconSet/Program'
import Delete from 'src/assets/IconSet/Delete'
import Client from 'src/assets/IconSet/Client'
import RestDay from 'src/assets/IconSet/RestDay'
import Cross from 'src/assets/IconSet/Cross'
import AddCircled from 'src/assets/IconSet/AddCircled'
import AddImage from 'src/assets/IconSet/AddImage'
import Bug from 'src/assets/IconSet/Bug'
import LibraryIcon from 'src/assets/IconSet/LibraryIcon'
import UploadIcon from 'src/assets/IconSet/UploadIcon'
import CheckIcon from 'src/assets/IconSet/SaveCheck'
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(8),
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(11),
    },
}))

// ----------------------------------------------------------------------

let Icons = [
    {
        name: 'ArrowLeft',
        icon: <ArrowLeft />,
    },
    {
        name: 'ArrowRight',
        icon: <ArrowRight />,
    },
    {
        name: 'Smile',
        icon: <Smile />,
    },
    {
        name: 'Question',
        icon: <Question />,
    },
    {
        name: 'Support',
        icon: <Support />,
    },
    { name: 'Message', icon: <Message /> },
    { name: 'DFT', icon: <DFT /> },
    {
        name: 'Notification',
        icon: <Notification />,
    },
    {
        name: 'Share',
        icon: <Share />,
    },
    {
        name: 'Email',
        icon: <Email />,
    },
    {
        name: 'Image',
        icon: <Image />,
    },
    {
        name: 'Profile',
        icon: <Profile />,
    },
    {
        name: 'Qrcode',
        icon: <Qrcode />,
    },
    {
        name: 'Eye',
        icon: <Eye />,
    },
    {
        name: 'Globe',
        icon: <Globe />,
    },
    {
        name: 'More',
        icon: <More />,
    },
    {
        name: 'Camera',
        icon: <Camera />,
    },
    {
        name: 'Edit',
        icon: <Edit />,
    },
    {
        name: 'SnapChat',
        icon: <SnapChat />,
    },
    {
        name: 'CheckDoc',
        icon: <CheckDoc />,
    },
    {
        name: 'Archive',
        icon: <Archive />,
    },
    {
        name: 'Bug',
        icon: <Bug />,
    },
    {
        name: 'Payment',
        icon: <Payment />,
    },
    {
        name: 'Settings',
        icon: <Settings />,
    },
    {
        name: 'Add',
        icon: <Add />,
    },
    {
        name: 'Send',
        icon: <Send />,
    },
    {
        name: 'Program',
        icon: <Program />,
    },
    {
        name: 'Delete',
        icon: <Delete />,
    },
    {
        name: 'Client',
        icon: <Client />,
    },
    {
        name: 'RestDay',
        icon: <RestDay />,
    },
    {
        name: 'Cross',
        icon: <Cross style={{ color: 'red' }} />,
    },
    {
        name: 'AddCircled',
        icon: <AddCircled />,
    },
    {
        name: 'AddImage',
        icon: <AddImage style={{ fontSize: 32 }} />,
    },
    {
        name: 'LibraryIcon',
        icon: <LibraryIcon sttyle={{ fontSize: 32 }} />,
    },
    {
        name: 'upload',
        icon: <UploadIcon sttyle={{ fontSize: 32 }} />,
    },
    {
        name: 'check',
        icon: <CheckIcon sttyle={{ fontSize: 32 }} />,
    },
]
export default function Contact() {
    return (
        <Page title="Contact us">
            <RootStyle>
                <Container sx={{ my: 2 }}>
                    <Grid
                        container
                        spacing={4}
                        align={'center'}
                        justify={'center'}
                    >
                        {Icons.map((Icon, index) => (
                            <Grid item xs={3}>
                                {Icon.icon}
                                <Typography sx={{ fontWeight: 500 }}>
                                    {Icon.name}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </RootStyle>
        </Page>
    )
}
