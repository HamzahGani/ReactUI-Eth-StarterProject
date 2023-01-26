import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

const getEthereumObject = () => window.ethereum;
const contractAddress = "0x54a8Dd949541ce59DDF4D1F573092791B5E5cA2A"; // variable to holds deployed contract address
const contractABI = abi.abi; // variable referencing abi content!

const App = () => {
  var waveMsg = "My Msg";
  const [currentAccount, setCurrentAccount] = useState("");

  // All state property to store all waves
  const [allWaves, setAllWaves] = useState([]);
  const contractAdress = "0x81FF1228CC25CAC3b9ff12a3B651Ba17333002C8";

  // passed callback function will run on page load (App component "mounts")
  useEffect(async () => {
    const account = await checkIfWalletIsConnected();
    if (account !== null) {
      setCurrentAccount(account);
    }
    
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);
  
// returns the first linked account found else null.
  const checkIfWalletIsConnected = async () => {
    try {
      const ethereum = getEthereumObject();
  
      // First make sure we have access to the Ethereum object.
      if (!ethereum) {
        console.error("Make sure you have metemask!");
        return null;
      }
      
      console.log("We have the Ethereum object", ethereum);
  
      getAllWaves();
      
      const accounts = await ethereum.request({ method: "eth_accounts" });
  
      if (accounts.length == 0) {
        console.error("No authorised account found");
        return null;
      } 
  
      const account = accounts[0];
      console.log("Found an authorised account.", account);
      return account;
      
    } catch (error) {
      console.error(error);
      return null;
    }
  };

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
      await checkIfWalletIsConnected();
    } catch (error) {
      console.error(error);
    }
  };
  
  const wave = async () => {
    try {
      const { ethereum } = window;
  
      if (!ethereum) {
        console.log("Ethereum object doest exist!");
        return;
      } 
  
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = 
        new ethers.Contract(contractAddress, contractABI, signer);
  
      let count = await wavePortalContract.getTotalWaves();
      console.log("Retrieved total wave count...", count.toNumber());

      if (waveMsg != "") {
        const waveTxn = await wavePortalContract.waveMessage(waveMsg, { gasLimit:3000000 });
        console.log("Mining...", waveTxn.hash);
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
      } else {
        const waveTxn = await wavePortalContract.wave({ gasLimit:3000000 });
        console.log("Mining...", waveTxn.hash);
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
      }
      
  
      count = await wavePortalContract.getTotalWaves();
      console.log("Retrieved total wave count...", count.toNumber());
      //location. reload() // list is now updated through useEffect
    } catch (error) {
      console.log(error);
    }
  }
  
  const getAllWaves = async () => {
    try {
      const { ehtereum } = window;
  
      if (!ethereum) {
        console.log("Ethereum object doesn't exist!");
        return;
      }
  
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
  
      const waves = await wavePortalContract.getAllWaves(); // Call method from Smart Contract

      const wavesCleaned = waves.map(wave => {
        return {
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        };
      });
      
      setAllWaves(wavesCleaned); // Store our data in React State
      
    } catch (error) {
      console.log(error);
    }
  }
  
  //HTML
  return (
    <div className="mainContainer">
      <div className="dataContainer" style={{marginBottom:"45px"}}>
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

        <button className="waveButton" onClick={wave}>Wave at Me</button>

        {
          // if there is no currentAccount, render this button
        }
        {!currentAccount && (
          <button className="waveButon" onClick={connectWallet}>Connect Wallet</button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} 
              style={{backgroundColor: "OldLace", marginTop: "16px", padding: "8px"}}>
              <div>Adress: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
          )
        }).reverse()}
      </div>
    </div>
  );
};

export default App;
