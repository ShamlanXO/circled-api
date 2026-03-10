import React, { useState } from 'react';
import * as tus from 'tus-js-client';
import axios from 'axios';

function App() {
  const [videoUrl, setVideoUrl] = useState('');

  const handleChange = async (eventObject) => {
    // Get the selected file from the input element
    const file = eventObject.target.files[0];
    const fileName = file.name;
    const fileSize = file.size.toString();

    const response = await axios({
      method: 'get',
      url: `http://localhost:3001/api/misc/upload-video?fileSize=${fileSize}`,
    });

    // Create a new tus upload
    const upload = new tus.Upload(file, {
      endPoint: 'https://api.vimeo.com/me/videos',
      uploadUrl: response.data.data.upload.upload_link,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      metadata: {
        filename: file.name,
        filetype: file.type,
      },
      headers: {},
      onError: function (error) {
        console.log('Failed because: ' + error);
      },

      onSuccess: function () {
        setVideoUrl(upload.url);
      },
    });

    // Start the upload
    upload.start();
  };

  return (
    <>
      <div> Vimeo upload test</div>
      <input
        onChange={handleChange}
        type="file"
      />
      <a href={videoUrl}>Video link</a>
    </>
  );
}

export default App;
