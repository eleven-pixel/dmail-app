import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Inbox: React.FC = () => {
  const location = useLocation();
  const pathName = location?.pathname.split('/')[1];
  return (
    <> 
     <div className="mt-4 w-full h-full">
      <div className= "grid grid-cols-1 gap-2" >
      <p> Welcome to dmail app!</p>
      </div>
      </div>
    </>
  );
};

export default Inbox;
