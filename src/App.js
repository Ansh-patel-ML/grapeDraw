import React, { useState, createContext } from "react";
import ActiveBatches from "./components/ActiveBatches";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Wrapper from "./Utils/Wrapper";

export const WalletContext = createContext();

const WalletContextProvider = ({ children }) => {
  const [metaMaskAccountInfo, setMetaMaskAccountInfo] = useState({
    isConnected: false,
    address: null,
    contractInstance: null,
    web3: null,
  });

  return (
    <WalletContext.Provider
      value={{ metaMaskAccountInfo, setMetaMaskAccountInfo }}
    >
      {children}
    </WalletContext.Provider>
  );
};

function App() {
  return (
    <>
      <WalletContextProvider>
        <Header />
        <Wrapper>
          <Hero />
          <ActiveBatches />
          <Footer />
        </Wrapper>
      </WalletContextProvider>
    </>
  );
}

export default App;
