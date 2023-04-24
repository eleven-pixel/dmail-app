import { createContext, useContext } from 'react';

export interface MailModalContextState {
    visible: boolean;
    setVisible: (open: boolean) => void;
}

const DEFAULT_CONTEXT = {
    setVisible(_open: boolean) {
        console.error(constructMissingProviderErrorMessage('call', 'setVisible'));
    },
    visible: false,
};
Object.defineProperty(DEFAULT_CONTEXT, 'visible', {
    get() {
        console.error(constructMissingProviderErrorMessage('read', 'visible'));
        return false;
    },
});

function constructMissingProviderErrorMessage(action: string, valueName: string) {
    return (
        'You have tried to ' +
        `${action} "${valueName}"` +
        ' on a MailModalContext without providing one.' +
        ' Make sure to render a MailModalProvider' +
        ' as an ancestor of the component that uses ' +
        'MailModalContext'
    );
}

export const MailModalContext = createContext<MailModalContextState>(DEFAULT_CONTEXT as MailModalContextState);

export function useMailModal(): MailModalContextState {
    return useContext(MailModalContext);
}
