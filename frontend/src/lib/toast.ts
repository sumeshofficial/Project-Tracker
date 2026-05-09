import Swal from "sweetalert2";

export const toast = {
  success(message: string) {
    return Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  },

  error(message: string) {
    return Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  },

  confirm(message: string) {
    return Swal.fire({
      title: "Are you sure?",
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#000",
    });
  },
};