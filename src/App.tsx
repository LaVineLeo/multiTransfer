import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import { POLLING_INTERVAL } from './dapp/connectors';
import Header from './components/Header';
import Footer from './components/Footer';

import BatchTransfer from './page/BatchTransfer';

import './App.css';
export function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
}

export default function APP() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="App flex flex-col">
        <Header></Header>
        <BatchTransfer />
        <Footer></Footer>
      </div>
    </Web3ReactProvider>
  );
}
