const getProcessedvideoLink = (link, trail = '') => {
    let finalLink=typeof link === 'object' ? link.file : link
    let key = finalLink.replace(
        'https://circled-videos.s3.us-east-1.amazonaws.com',
        ''
    )

    key =
        'https://circled-videos.s3.us-east-1.amazonaws.com/processed' +
        trail +
        key.replace(/\.\w+$/, '') +
        '_480p.mp4'
    return key
}

const getThumbnail = (link, trail = '') => {
    let finalLink=typeof link === 'object' ? link.file : link
    let key = finalLink.replace(
        'https://circled-videos.s3.us-east-1.amazonaws.com',
        ''
    )

    key =
        'https://circled-videos.s3.us-east-1.amazonaws.com/processed/thumbnails' +
        trail +
        key.replace(/\.\w+$/, '') +
        '/00001.png'
    return key
}

const getYoutubeVideoTHumbnail = (link) => {
    // Extract video ID from various YouTube URL formats
    const videoId = link.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|@[^\/]+\/|@.*?\/watch\/)([^"&?\/\s]{11})/
    )?.[1];

    if (!videoId) return null;

    // Return the mqdefault thumbnail URL
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

const getProcessedvideoLinkOfLogs = (link, trail = '') => {
    let key = link.replace(
        'https://circled-logs.s3.us-east-1.amazonaws.com',
        ''
    )
    key =
        'https://circled-logs.s3.us-east-1.amazonaws.com/processed-videos' +
        trail +
        key.replace(/\.\w+$/, '') +
        '_480p.mp4'

    return key
}

const getThumbnailOfLogs = (link, trail = '') => {
    let key = link.replace(
        'https://circled-logs.s3.us-east-1.amazonaws.com',
        ''
    )
    key =
        'https://circled-logs.s3.us-east-1.amazonaws.com/processed-videos/thumbnails' +
        trail +
        key.replace(/\.\w+$/, '') +
        '/00001.png'

        return key
}

export { getProcessedvideoLink, getThumbnail, getYoutubeVideoTHumbnail, getProcessedvideoLinkOfLogs, getThumbnailOfLogs };
