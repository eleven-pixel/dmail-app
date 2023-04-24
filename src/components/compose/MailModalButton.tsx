import type { FC, MouseEvent } from 'react';
import React, { useCallback } from 'react';
import type { ButtonProps } from './Button';
import { Button } from './Button';
import { useMailModal } from './useMailModal';
import { HiOutlinePencil } from "react-icons/hi"

export const MailModalButton: FC<ButtonProps> = ({ children = 'Compose', onClick, ...props }) => {
    const { visible, setVisible } = useMailModal();

    const handleClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            if (onClick) onClick(event);
            if (!event.defaultPrevented) setVisible(!visible);
        },
        [onClick, setVisible, visible]
    );

    return (
        <Button className="wallet-adapter-button-trigger" startIcon=<HiOutlinePencil viewBox='3 3 18 18' /> onClick={handleClick} {...props}>
            {children}
        </Button>
    );
};
