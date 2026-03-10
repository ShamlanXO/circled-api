import axios from './axios'
import api from './api'
import Axios from 'axios'
export const handleuploadImage = (e, folder = '', name = '') => {
    return new Promise((resolve, reject) => {
        const form = new FormData()

        form.append('file', e.target.files[0])

        let file = e.target.files[0]

        axios
            .get(`${api.protocol}${api.baseUrl}${api.GetSignature}`)
            .then((res) => {
                form.append('fileName', name || file.name)
                if (folder) {
                    form.append('folder', folder)
                }
                form.append('publicKey', 'public_gIxrOrTfHfefLxpNRZvE1dG7tc4=')
                form.append('expire', res.data.expire)
                form.append('token', res.data.token)
                form.append('signature', res.data.signature)
                Axios.post(
                    'https://upload.imagekit.io/api/v1/files/upload',
                    form
                )
                    .then((result) => {
                        resolve({ data: { Location: result.data.url } })
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
            .catch((error) => {
                reject(error)
            })

        // axios.post(`${api.protocol}${api.baseUrl}${api.UploadSingleFile}`, form)
        //   .then((result) => {
        //     console.log(result)
        //       resolve(result)

        //   })
        //   .catch((error) => {
        //     reject(error);
        //   })
    })
}
