import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui';
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <div className="w-full h-14 bg-black grid grid-cols-7 gap-4 fixed z-50 ">
      <div className="col-span-2 flex items-center">
        <div className="flex items-center ml-2">
            <a href="/"><img src="logo.png" width={130}></img></a>
        </div>
      </div>
      <div className="col-span-3 flex items-center justify-center space-x-2">
         
      </div>
      <div className="col-span-2 flex items-center justify-end">
        <div className="h-10 w-auto flex items-center space-x-2 pr-2">
        <WalletMultiButton style={{backgroundColor: '#0c359c'}} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
