import { styled } from '@mui/material/styles'
import { Button, Box, Typography, Stack } from '@mui/material'
// routes

import { MotionContainer, varFade } from 'src/components/animate'
import { useNavigate } from 'react-router'
import Logo from 'src/assets/figgslogo.png'
import Content from 'src/components/Layout/Content'
import Container from 'src/components/Layout/Container'

// ----------------------------------------------------------------------

const ContentStyle = styled((props) => <Stack spacing={2} {...props} />)(
    ({ theme }) => ({
        minHeight: '100vh',

        display: 'flex',
        flexDirection: 'column',

        maxWidth: 520,
        margin: 'auto',
        width: '100%',
        textAlign: 'center',
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: theme.spacing(8),
    })
)

// ----------------------------------------------------------------------

export default function HomeHero() {
    const navigate = useNavigate()

    return (
        <MotionContainer>
            <Container>
                <Content>
                    <ContentStyle>
                        <Box display={'flex'} justifyContent="center">
                            <img src={Logo} height={64} />
                        </Box>

                        <Box
                            display={'flex'}
                            alignItems={'center'}
                            width={'100%'}
                            justifyContent={'center'}
                            flexGrow={1}
                        >
                            {/* <m.div variants={varFade().inRight}>
       <Typography variant="h3">Create new account as  </Typography>
            </m.div> */}
                            <div style={{ width: '100%' }}>
                                <Stack>
                                    <Typography variant="h4">
                                        This link doesn’t exist
                                    </Typography>{' '}
                                    <Typography
                                        align="center"
                                        color={'text.secondary'}
                                    >
                                        The user might deleted the workout
                                        <br /> or his page doesn’t exist
                                    </Typography>
                                    <Button
                                        onClick={() => navigate('/')}
                                        variant="contained"
                                        size="large"
                                        style={{ marginTop: 16 }}
                                    >
                                        Home page
                                    </Button>
                                </Stack>
                            </div>
                        </Box>
                    </ContentStyle>
                </Content>
            </Container>
        </MotionContainer>
    )
}
