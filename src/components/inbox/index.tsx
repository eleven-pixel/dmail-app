
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import React, { useEffect, useRef, useState } from 'react';
import Utils, { DMAIL_PROGRAM_NAME } from '../../Utils';
import axios from 'axios';
import { WalletNotConnectedError } from '@demox-labs/aleo-wallet-adapter-base';
import * as IPFS from 'ipfs-core'

import { RiUserReceivedFill } from "react-icons/ri";

const Inbox: React.FC = () => {
  
  const { wallet, publicKey ,requestRecords} = useWallet();

  let [messageRecords, resetMessageRecords] = useState<any>([]);

  const hasRecv = useRef(true);

  async function handleRecv () {
 
    if (!publicKey) throw new WalletNotConnectedError();

    const records = (await requestRecords!(DMAIL_PROGRAM_NAME)) || '';
    console.log(records)
    const ipfs = await IPFS.create()

    let map = new Map<string,any>()

    
    for(let i =0;i < records.length;i++) {
      var cid =  Utils.fieldToCid(records[i].data.cid)
      map.set(cid,""); 
      cid = Utils.fieldToCid(records[i].data.reply)
      map.set(cid,""); 
    }
    let iterator = map.keys();  
    let r: IteratorResult<string,string>;   
    while (r = iterator.next(), !r.done) { 
      var cid = r.value
      const source = ipfs.cat(cid)
      let s = ''
      const decoder = new TextDecoder('utf-8')
      for await (const chunk of source) {
        s += decoder.decode(chunk, {
          stream: true
        })
      }
      s += decoder.decode()
      map.set(cid,JSON.parse(s)) 
    } 
    ipfs.stop() 
    for(let i =0;i < records.length;i++) {
      var record = records[i]
      var cid =  Utils.fieldToCid(record.data.cid)
      record.data.msg = map.get(cid)
      cid = Utils.fieldToCid(record.data.reply)
      record.data.replymsg = map.get(cid)
    }
    resetMessageRecords(records)
  }
  async function handleTest () {
 
    var res = await axios.get('/test.json')
    const ipfs = await IPFS.create()

    let map = new Map<string,any>()
    var records = res.data

    for(let i =0;i < records.length;i++) {
        var cid =  Utils.fieldToCid(records[i].data.cid)
        map.set(cid,""); 
        cid = Utils.fieldToCid(records[i].data.reply)
        map.set(cid,""); 
    }
    let iterator = map.keys();  
    let r: IteratorResult<string,string>;   
    while (r = iterator.next(), !r.done) { 
      var cid = r.value
      const source = ipfs.cat(cid)
      let s = ''
      const decoder = new TextDecoder('utf-8')
      for await (const chunk of source) {
        s += decoder.decode(chunk, {
          stream: true
        })
      }
      s += decoder.decode()
      map.set(cid,JSON.parse(s)) 
    } 
    ipfs.stop() 
    for(let i =0;i < records.length;i++) {
      var record = records[i]
      var cid =  Utils.fieldToCid(record.data.cid)
      record.data.msg = map.get(cid)
      cid = Utils.fieldToCid(record.data.reply)
      record.data.replymsg = map.get(cid)
    }
    resetMessageRecords(records)
  }
 
  useEffect(() => {
    if(hasRecv.current){
      hasRecv.current = false;
      return;
    }
    handleRecv()
 
  },[])
  return (
    <>
      <div className="mt-4 w-full h-full">
      <div className= "grid grid-cols-1 gap-2" >
        {messageRecords.length ? (
          messageRecords.map((record: any) => (
            <div className="w-full shadow h-auto bg-white rounded-md">
            <div className="flex items-center space-x-2 p-2.5 px-4">
              <div className="w-10 h-10">
                <RiUserReceivedFill className="w-full h-full rounded-full" />
              </div>
              <div className="flex-grow flex flex-col">
                <p className="font-semibold text-sm text-gray-700 break-all"> {record.from}</p>
                <span className="text-xs font-thin text-gray-400">
                  {
                  //moment(post.createdAt).fromNow()
                }
                </span>
              </div>
              <div className="w-8 h-8">
                <button className="w-full h-full hover:bg-gray-100 rounded-full text-gray-400 focus:outline-none">
                  <i className="fas fa-ellipsis-h"></i>
                </button>
              </div>
            </div>
          
              <div className="mb-1">
                <p className="text-gray-700 px-3 text-sm break-all" dangerouslySetInnerHTML={{__html:record.data.msg.content.replaceAll("\n","<br />")}}>
              
                </p>
              </div>
            
      
            <div className="w-full flex flex-col space-y-2 p-2 px-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-300 text-gray-500 text-sm">
                 
              </div>
              <div className="flex space-x-3 text-gray-500 text-sm font-thin">
              {record.data.msg.title}
              </div>
            </div>
          </div>
          ))
        ) : (
          <p>No message yet!</p>
        )}
      </div>
    </div>
     
    </>
  );
};

export default Inbox;
