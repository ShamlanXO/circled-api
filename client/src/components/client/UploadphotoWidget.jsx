// @mui
import { styled } from '@mui/material/styles'
// components
import Page from '../Page'
// sections
import {
    Avatar,
    Button,
    Box,
    InputAdornment,
    Stack,
    Grid,
    Typography,
    ButtonBase,
    Badge,
} from '@mui/material'
import React, { useEffect } from 'react'
import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
import { IconButtonAnimate, varFade } from '../animate'
import Iconify from '../Iconify'
import { handleuploadImage } from 'src/utils/uploader'
import { useState } from 'react'
import { updateProfile } from 'src/redux/actions/Profile'
import { useDispatch , useSelector } from 'react-redux'

import LightboxModal from 'src/components/LightboxModal'
import Image from 'src/assets/IconSet/AddImage3'
import Add from 'src/assets/IconSet/AddCircled'

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

const UploadNewPhotoForm = React.forwardRef(({ data, setData,mode }, ref) => {
    const [selectedImage, setSelectedImage] = useState(0)
    const [openLightbox, setOpenLightbox] = useState(false)
    const bodyImages=useSelector((state)=>state.Profile.bodyImages)
    const dispatch = useDispatch()
    const [images, setImages] = useState([...data])


 
    let setUserImages = (e) => {
      
        setImages([...images, ...e.target.files])
         let preSet=[...images]
 
            Promise.all(
                [...e.target.files].map(
                    async (image) => {
                        return handleuploadImage({
                            target: { files: [image] },
                        })
                    }
                )
            ).then((res) => {
                setImages([...preSet, ...res.map((i) => i.data.Location),])
                setData([...preSet, ...res.map((i) => i.data.Location),])
               // dispatch(updateProfile({bodyImages:[...preSet, ...res.map((i) => i.data.Location),]}))
            })
    }

    const deleteItem = (i) => {
        setImages(
            images.filter((im) => {
                if (
                    i?.includes &&
                    i?.includes('https://') &&
                    im?.includes &&
                    im?.includes('https://')
                ) {
                    return im !== i
                } else {
                    return im?.name !== i?.name
                }
            })
        )
    }



   
    
    return (
       <>
       <Grid container spacing={2} sx={{mt:1,mb:4}}>
      { mode!=="edit"&&images.length==0?<Typography color={"text.secondary"} sx={{ml:2}}>No images uploaded</Typography>:null}
       {images.map((image, index) => {
                            return (
                                <Grid item xs={4} md={6}>
                                      <Box
                            
                                    onClick={() => {
                                        setSelectedImage(index)
                                        setOpenLightbox(true)
                                    }}
                                    sx={{
                                        position: 'relative',
                                       height: 105,
                                       width:"100%",
                                        borderRadius: 2,
                                      
                                        borderColor: '#C3CBD9',
                                        backgroundColor: 'grey.300',
                                        backgroundImage: `url(${
                                            image?.includes &&
                                            image.includes('https')
                                                ? image
                                                : URL.createObjectURL(image)
                                        })`,
                                        backgroundSize: 'cover',
                                    }}
                                >
                                   {mode=="edit"? <IconButtonAnimate
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            deleteItem(image)
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            top: -12,
                                            right: -12,
                                            zIndex: 12,
                                            border: 2,
                                            borderColor: 'common.white',
                                            backgroundColor: '#EE3737',
                                        }}
                                        size={'small'}
                                    >
                                        <Iconify
                                            icon="material-symbols:close-rounded"
                                            width={18}
                                            height={18}
                                            color={'common.white'}
                                        />
                                    </IconButtonAnimate>:""}
                                </Box>
                                </Grid>
                              
                            )
                        })}
                       {mode=="edit"?      <Grid item xs={4} md={6}>
                                      <Box
                             
                                   
                                    sx={{
                                        position: 'relative',
                                       height: 105,
                                       width:"100%",
                                        borderRadius: 2,
                                      
                                        backgroundSize: 'cover',
                                    }}
                                >
                                     <ButtonBase
                        sx={{
                            width: "100%",
                            height:"100%",
                          
                            border: '2px dashed',
                            borderColor: 'primary.main',
                            color: 'text.secondary',

                            borderRadius: 2,
                        }}
                        onClick={(e) => {
                            document.getElementById('profilePhoto').click()
                        }}
                    >
                        {/* <Badge
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            anc
                            badgeContent={
                                <Add
                                    color={'primary.main'}
                                    sx={{
                                        color: 'primary.main',
                                        fontSize: 16,
                                        mt: -1,
                                        ml: -1,
                                    }}
                                />
                            }
                        > */}
                            <Image color="primary" style={{ fontSize: 48 }} />
                        {/* </Badge> */}
                      
                        <input
                            hidden
                            accept="image/*"
                            multiple
                            id="profilePhoto"
                            type="file"
                            onChange={setUserImages}
                        />
                    </ButtonBase>
                                </Box>
                                </Grid>:""
         }
      
        </Grid>
                
                        
                    
                   
                
                
                <LightboxModal
                    images={images.map((i) =>
                        i?.includes && i.includes('https')
                            ? i
                            : URL.createObjectURL(i)
                    )}
                    mainSrc={
                        images.map((i) =>
                            i?.includes && i.includes('https')
                                ? i
                                : URL.createObjectURL(i)
                        )[selectedImage]
                    }
                    photoIndex={selectedImage}
                    setPhotoIndex={setSelectedImage}
                    isOpen={openLightbox}
                    onCloseRequest={() => setOpenLightbox(false)}
                />
      </>
    )
})

export default UploadNewPhotoForm
