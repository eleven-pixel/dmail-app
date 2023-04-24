import React from 'react';
import { MailModalProvider } from '../compose/MailModalProvider';
import { MailModalButton } from '../compose/MailModalButton';


import { HiInbox } from "react-icons/hi2";
import { BiSend } from "react-icons/bi";

const LeftSidebar: React.FC = () => {
  return (
    <div className="w-9/12 h-auto py-3">
      <div className="p-2">
        <MailModalProvider>
          <MailModalButton className='bg-blue-950' style={{backgroundColor: '#0c359c'}}></MailModalButton>
        </MailModalProvider> 
      </div>
      <ul className="w-full text-gray-600">
        <li className="h-12 mb-2 flex items-center justify-content cursor-pointer space-x-2 p-2 rounded-md hover:bg-gray-200"
          onClick={()=> {
            window.location.hash = "inbox"
          }}
        >
          <div >
            <HiInbox viewBox='3 3 18 18'/>
          </div>
          <div>
            <p className="text-sm font-semibold">Inbox</p>
          </div>
        </li>
        <li className="h-12 mb-2 flex items-center justify-content cursor-pointer space-x-2 p-2 rounded-md hover:bg-gray-200"
          onClick={()=> {
            window.location.hash = "sent"
          }}
        >
          <div>
            <BiSend viewBox='3 3 18 18'/>
          </div>
          <div>
            <p className="text-sm font-semibold">Sent</p>
          </div>
        </li> 
      </ul>
    </div>
  );
};

export default LeftSidebar;
