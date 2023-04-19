import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { Button } from '@demox-labs/aleo-wallet-adapter-reactui/dist/Button';
import { MailModalProvider } from './Component/MailModalProvider';
import { MailModalButton } from './Component/MailModalButton';
import Utils from './Utils';
 
import axios from 'axios';
import * as IPFS from 'ipfs-core'
import Box from './Box';
//import  records from './test.json';


export const DMAIL_PROGRAM_NAME = 'chat.aleo'; 

function App() {
 
  const { wallet, publicKey ,requestRecords} = useWallet(); 
  
  return (
    <>
      <div className='mt-1 h-16'>
        <div className='absolute left-1'>
          {publicKey && (
            <MailModalProvider>
              <MailModalButton className='bg-blue-950' style={{backgroundColor: '#0c359c'}}></MailModalButton>
            </MailModalProvider> 
          )}
        </div>
        <div className='absolute right-1'>
          <WalletMultiButton style={{backgroundColor: '#0c359c'}} />
        </div>
      </div>
      <Box/>
    </>
  );
}

export default App;
