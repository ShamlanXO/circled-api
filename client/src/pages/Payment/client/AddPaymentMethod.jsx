// @mui
import { styled } from '@mui/material/styles'
import { useState, useEffect } from 'react'
// components
import Page from 'src/components/Page'

// sections
import {
    Box,
    Typography,
    ButtonBase,
    IconButton,
    Card,
    Stack,
    Button,
    Divider,
} from '@mui/material'

import Container from 'src/components/Layout/Container'
import Content from 'src/components/Layout/Content'
import Header from 'src/components/Layout/Header'
import { useNavigate, useLocation } from 'react-router'
import Iconify from 'src/components/Iconify'
import {
    fetchCustomer,
    AddPaymentMethod,
    RemovePaymentMethod,
} from 'src/redux/actions/payments'
import { getChatUsers } from 'src/redux/actions/chat'
import { useDispatch, useSelector } from 'react-redux'
import ArrowLeft from 'src/assets/IconSet/ArrowLeft'
import {
    useStripe,
    useElements,
    CardElement,
    CardNumberElement,
} from '@stripe/react-stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import ExpandableBox from 'src/components/custom/ExpandableBox'
const stripePromise = loadStripe(
    'pk_test_51NzgiTKrByvmoNXF7ielQro4TnkxK4F4Zg46fEJWG9OBQinrGODHhnvdcA2R9efEpWHcL4t72MsYcYxp96LEZJYh00ZhfF0Foj'
)
const RootStyle = styled('div')(() => ({
    backgroundColor: '#fff',
    height: '100%',
}))

const BoxHeader = styled(Box)(() => ({
    width: '100%',
    zIndex: 100,
    backgroundColor: '#fff',
}))
// ----------------------------------------------------------------------

const PaymentMethods = () => {
    const navigate = useNavigate()
    const [customer, setCustomer] = useState(null)
    const dispatch = useDispatch()
    const stripe = useStripe()
    const elements = useElements()
    useEffect(() => {
        fetchCustomer().then((user) => setCustomer(user))
    }, [])

    const addPaymentMethod = async (e) => {
        e.preventDefault()
        try {
            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
            })

            if (error) {
                console.error('Error creating payment method:', error)

                return
            }

            // Send the token to your server to attach to the customer
            AddPaymentMethod(paymentMethod.id).then((updatedCustomer) => {
                customer.paymentMethods = updatedCustomer
                setCustomer(customer)
            })
        } catch (error) {
            console.error('Error adding payment method:', error)
        }
    }

    const removePaymentMethods = (id) => {
        // Send the token to your server to attach to the customer
        RemovePaymentMethod(id)
            .then((updatedCustomer) => {
                customer.paymentMethods = updatedCustomer
                setCustomer(customer)
            })
            .catch((err) => {})
    }

    return (
        <RootStyle>
            <Page title="Notifications">
                <Container>
                    {' '}
                    <Header
                        style={{
                            boxShadow: '0px 4px 54px rgba(225, 231, 240, 0.5)',
                            borderRadius: '0px 0px 8px 8px',
                            overflow: 'hidden',
                        }}
                    >
                        <BoxHeader
                            px={2}
                            py={2}
                            display={'flex'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                        >
                            <Box display={'flex'} alignItems={'center'}>
                                {' '}
                                <IconButton
                                    onClick={() => navigate(-1)}
                                    sx={{ color: 'text.primary' }}
                                >
                                    <ArrowLeft />
                                </IconButton>
                                <Typography variant="h6" color="text.primary">
                                    Payment
                                </Typography>{' '}
                            </Box>{' '}
                        </BoxHeader>
                    </Header>{' '}
                    <Content
                        style={{
                            backgroundColor: '#F5F7FA',
                            paddingLeft: 0,
                            paddingRight: 0,
                        }}
                    >
                        <ExpandableBox
                            mt={2}
                            backgroundColor={'#fff'}
                            p={2}
                            fixedHeight={300}
                        >
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Payment Methods
                            </Typography>
                            <Typography color={'text.secondary'}>
                                Select your main payment method for all regular
                                payments.
                            </Typography>
                            <Box my={2}>
                                {customer && (
                                    <div>
                                        <Stack spacing={2}>
                                            {customer?.paymentMethods?.map(
                                                (method) => (
                                                    <Box
                                                        display={'flex'}
                                                        alignItems={'center'}
                                                        justifyContent={
                                                            'space-between'
                                                        }
                                                    >
                                                        <Box
                                                            display={'flex'}
                                                            alignItems={
                                                                'center'
                                                            }
                                                        >
                                                            <Iconify
                                                                icon={
                                                                    'logos:' +
                                                                    method.card
                                                                        .brand
                                                                }
                                                                sx={{
                                                                    width: 24,
                                                                }}
                                                            />
                                                            &nbsp; &nbsp;{' '}
                                                            {method.card.brand}{' '}
                                                            ending in &nbsp;
                                                            {method.card.last4}
                                                        </Box>
                                                        <Box display={'flex'}>
                                                            {/* <ButtonBase
                                                                sx={{
                                                                    color: 'primary.main',
                                                                }}
                                                            >
                                                                Edit
                                                            </ButtonBase>
                                                            <Divider
                                                                sx={{
                                                                    height: 20,
                                                                    mx: 1.5,
                                                                }}
                                                                orientation={
                                                                    'vertical'
                                                                }
                                                            /> */}
                                                            <ButtonBase
                                                                sx={{
                                                                    color: 'error.main',
                                                                }}
                                                                onClick={() =>
                                                                    removePaymentMethods(
                                                                        method.id
                                                                    )
                                                                }
                                                            >
                                                                Remove
                                                            </ButtonBase>
                                                        </Box>
                                                    </Box>
                                                )
                                            )}
                                        </Stack>
                                    </div>
                                )}

                                <Typography
                                    variant="subtitle1"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Add new Methods
                                </Typography>

                                <form onSubmit={addPaymentMethod}>
                                    <Typography>
                                        <Box
                                            sx={{ border: '1px solid grey' }}
                                            p={2}
                                            borderRadius={1}
                                        >
                                            <CardElement
                                                options={{
                                                    style: {
                                                        base: {
                                                            fontWeight: '500',
                                                            fontFamily:
                                                                'inherit',
                                                            fontSize: '18px',
                                                            fontSmoothing:
                                                                'antialiased',
                                                        },
                                                    },
                                                    hidePostalCode: true,
                                                }}
                                            />
                                        </Box>
                                    </Typography>
                                    <center>
                                        <Button
                                            size={'small'}
                                            variant="outlined"
                                            type="submit"
                                            fullWidth
                                            sx={{ mt: 2 }}
                                        >
                                            Add Card
                                        </Button>
                                    </center>
                                </form>
                            </Box>
                        </ExpandableBox>
                    </Content>
                </Container>{' '}
            </Page>
        </RootStyle>
    )
}

const Payment = () => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentMethods />
        </Elements>
    )
}

export default Payment
