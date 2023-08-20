import {create} from 'zustand';

type ModalDialogState = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};


export const useModalDialog = create<ModalDialogState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
