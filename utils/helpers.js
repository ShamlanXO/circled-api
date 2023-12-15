
module.exports.isVideoOrImage=(filename)=> {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv', '.webm'];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'];

    const fileExtension = filename.substring(filename.lastIndexOf('.'));

    if (videoExtensions.includes(fileExtension)) {
        return true;
    } else if (imageExtensions.includes(fileExtension)) {
        return false;
    } else {
        return false;
    }
}
