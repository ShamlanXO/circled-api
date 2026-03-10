import axios from "utils/axios";
import api from "utils/api";
import Axios from "axios";
import AWS from "aws-sdk";
export const handleuploadImage = (e) => {
  return new Promise((resolve, reject) => {
    const form = new FormData();

    form.append("rsfile", e.target.files[0]);

    let file = e.target.files[0];
    axios
      .post(`${api.protocol}${api.baseUrl}${api.getSignedUrl}`, {
        type: e.target.files[0].type,
        name: e.target.files[0].name,
      })
      .then((res) => {
        let urlData = res.data.split("?")[0];
        Axios.put(res.data, file, {
          headers: { "Content-Type": "application/octet-stream" },
        })
          .then((result) => {
            resolve({ data: { Location: urlData } });
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });

    // axios.post(`${api.protocol}${api.baseUrl}${api.UploadSingleFile}`, form)
    //   .then((result) => {
    //     console.log(result)
    //       resolve(result)

    //   })
    //   .catch((error) => {
    //     reject(error);
    //   })
  });
};

////backend//


 export const getSignatureUrl = (req, res) => {
  const S3 = new AWS.S3({
    endpoint: "s3-ap-south-1.amazonaws.com", // Put you region
    accessKeyId: "",
    secretAccessKey: "",
    region: "ap-south-1",
    Bucket: "static-empengage", // Put your bucket name
    signatureVersion: "v4",
    // Put you region
  });
  var params = {
    ACL: "public-read",
    Bucket: "static-empengage",
    Key: `${Date.now()}${"-"}assignment-${req.body.name}`,
    Expires: 1 * 3600,
    ContentType: req.body.type,
  };
  var signedUrlPut = S3.getSignedUrl("putObject", params);

  res.send(signedUrlPut);
};
