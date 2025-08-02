import { useFileUpload } from "../../hooks/useFileUpload";
import { API_URL } from "../../utils/data";

const LoadInvoices = () => {
  const { 
    fileInputRef,
    fileName,
    message,
    handleFileChange,
    handleFileButtonClick,     
  } = useFileUpload({postUrl: `${API_URL}/worker/upload-file/invoice`});

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">Invoices Page</h1>
      <p className="mt-4 text-lg text-gray-600">This is the invoices page.</p>

      {/* 2 Invoice Table */}
      {/* 1 Upload Many Invoice */}
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
        <button className="btn-primary">Submit (Disabled for Demo)</button>
      </div>

      {message && <p>{message}</p>}

      {/* 3 Add Invoice */}
    </div>
  );
};

export default LoadInvoices;