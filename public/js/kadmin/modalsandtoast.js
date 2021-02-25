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
 * @param {{}} options
 * @return {void}
 */
function fireToast(code, type= "success", options = {}) {
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
      let text = globalvars.lang_arr.modalsandtoast.toast[code]
      if(options.replace !== undefined) if(Array.isArray(options.replace)) text = text.replaceArray(options.replace[0], options.replace[1])

      let toastrOPT = {
         "closeButton": false,
         "debug": false,
         "newestOnTop": true,
         "progressBar": true,
         "positionClass": "toast-top-right",
         "preventDuplicates": false,
         "onclick": null,
         "showDuration": "300",
         "hideDuration": "1000",
         "timeOut": "10000",
         "extendedTimeOut": "1000",
         "showEasing": "swing",
         "hideEasing": "linear",
         "showMethod": "fadeIn",
         "hideMethod": "fadeOut"
      }

      for (const [key, value] of Object.entries(options)) {
         if(key !== "replace") {
            toastrOPT[key] = value
         }
      }

      toastr.options = toastrOPT
      toastr[type](text)
   }
}

/**
 * Feuert ein Modal
 * @param {string|int} code
 * @param {string} type
 * @param {{}} options
 * @return {void}
 */
function fireModal(code, type= "success", options = {}) {
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
      let text = globalvars.lang_arr.modalsandtoast.modal[code]
      if(options.replace !== undefined) if(Array.isArray(options.replace)) text = text.replaceArray(options.replace[0], options.replace[1])

      let swalOPT = {
         showCancelButton: false,
         showConfirmButton: false,
         title: globalvars.lang_arr.modalsandtoast[type],
         text: text,
         icon: type,
         timer: 10000,
         didOpen: (toast) => {
            toast.addEventListener('click', Swal.close)
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
         }
      }

      for (const [key, value] of Object.entries(options)) {
         if(key !== "replace") {
            swalOPT[key] = value
         }
      }

      swalWithBootstrapButtons.fire(swalOPT)
   }
}