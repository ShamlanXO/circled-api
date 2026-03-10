import { GOOGLE_ANALYTICS_API } from '../config';

// ----------------------------------------------------------------------

const setup = (...args) => {
  if (import.meta.env.NODE_ENV !== 'production') {
    return;
  }
  if (!window.gtag) {
    return;
  }
  window.gtag(...args);
};

const track = {
  pageview: (props) => {
    setup('config', GOOGLE_ANALYTICS_API, props);
  },
  event: (type, props) => {
    setup('event', type, props);
  },
};

export default track;
