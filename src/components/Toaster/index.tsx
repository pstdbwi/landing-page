import toast from 'react-hot-toast';

export const notifyError = (message: string) => toast.error(message);
export const notifySuccess = (message: string) => toast.success(message);
