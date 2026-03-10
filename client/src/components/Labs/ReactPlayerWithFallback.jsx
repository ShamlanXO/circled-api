import React, { useEffect, useState, forwardRef } from 'react';
import ReactPlayer from 'react-player';
export default forwardRef(function ReactPlayerWithFallback(props, ref) {
  let [src, setSrc] = useState(props.src);

  useEffect(() => {
    setSrc(props.url);
  }, [props.url]);

  return (
    <ReactPlayer
      {...props}
      ref={ref}
      url={src}
      onError={(error) => {
        if (src !== props.raw && error?.type) setSrc(props.raw);
      }}
    />
  );
});
