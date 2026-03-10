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
import React from 'react'
import * as Yup from 'yup'
import { useFormik, Form, FormikProvider } from 'formik'
import { IconButtonAnimate, varFade } from '../animate'
import Iconify from '../Iconify'
import axios from 'axios'
import api from 'src/utils/api'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import LabeledInput from '../core/LabeledInput'
import { handleuploadImage } from 'src/utils/uploader'
import { useDispatch } from 'react-redux'
import {
    createBodyImages,
    updateBodyImages,
} from 'src/redux/actions/BodyImages'
import LightboxModal from 'src/components/LightboxModal'
import Image from 'src/assets/IconSet/Image'
import Add from 'src/assets/IconSet/AddCircled'

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
    height: '100%',
}))

const BoxStyle = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 10px',
    zIndex: 100,
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

const UploadNewPhotoForm = React.forwardRef(({ item, mode }, ref) => {
    const [images, setImages] = useState(item?.images ? item.images : [])
    const [selectedImage, setSelectedImage] = useState(0)
    const [openLightbox, setOpenLightbox] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const RegisterSchema = Yup.object().shape({
        weight: Yup.number()
            .min(10, 'Please enter weight between 10-550')
            .max(550, 'Please enter weight between 10-550')
            .required('weight is required'),
    })

    const [filePicked, setFilePicked] = useState(null)
    let setUserImages = (e) => {
        setImages([...images, ...e.target.files])
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

    const formik = useFormik({
        initialValues: {
            title: item?.title,
            weight: item?.weight,
            description: item?.description,
        },
        validationSchema: RegisterSchema,
        onSubmit: async (values, { setErrors, setSubmitting }) => {
            if (!images.length) {
                return
            }
            setSubmitting(true)
            //   dispatch(
            //     updateFeedback({
            //       loading: true,
            //     })
            //   );
            dispatch({ type: 'UPDATE_FEED', payload: { loading: true } })

            if (images.filter((i) => !i?.includes).length) {
                Promise.all(
                    [...images.filter((i) => !i?.includes)].map(
                        async (image) => {
                            return handleuploadImage({
                                target: { files: [image] },
                            })
                        }
                    )
                )
                    .then((res) => {
                        mode
                            ? updateBodyImages({
                                  images: [
                                      ...images.filter((i) => i?.includes),
                                      ...res.map((i) => i.data.Location),
                                  ],
                                  ...values,
                              }).then((response) => {
                                  navigate(-1)
                              })
                            : createBodyImages({
                                  images: [...res.map((i) => i.data.Location)],
                                  ...values,
                              }).then((response) => {
                                  navigate(-1)
                              })
                    })
                    .catch((err) => {
                        dispatch({
                            type: 'UPDATE_FEED',
                            payload: { loading: false },
                        })
                        handleSubmit()
                    })
            } else {
                mode
                    ? updateBodyImages({
                          ...values,
                      }).then((response) => {
                          navigate(-1)
                      })
                    : createBodyImages({
                          ...values,
                      }).then((response) => {
                          navigate(-1)
                      })
            }
        },
    })

    const imageHandler = (event) => {
        if (!event.target.files[0]) return false

        setFilePicked(URL.createObjectURL(event.target.files[0]))

        setFieldValue('avatar', event.target.files[0])
    }
    const {
        errors,
        touched,
        handleSubmit,
        isSubmitting,
        getFieldProps,
        setFieldValue,
        values,
    } = formik
    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack direction="row" spacing={2}>
                    <Box
                        sx={{
                            maxWidth: '72vw',

                            height: 105,
                        }}
                        display={'flex'}
                    >
                        {images.map((image, index) => {
                            return (
                                <Box
                                    mx={1}
                                    onClick={() => {
                                        setSelectedImage(index)
                                        setOpenLightbox(true)
                                    }}
                                    sx={{
                                        position: 'relative',
                                        minWidth: 105,
                                        borderRadius: 2,
                                        border: '2px dashed',
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
                                    <IconButtonAnimate
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
                                    </IconButtonAnimate>
                                </Box>
                            )
                        })}
                    </Box>
                    <ButtonBase
                        sx={{
                            width: 105,
                            height: 105,
                            border: '2px dashed',
                            borderColor: '#C3CBD9',
                            color: 'text.secondary',

                            borderRadius: 2,
                        }}
                        onClick={(e) => {
                            document.getElementById('profilePhoto').click()
                        }}
                    >
                        <Badge
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
                        >
                            <Image style={{ fontSize: 32, color: '#C3CBD9' }} />
                        </Badge>
                        {/* <Iconify
                            icon="akar-icons:plus"
                            sx={{ fontSize: 24 }}
                            color="primary.main"
                        /> */}
                        <input
                            hidden
                            accept="image/*"
                            multiple
                            id="profilePhoto"
                            type="file"
                            onChange={setUserImages}
                        />
                    </ButtonBase>
                </Stack>
                <br />
                <Stack spacing={3} sx={{ width: '100%' }}>
                    <Grid container spacing={2}>
                        {/* <Grid item xs={8}>
              <LabeledInput
                fullWidth
                placeholder="84"
                clabel={
                  <Typography variant="subtitle1" color="text.primary">
                    Title
                  </Typography>
                }
                {...getFieldProps("title")}
                error={Boolean(touched.title && errors.title)}
                helperText={touched.title && errors.title}
              />
            </Grid> */}
                        <Grid item xs={4}>
                            <LabeledInput
                                fullWidth
                                placeholder="84"
                                clabel={
                                    <Typography
                                        variant="subtitle1"
                                        color="text.primary"
                                    >
                                        Weight
                                    </Typography>
                                }
                                {...getFieldProps('weight')}
                                type="number"
                                error={Boolean(touched.weight && errors.weight)}
                                helperText={touched.weight && errors.weight}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Kg
                                            </Typography>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    <LabeledInput
                        fullWidth
                        placeholder="example"
                        clabel="Description"
                        {...getFieldProps('description')}
                        error={Boolean(
                            touched.description && errors.description
                        )}
                        helperText={touched.description && errors.description}
                        multiline
                        minRows={4}
                        maxRows={4}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Box
                                        display={'flex'}
                                        flexDirection="column"
                                        justifyContent={'flex-end'}
                                        marginTop={10}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {(formik.values.description + '')
                                                .length + '/200'}
                                        </Typography>
                                    </Box>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>{' '}
                <Button hidden ref={ref} type="submit" />
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
            </Form>
        </FormikProvider>
    )
})

export default UploadNewPhotoForm
