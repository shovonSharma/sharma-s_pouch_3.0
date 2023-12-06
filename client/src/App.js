import Upload from "./artifacts/contracts/Upload.sol/Upload.json"; // Import the JSON representation of the Upload contract.

import { useState, useEffect } from "react"; // Import React hooks for managing state and side effects.

import { ethers } from "ethers"; // Import the ethers library for Ethereum interactions.

import FileUpload from "./components/FileUpload"; // Import the FileUpload component.

import Display from "./components/Display"; // Import the Display component.

import Modal from "./components/Modal"; // Import the Modal component.(Dialogue box)

import './App.css'; // Import the CSS styles for the App component.



function App() {

  const [account, setAccount] = useState(""); // Initialize a state variable for the user's Ethereum account.
  const [contract, setContract] = useState(null); // Initialize a state variable for the Ethereum contract instance.
  const [provider, setProvider] = useState(null); // Initialize a state variable for the Ethereum provider.
  const [modalOpen, setModalOpen] = useState(false); // Initialize a state variable to control the visibility of a modal dialog.

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum); 
    //Web3Provider instance to connect to the user's metamask wallet

    const loadProvider = async () => {

      if (provider) {
        // Listen for changes in the Ethereum chain and reload the window if detected.
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
        // Listen for changes in the user's Ethereum accounts and reload the window if detected.
        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        // Request access to the user's Ethereum accounts and get the account address.
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

        // Create an instance of the Upload contract using its ABI and signer.
        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );


        //console.log(contract);

        // Set the contract and provider in the component's state.
        setContract(contract);
        setProvider(provider);

      } else {
        console.error("Metamask is not installed");
      }
    };

    // Load the provider and set up the contract when the component mounts.
    provider && loadProvider();
  }, []);

  return (
    <>

    <div class="navbar">

    <table>
      <tr>

        <th >
          {!modalOpen &&(
            <button className="share" onClick={()=>setModalOpen(true)}>Share</button>
          )}
          {
            modalOpen && (
              <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
            )
          }
        </th>
        <td style={{ width: '666px' }}></td> 
        
        <th>
  
          <h3 style={{ color: "white"}}>Account : {account ? account : "Connect Metamask"} </h3>
          {/* Display the user's Ethereum account or a message to connect Metamask. */}

        </th>
  
      </tr>

    </table>
    
    </div>


    <div className="App">

      <svg viewBox="0 0 960 300">
            <symbol id="s-text">
                <text text-anchor="middle" x="50%" y="80%">Sharma's Pouch 3.0</text>
            </symbol>
        
            <g class = "g-ants">
                <use xlinkHref="#s-text" className="text-copy"></use>
                <use xlinkHref="#s-text" className="text-copy"></use>
                <use xlinkHref="#s-text" className="text-copy"></use>
                <use xlinkHref="#s-text" className="text-copy"></use>
                <use xlinkHref="#s-text" className="text-copy"></use>
            </g>
            
      </svg>



      <FileUpload account={account} provider={provider} contract={contract}></FileUpload> {/* Render the FileUpload component with relevant props. */}
      <Display contract={contract} account={account}></Display> {/* Render the Display component with relevant props. */}
    </div>



   {/* footer section */}

    <section>
    <footer>
        <div class="wave wave1"></div>
        <div class="wave wave2"></div>
        <div class="wave wave3"></div>
        <div class="wave wave4"></div>
    </footer>

    </section>


    </>
  );
}

export default App;
