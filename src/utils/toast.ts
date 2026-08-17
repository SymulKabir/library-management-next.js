import { toast, Bounce } from 'react-toastify';

const toastOptions: any = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
  transition: Bounce,
}


export const successToast = (message: string = 'Success!') => {
  toast.success(message, {
    ...toastOptions
  });
}
export const warningToast = (message: string = 'Failed!') => {
  toast.warning(message, {
    ...toastOptions
  });
}

export const promiseToast = async <T>(promise: Promise<T>, messages?: { pending?: string; success?: string; error?: string }) => {
  return toast.promise(
    promise,
    {
      pending: messages?.pending || "Processing...",
      success: messages?.success || "Success!",
      error: messages?.error || "Something went wrong!",
    },
    {
      // position: "top-center",
      // theme: "colored",
      ...toastOptions
    }
  );
};
