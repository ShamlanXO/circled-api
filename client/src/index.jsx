import './utils/crypto-polyfill'

// i18n
import './locales/i18n'

// highlight
// import './utils/highlight'

// scroll bar
import 'simplebar/src/simplebar.css'

// lightbox
import 'react-image-lightbox/style.css'

// map
// import 'mapbox-gl/dist/mapbox-gl.css'

// editor
// import 'react-quill/dist/quill.snow.css'

// slick-carousel
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css'
import 'react-lazy-load-image-component/src/effects/opacity.css'
import 'react-lazy-load-image-component/src/effects/black-and-white.css'

//import ReactDOM from 'react-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
// @mui
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'
// redux
import { store, persistor } from './redux/store'
// contexts
import { SettingsProvider } from './contexts/SettingsContext'
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext'
// components
import LoadingScreen from './components/LoadingScreen'

// Check our docs
// https://docs-Circled.fit.vercel.app/authentication/ts-version

//
import App from './App'


import './app.css'
import 'react-app-protect/dist/index.css'
// ----------------------------------------------------------------------

createRoot(document.getElementById('root')).render(
    <StrictMode>
    <HelmetProvider>
        <ReduxProvider store={store}>
            <PersistGate loading={<LoadingScreen />} persistor={persistor}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <SettingsProvider>
                        <CollapseDrawerProvider>
                            <BrowserRouter>
                                <App />
                            </BrowserRouter>
                        </CollapseDrawerProvider>
                    </SettingsProvider>
                </LocalizationProvider>
            </PersistGate>
        </ReduxProvider>
    </HelmetProvider>
    </StrictMode>
)

