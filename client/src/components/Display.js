import { useState } from "react";
import "./Display.css";

// Display component for rendering and interacting with data from the blockchain.
const Display = ({ contract, account }) => {
  const [data, setData] = useState(""); // State variable to store values from the blockchain
  const [addr, setAddr] = useState(""); // State variable to store the address for revoking access

  // Function to retrieve and display data from the blockchain
  const getdata = async () => {
    let dataArray;

    const otherAddress = document.querySelector(".address").value; // Get the input value for the address

    try {
      if (otherAddress) {
        dataArray = await contract.display(otherAddress); // Retrieve data for the specified address
      } else {
        dataArray = await contract.display(account); // Retrieve data for the user's account if no address is specified
      }

      const isEmpty = !dataArray || dataArray.length === 0; // Check if the data array is empty or undefined

      if (!isEmpty) {
        // If data is available, create a list of images with links
        const images = dataArray.map((item, i) => (
          <a href={item} key={`a-${i}`} target="_blank" rel="noopener noreferrer">
            <img key={`img-${i}`} src={item} alt="new" className="image-list" />
          </a>
        ));
        setData(images); // Update the state variable with the generated images
      } else {
        alert("No file to show"); // Display an alert if no data is available
      }
    } catch (e) {
      alert("You don't have access to this user's data or the address is invalid."); // Handle errors and display an alert
    }
  };

  // Function to revoke access for a specified address
  const revokeaccess = async () => {
    await contract.disallow(addr); // Call the 'disallow' function of the contract
    setAddr(null); // Reset the address state variable
  };

  return (
    <>
      <div className="image-list">{data}</div> {/* Display the images */}
      <input
        type="text"
        placeholder="Enter Address"
        className="address"
      ></input> {/* Input field for entering the address */}
      <button className="getdata" onClick={getdata}>
        Show Files
      </button> {/* Button to trigger the retrieval of data */}
      <input
        type="text"
        placeholder="Enter Address for revoke access"
        className="address"
        value={addr}
        onChange={(e) => setAddr(e.target.value)}
      ></input> {/* Input field for entering the address to revoke access */}
      <button className="revoke" onClick={revokeaccess} disabled={!addr}>
        Revoke Access
      </button> {/* Button to revoke access for the specified address */}
    </>
  );
};

export default Display; // Export the Display component
