import Swal from 'sweetalert2';

export const toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
  // z-index is controlled via CSS (.swal2-container) to avoid SweetAlert2 param warnings
  customClass: {
    container: 'swal2-toast-container-high-z',
  },
});

export const showToast = (icon = 'info', title = '') =>
  toast.fire({
    icon,
    title: title || 'Notification',
  });

export const showSuccess = (title) => showToast('success', title || 'Success');

export const showError = (title) => showToast('error', title || 'Something went wrong');

export const showConfirm = async (title, text = '', confirmButtonText = 'Yes', cancelButtonText = 'Cancel') => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText,
    cancelButtonText,
  });
  return result.isConfirmed;
};

