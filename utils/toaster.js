import { Bounce, toast } from "react-toastify";

export const errorToast = (msg, delay = 4000) => {
  toast.error(msg, {
    position: "top-right",
    autoClose: delay,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
};
export const successToast = (msg, delay) => {
  toast.success(msg, {
    position: "top-right",
    autoClose: delay,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
};
