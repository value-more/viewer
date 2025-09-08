import { createEvent, createStore } from 'effector';
import { ToastMessage } from 'primereact/toast';

const $toast = createStore<ToastMessage | null>(null);
const showToast = createEvent<ToastMessage>();
$toast.on(showToast, (_, state) => state);

export const toasts = {
    $toast,
    showToast
};
