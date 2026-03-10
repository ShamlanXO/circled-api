import React, { useState, useCallback, useRef } from 'react'
// import { connect } from "react-redux";
// import Box from "@material-ui/core/Box";
import Cropper from 'react-easy-crop'
import decode from "heic-decode"
import {getCroppedImg} from './cropImage'
// import Button from "components/CustomButtons/Button";
import Container from 'src/components/Layout/Container'
import Content from 'src/components/Layout/Content'
import Header from 'src/components/Layout/Header'
import Box from '@mui/material/Box'

import Footer from 'src/components/Layout/Footer'
import { makeStyles } from '@mui/styles'
import CircularProgress from '@mui/material/CircularProgress'
import { updateFeedback } from 'src/redux/actions/feedback'
import { useDispatch } from 'react-redux'
import {
    AppBar,
    Button,
    Dialog,
    Grid,
    IconButton,
    Toolbar,
    Typography,
} from '@mui/material'
import Iconify from 'src/components/Iconify'
import { set } from 'lodash'
// const givenImgSudoUrl =
//   'https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000'

const useStyles = makeStyles((theme) => ({
    cropContainer: {
        position: 'relative',
        width: 'calc(100vw- 5px)',
        height: 'auto',
        minHeight: '50vh',
    },

    back: {
        background: '#fff',
    },

    appBar: {
        backgroundColor: '#333',
        boxShadow: 'none',
    },

    cropButton: {
        padding: '50px 25px',
    },

    controls: {
        // padding: 16,
        display: 'flex',
        flexDirection: 'column',
        // alignItems: "stretch",
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
            alignItems: 'center',
        },
    },
    sliderContainer: {
        display: 'flex',
        flex: '1',
        alignItems: 'center',
    },
    sliderLabel: {
        [theme.breakpoints.down('xs')]: {
            minWidth: 55,
        },
    },

    slider: {
        padding: '0px 0px',
        // marginLeft: -10,
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
            alignItems: 'center',
            // margin: "0 16px",
        },
    },
}))

const Input = (props) => {
    const myRef = useRef(null)
    // const theme = useTheme();
    const classes = useStyles()
    // const [givenImg, setGivenImg] = useState(givenImgSudoUrl)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [loading, setLoading] = useState(false)
    const [zoom, setZoom] = useState(1)
    const [modal, setModal] = useState(false)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const [picture, setPicture] = useState(null)
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const showCroppedImage = async () => {
        dispatch(updateFeedback({ loading: true }))
        try {
            const croppedImage = await getCroppedImg(
               picture,
                croppedAreaPixels,
                0
            )
         
            let file = new File(
                [croppedImage],
                `${props.placeholder}${new Date().getTime()}`,
                { lastModified: new Date().getTime() }
            )

            if (props.onChange) {
                props.onChange({ target: { files: [file] } })
                setModal(false)
            }
        } catch (e) {
            alert('error',e)
            console.error(e)
        }
    }


    const dispatch = useDispatch()
    const onImageChange = async (event) => {
       
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0]
            let imageDataUrl = await readFile(file)
            setPicture(imageDataUrl)
            // if (file.type === 'image/heic') {
            //     const reader = new FileReader()
            //     reader.addEventListener('load', 
            //       async function (result) {
            //         try {
            //         const decodedImage = await decode({ buffer: Buffer.from(reader.result) });
            //         const imageData = new ImageData(
            //           new Uint8ClampedArray(decodedImage.data),
            //           decodedImage.width,
            //           decodedImage.height
            //         );
                    
            //         const canvas = document.createElement('canvas');
            //         canvas.width = imageData.width;
            //         canvas.height = imageData.height;
            //         const ctx = canvas.getContext('2d');
            //         ctx.putImageData(imageData, 0, 0);
            //         const url = canvas.toDataURL();
            //         setPicture(url)
            //         setLoading(false)
                    
            //         } catch(e) {
            //             setLoading(false)
                    
            //         }
            //       }
            //     , false)
            //     reader.readAsArrayBuffer(file)
            //     // const blob = new Blob([data], { type: 'image/jpeg' })
            //     // const url = URL.createObjectURL(blob)
            //     // setPicture(url)
            // } else {
            //     setLoading(false)
                
            // }
        }
    }
    function readFile(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.addEventListener('load', 
            async function (result) {
              try {
              const decodedImage = await decode({ buffer: Buffer.from(reader.result) });
              const imageData = new ImageData(
                new Uint8ClampedArray(decodedImage.data),
                decodedImage.width,
                decodedImage.height
              );
              const canvas = document.createElement("canvas");
              canvas.width = decodedImage.width;
              canvas.height = decodedImage.height;
              const ctx = canvas.getContext("2d");
              ctx.putImageData(imageData, 0, 0);
              resolve(canvas.toDataURL('image/jpeg', 1.0))
              } catch(e) {
                reject(e);
              }
            }
          , false)
          reader.readAsArrayBuffer(file)
        }).catch(() => new Promise((resolve) => {
          const reader = new FileReader()
          reader.addEventListener('load', () => resolve(reader.result), false)
          reader.readAsDataURL(file)
        }));
      }
    return (
        <>
            {/* <Button onClick={(e)=>document.getElementById("filepicker").click()}>Click here</Button>  */}
            <input
                
                style={{ display: 'none' }}
                type="file"
                id={props.id ? props.id : 'filepicker'}
                onClick={(e) => (e.target.value = null)}
                
                onChange={(e) => {
                    onImageChange(e)
                    setModal(true)
                }}
            />
            <Dialog
                fullScreen
                open={modal}
                style={{ background: '#fafafa', height: '100vh' }}
                classes={{ scrollPaper: classes.back, paper: classes.back }}
            >
                <Container>
                    <Header>
                        <AppBar style={{ background: '#fff', zIndex: 1000 }}>
                            <Toolbar style={{ zIndex: 1000 }}>
                                <IconButton onClick={() => setModal(false)}>
                                    <Iconify
                                        icon="eva:arrow-ios-back-fill"
                                        color="#000"
                                    />
                                </IconButton>
                                Crop Image
                            </Toolbar>
                        </AppBar>
                    </Header>
                    <Content
                        withoutPadding
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            flexGrow: 1,
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                flexGrow: 1,
                            }}
                        >
                            <div className={classes.cropContainer} style={{display:"flex",alignContent:"center",justifyContent:"center"}}>
                               {loading? <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>

                               <CircularProgress/>
<Typography>Please wait processing image...</Typography>
                               
                               </Box>:<Cropper
                                    image={
                                        picture 
                                    }
                                    crop={crop}
                                    rotation={rotation}
                                    zoom={zoom}
                                    cropShape={props.cropShape || 'rect'}
                                    aspect={props.aspect ? props.aspect : 1.78}
                                    onCropChange={setCrop}
                                    //onRotationChange={setRotation}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />}
        
                            </div>
                            <Button
                            sx={{mt:4}}
                            onClick={showCroppedImage}
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Done
                        </Button>

                            {/* <ImgDialog img={croppedImage} onClose={onClose} /> */}
                        </div>
                        <div >
                        
                    </div>
                    </Content>
                    {/* <Footer> */}
                    
                    {/* </Footer> */}
                </Container>
            </Dialog>
        </>
    )
}

export default Input
