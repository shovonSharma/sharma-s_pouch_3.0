import { useEffect } from "react";
import "./Modal.css";

// Modal component for sharing access with others.
const Modal = ({ setModalOpen, contract }) => {
  // Function to share access with the specified address
  const sharing = async () => {
    const address = document.querySelector(".address").value; // Get the input value for the address
    await contract.allow(address); // Call the 'allow' function of the contract to grant access
    setModalOpen(false); // Close the modal after sharing access
  };

  // useEffect hook to populate the select dropdown with addresses having access
  useEffect(() => {
    const accessList = async () => {
      const addressList = await contract.shareAccess(); // Retrieve the list of addresses with access
      let select = document.querySelector("#selectNumber"); // Get the select dropdown element
      const options = addressList;

      for (let i = 0; i < options.length; i++) {
        let opt = options[i];
        let e1 = document.createElement("option"); // Create an option element
        e1.textContent = opt;
        e1.value = opt;
        select.appendChild(e1); // Append the option to the select dropdown
      }
    };

    // Call the accessList function when the contract is available (not null)
    contract && accessList();
  }, [contract]);

  return (
    <>
      {/* Modal structure */}
      <div className="modalBackground">
        <div className="modalContainer">
          <div className="title">Share with</div>
          <div className="body">
            <input
              type="text"
              className="address"
              placeholder="Enter Address"
            ></input> {/* Input field for entering the address */}
          </div>
          <form id="myForm">
            <select id="selectNumber">
              <option className="address">People With Access</option>
            </select> {/* Dropdown to display people with access */}
          </form>
          <div className="footer">
            <button
              onClick={() => {
                setModalOpen(false); // Button to cancel and close the modal
              }}
              id="cancelBtn"
            >
              Cancel
            </button>
            <button onClick={() => sharing()}>Share</button> {/* Button to share access */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal; // Export the Modal component
