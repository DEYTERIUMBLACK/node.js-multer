import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const App = () => {
  const [imageUrl, setImageUrl] = useState(null);

  const handleChange = (info) => {
    if (info.file.status === 'done') {
      setImageUrl(info.file.response.url);
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:3001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onSuccess(response.data);
    } catch (error) {
      console.error('Upload failed:', error);
      onError(error);
    }
  };

  return (
    <div>
      <Upload
        customRequest={customRequest}
        listType="picture-card"
        onChange={handleChange}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="Uploaded" style={{ width: '100%' }} />
        ) : (
          <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
    </div>
  );
};

export default App;
