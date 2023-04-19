import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { Button } from '@demox-labs/aleo-wallet-adapter-reactui/dist/Button';
import Utils from './Utils';
 
import axios from 'axios';
import * as IPFS from 'ipfs-core'
import { WalletNotConnectedError } from '@demox-labs/aleo-wallet-adapter-base';
import { DMAIL_PROGRAM_NAME } from './App';

export const CHAT_PROGRAM_NAME = 'chat.aleo'; 

function Box() {
 
  const { wallet, publicKey ,requestRecords} = useWallet();

  let [messageRecords, resetMessageRecords] = useState<any>([]);

  const handleRecv = async (event: any) => {
    event.preventDefault();
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
  async function handleClick () {
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
  return (
    <>
      <div className='p3 text-center'>
        
        <Button className="wallet-adapter-button-trigger w-30" onClick={handleClick}>
          receive message
        </Button> 
        <div className="grid grid-cols-1 gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <ul className="space-y-8">
            {
              messageRecords.map((record: any) => {
                return(
                  <li className="text-sm leading-6"  key={record.id}>
                    <figure className="relative flex flex-col-reverse bg-slate-100 rounded-lg p-6 dark:bg-slate-800 dark:highlight-white/5">
                      <blockquote className="mt-6 text-slate-700 dark:text-slate-300">
                        <p>{record.data.msg.content}</p>
                      </blockquote>
                      <figcaption className="flex items-center space-x-4">
                        <img src="/logo192.png" className="flex-none w-14 h-14 rounded-full object-cover" loading="lazy" decoding="async" />
                        <div className="flex-auto">
                          <div className="text-base text-slate-900 font-semibold dark:text-slate-300">
                            <span className="absolute inset-0"></span>{record.from}
                          </div>
                          <div className="mt-0.5">{record.data.msg.title}</div>
                          </div>
                      </figcaption>
                    </figure>
                  </li>
                )
              })
            }
            
          </ul>
        </div>
      </div>
    </>
  );
}

export default Box;
