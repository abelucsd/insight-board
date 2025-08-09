import { useFileUpload } from "../../hooks/useFileUpload";
import { API_URL } from "../../utils/data";

const LoadCustomers = () => {
  const { 
    fileInputRef,
    fileName,
    message,
    handleFileChange,
    handleFileButtonClick,     
  } = useFileUpload({postUrl: `${API_URL}/worker/upload-file/customer`});

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">Customer Page</h1>      
            
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
        <input 
          type="file" 
          className="hidden"
          accept=".csv, .json" 
          id="file-upload"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <button         
          onClick={handleFileButtonClick}
          className="btn-file"
        >
          Upload File
        </button>
        <p>{fileName}</p>
        <button className="btn-primary">Submit (Disabled for Demo)</button>
      </div>

      {message && <p>{message}</p>}
      
    </div>
  );
};

export default LoadCustomers;