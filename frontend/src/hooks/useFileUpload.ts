import { useRef, useState } from "react";
import axios from "axios";


interface useFileUploadProps {
  postUrl: string;
};

export const useFileUpload = ({postUrl}:useFileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('No file selected');
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : 'No file selected');
  };

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await axios.post(`${postUrl}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        console.log('File uploaded successfully:', response.data);
        setMessage('File uploaded successfully!');
        setTimeout(() => {
          setMessage('');
        }, 3000)
      } catch (error) {
        console.error('Error uploading file:', error);
        setMessage('Error uploading file. Please try again.');
        setTimeout(() => {
          setMessage('');
        }, 3000)
      }
    }
  };
    

  return {
    fileInputRef,
    file,
    fileName,
    message,
    handleFileChange,
    handleFileButtonClick,
    handleSubmit,
  };
};