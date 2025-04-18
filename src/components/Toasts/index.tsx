import React, { useEffect, useRef } from 'react'
import { Toast } from 'primereact/toast';
import { useUnit } from 'effector-react';
import { toasts } from '../../models/toast';

export const Toasts : React.FC = () => {
    const toast = useRef<Toast>(null);
    const toastMessage = useUnit(toasts.$toast);

    useEffect(() => {
        if (toastMessage) {
            toast.current?.show(toastMessage);
        }
    }, [toastMessage])
    
    return (
        <Toast ref={toast} position="top-right" className="w-25rem" />
    )
} 