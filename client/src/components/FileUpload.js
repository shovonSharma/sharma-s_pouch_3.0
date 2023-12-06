
import { useState } from "react";
import axios from "axios"; //axios to connect with IPFS
import "./FileUpload.css";

// FileUpload component that allows users to upload files to IPFS and the blockchain.
const FileUpload = ({ contract, account, provider }) => {
  // Initialize state variables for the selected file and its name.
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");

  // Handle the file submission and upload process.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        // Create a FormData object and append the selected file.
        const formData = new FormData();
        formData.append("file", file);

        // Axios to upload the file to the Pinata IPFS service.
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `4826ba24dbe3a206c385`,
            pinata_secret_api_key: `7558d6b12db393e6225fc135e1a16c67ad71da7ea2782292286447574744f674`,
            "Content-Type": "multipart/form-data",
          },
        });

        // Generate the IPFS URL for the uploaded file.cors issue solved
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;

        // Call the 'add' function of the contract to store the file's IPFS URL on the blockchain.
        contract.add(account, ImgHash);

        // Display a success message, reset the file selection, and clear the file name.
        alert("File Upload Successful");
        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        // Handle errors and display an error message.
        alert("Unable to upload File to Pinata");
        console.log(e);
      }
    }
  };

  // Handle file selection and update the state with the selected file and file name.
  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);

    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };

    setFileName(e.target.files[0].name);
    e.preventDefault();
  };

  // Render the file upload form.
  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Select File
        </label>

        {/* Input field for selecting a file */}
        <input disabled={!account} type="file" id="file-upload" name="data" onChange={retrieveFile} />

        {/* Display the selected file's name */}
        <span className="textArea">File : {fileName}</span>

        {/* Button to submit and upload the file */}
        <button type="submit" className="upload" disabled={!file}>
          Upload File
        </button>
      </form>
    </div>
  );
};

export default FileUpload; // Export the FileUpload component.
