import type { FC, ReactNode } from 'react';
import React, { useState } from 'react';
import { MailModalContext } from './useMailModal';
import type { MailModalProps } from './MailModal';
import { MailModal } from './MailModal';

export interface MailModalProviderProps extends MailModalProps {
    children: ReactNode;
}

export const MailModalProvider: FC<MailModalProviderProps> = ({ children, ...props }) => {
    const [visible, setVisible] = useState(false);

    return (
        <MailModalContext.Provider
            value={{
                visible,
                setVisible,
            }}
        >
            {children}
            {visible && <MailModal {...props} />}
        </MailModalContext.Provider>
    );
};
