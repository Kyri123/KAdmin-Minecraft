/*
* *******************************************************************************************
* @author:  Oliver Kaufmann (Kyri123)
* @copyright Copyright (c) 2019-2020, Oliver Kaufmann
* @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-Minecraft/blob/master/LICENSE)
* Github: https://github.com/Kyri123/KAdmin-Minecraft
* *******************************************************************************************
*/
"use strict"

const swalWithBootstrapButtons = Swal.mixin({
   customClass: {
      confirmButton: 'btn btn-success m-1',
      cancelButton: 'btn btn-danger m-1'
   },
   buttonsStyling: false
})

const sweetToast = Swal.mixin({
   toast: true,
   position: 'top-end',
   showConfirmButton: false,
   timer: 3000,
   timerProgressBar: true,
   didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
   }
})

/**
 * Feuert ein Toast
 * @param {string|int} code
 * @param {string} type
 * @return {void}
 */
function fireToast(code, type= "success") {
   if(
      globalvars.lang_arr.modalsandtoast.toast[code] !== undefined
      && type.includesArray([
         "success",
         "error",
         "warning",
         "info",
         "question"
      ])
   ) {
      toastr[type](globalvars.lang_arr.modalsandtoast.toast[code])

      toastr.options = {
         "closeButton": false,
         "debug": false,
         "newestOnTop": true,
         "progressBar": true,
         "positionClass": "toast-top-right",
         "preventDuplicates": false,
         "onclick": null,
         "showDuration": "300",
         "hideDuration": "1000",
         "timeOut": "3000",
         "extendedTimeOut": "1000",
         "showEasing": "swing",
         "hideEasing": "linear",
         "showMethod": "fadeIn",
         "hideMethod": "fadeOut"
      }
   }
}

/**
 * Feuert ein Modal
 * @param {string|int} code
 * @param {string} type
 * @param {boolean} endless
 * @return {void}
 */
function fireModal(code, type= "success", endless = false) {
   if(
      globalvars.lang_arr.modalsandtoast.modal[code] !== undefined
      && type.includesArray([
         "success",
         "error",
         "warning",
         "info",
         "question"
      ])
   ) {
      swalWithBootstrapButtons.fire({
         showCancelButton: false,
         showConfirmButton: false,
         title: globalvars.lang_arr.modalsandtoast[type],
         text: globalvars.lang_arr.modalsandtoast.modal[code],
         icon: type,
         timer: endless ? 300000000000 : 3000,
         didOpen: (toast) => {
            toast.addEventListener('click', Swal.close)
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
         }
      })
   }
}

setInterval(() => fireToast(1), 500)