import React, { useEffect, useState } from 'react'

export default function ImageWithFallback(props) {
    let [src, setSrc] = useState(props.src)

    useEffect(() => {
        setSrc(props.src)
    }, [props.src])
    if (src)
        return (
            <img src={src} onError={() => setSrc("/images/instructor/exerciseImage.png")} style={props.style} />
        )
    else return null
}
