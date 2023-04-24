import type { FC, MouseEvent } from 'react';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
 
 
import { useMailModal } from './useMailModal';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { Transaction, WalletAdapterNetwork, WalletNotConnectedError } from '@demox-labs/aleo-wallet-adapter-base';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import { DMAIL_PROGRAM_NAME } from '../../Utils';

import * as IPFS from 'ipfs-core'
import Utils from '../../Utils';

export interface MailModalProps {
    className?: string;
    container?: string;
}

export const MailModal: FC<MailModalProps> = ({ className = '', container = 'body' }) => {
    const ref = useRef<HTMLDivElement>(null);
   
    const { setVisible } = useMailModal();
    const [expanded, setExpanded] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [portal, setPortal] = useState<Element | null>(null);
 

    const hideModal = useCallback(() => {
        setFadeIn(false);
        setTimeout(() => setVisible(false), 150);
    }, [setVisible]);

    const handleClose = useCallback(
        (event: MouseEvent) => {
            event.preventDefault();
            hideModal();
        },
        [hideModal]
    );
 

    const handleCollapseClick = useCallback(() => setExpanded(!expanded), [expanded]);

    const handleTabKey = useCallback(
        (event: KeyboardEvent) => {
            const node = ref.current;
            if (!node) return;

            // here we query all focusable elements
            const focusableElements = node.querySelectorAll('button');
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const firstElement = focusableElements[0]!;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const lastElement = focusableElements[focusableElements.length - 1]!;

            if (event.shiftKey) {
                // if going backward by pressing tab and firstElement is active, shift focus to last focusable element
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    event.preventDefault();
                }
            } else {
                // if going forward by pressing tab and lastElement is active, shift focus to first focusable element
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    event.preventDefault();
                }
            }
        },
        [ref]
    );

    useLayoutEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                hideModal();
            } else if (event.key === 'Tab') {
                handleTabKey(event);
            }
        };

        // Get original overflow
        const { overflow } = window.getComputedStyle(document.body);
        // Hack to enable fade in animation after mount
        setTimeout(() => setFadeIn(true), 0);
        // Prevent scrolling on mount
        document.body.style.overflow = 'hidden';
        // Listen for keydown events
        window.addEventListener('keydown', handleKeyDown, false);

        return () => {
            // Re-enable scrolling when component unmounts
            document.body.style.overflow = overflow;
            window.removeEventListener('keydown', handleKeyDown, false);
        };
    }, [hideModal, handleTabKey]);

    useLayoutEffect(() => setPortal(document.querySelector(container)), [container]);

    const { wallet, publicKey } = useWallet();

    const refTo = useRef<HTMLInputElement>(null);
    const refTitle = useRef<HTMLInputElement>(null);
    const refContent = useRef<HTMLTextAreaElement>(null);

    
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if (!publicKey) throw new WalletNotConnectedError();

        var map = {
            title: refTitle.current?.value,
            content:refContent.current?.value
        }
        var json = JSON.stringify(map)

        const ipfs = await IPFS.create()
        const { cid } = await ipfs.add(json)
        
        ipfs.stop()

        var messageCid = Utils.cidToField(cid.toString())
        //console.log(messageCid)

        var replyCid = Utils.cidToField("")
        //console.log(replyCid)
        const timestamp: number = Date.parse(new Date().toString())
        //console.log(timestamp)
        const inputs = [
          refTo.current?.value,
          `${messageCid}`,
          `${replyCid}`,
          `${timestamp}field`,
        ];
        console.log(inputs)
        
        const aleoTransaction = Transaction.createTransaction(
            publicKey,
            WalletAdapterNetwork.Testnet,
            DMAIL_PROGRAM_NAME,
            'send',
            inputs,
            'http://localhost:3000/build/send.prover'
          );

        const txPayload =
          (await (wallet?.adapter as LeoWalletAdapter).requestTransaction(
            aleoTransaction
          )) || '';
         console.log(txPayload)
    };
    return (
        portal &&
        createPortal(
            <div
                aria-labelledby="wallet-adapter-modal-title"
                aria-modal="true"
                className={`wallet-adapter-modal ${fadeIn && 'wallet-adapter-modal-fade-in'} ${className}`}
                ref={ref}
                role="dialog"
            >
                <div className="wallet-adapter-modal-container">
                    <div className="wallet-adapter-modal-wrapper">
                        <button onClick={handleClose} className="wallet-adapter-modal-button-close">
                            <svg width="14" height="14">
                                <path d="M14 12.461 8.3 6.772l5.234-5.233L12.006 0 6.772 5.234 1.54 0 0 1.539l5.234 5.233L0 12.006l1.539 1.528L6.772 8.3l5.69 5.7L14 12.461z" />
                            </svg>
                        </button>
                        <h1 style={{ fontWeight:500, fontSize:25, lineHeight:"36px", margin:0,  padding:"16px 32px 1px 32px", color:"#fff"}}>
                        New Message
                        </h1>
                        <form className="relative flex w-full flex-col rounded-full pl-5 pr-5" >

                            <p className="mt-6 text-gray-600">Address to send message: </p>
                            <label className="flex w-full items-center py-2">
                            <input className="h-11 p-1 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-300 border-gray-600 text-white placeholder:text-gray-500 focus:border-gray-500" 
                            placeholder="ie, aleo1mxe9tvqcudaxun3eqmfwlq7py9zktuff58l6kx4nfmu2n7xfdsrsy3rfcx"
                            ref={refTo} /> 
                            </label>

                            <p className="text-gray-600">Subject: </p>
                            <label className="flex w-full items-center py-2">
                            <input className="h-11 p-1 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-300 border-gray-600 text-white placeholder:text-gray-500 focus:border-gray-500" 
                            ref={refTitle} /> 
                            </label>  

                            <p className="text-gray-600">Message: </p>
                            <label className="flex w-full items-center py-2">
                            <textarea className="p-1 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-300 border-gray-600 text-white placeholder:text-gray-500 focus:border-gray-500" 
                            style={{height: "6rem"}}
                            ref={refContent} /> 
                            </label>   

                        </form>
                        <div className="wallet-adapter-modal-middle">
                            <button type="button" className="wallet-adapter-modal-middle-button"
                            disabled={!publicKey }
                            onClick={handleSubmit}>
                                {!publicKey ? 'Connect Your Wallet' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>,
            portal
        )
    );
};
