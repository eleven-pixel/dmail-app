import type { FC, MouseEvent } from 'react';
import React, { useCallback } from 'react';
import type { ButtonProps } from './Button';
import { Button } from './Button';
import { useMailModal } from './useMailModal';

export const MailModalButton: FC<ButtonProps> = ({ children = 'send message', onClick, ...props }) => {
    const { visible, setVisible } = useMailModal();

    const handleClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            if (onClick) onClick(event);
            if (!event.defaultPrevented) setVisible(!visible);
        },
        [onClick, setVisible, visible]
    );

    return (
        <Button className="wallet-adapter-button-trigger" onClick={handleClick} {...props}>
            {children}
        </Button>
    );
};
