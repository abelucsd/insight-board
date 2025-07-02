import { useFileUpload } from "../../hooks/useFileUpload";
import { API_URL } from "../../utils/data";

const LoadProducts = () => {
  const {
    fileInputRef,    
    fileName,
    message,
    handleFileChange,
    handleFileButtonClick,
    handleSubmit, 
   } = useFileUpload({postUrl: `${API_URL}/worker/upload-file/product`});


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">Products Page</h1>
      <p className="mt-4 text-lg text-gray-600">This is the products page.</p>

      {/* 2 Products Table */}
      {/* 1 Upload Many Products */}
      <div className="flex flex-row items-center justify-center gap-4 mt-8">
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
        <button className="btn-primary" onClick={handleSubmit}>Submit (Disabled for Demo)</button>
      </div>

      {message && <p>{message}</p>}

      {/* 3 Add Product */}
    </div>
  )
};

export default LoadProducts;