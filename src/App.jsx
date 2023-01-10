import React, { useEffect, useState } from "react";
//import { ethers } from "ethers";
import './App.css';

const getEthereumObject = () => window.ethereum;

// This function returns the first linked account found.
// If there is no account linked, it will return null.
const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();

    // First make sure we have access to the Ethereum object.
    if (!ethereum) {
      console.error("Make sure you have metemask!");
      return null;
    }
    
    console.log("We have the Ethereum object", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorised account.", account);
      return account;
    } else {
      console.error("No authorised account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };
  
  //The passed callback function will be run when the page loads.
  //More technically, when the App component "mounts".
  useEffect(async () => {
    const account = await findMetaMaskAccount();
    if (account !== null) {
      setCurrentAccount(account);
    }
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          Hey there!
        </div>
        
        <div className="bio">
          <h3>I am Hamzah</h3>
          <p>I am working on an Etheruem Smart Contract, pretty cool right?</p>
          <br/>
          
          <h3>Say HI</h3>
          <p>Connect your Ethereum wallet and 👋 (wave) at me!</p>
        </div>

        <button className="waveButton" onClick={null}>
          Wave at Me
        </button>

        {
          // if there is no currentAccount, render this button
        }
        {!currentAccount && (
          <button className="waveButon" onClick={connectWallet}>Connect Wallet</button>
        )}
      </div>
    </div>
  );
};

export default App;
