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
      globalvars.lang_arr.sweet.toast[code] !== undefined
      && type.includesArray([
         "success",
         "error",
         "warning",
         "info",
         "question"
      ])
   ) {
      let toast = Swal.mixin({
         toast: true,
         position: 'top-end',
         showConfirmButton: false,
         timer: 3000,
         timerProgressBar: true,
         didOpen: (toast) => {
            toast.addEventListener('click', Swal.close)
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
         }
      })

      toast .fire({
         icon: type,
         text: globalvars.lang_arr.sweet.toast[code],
         showCancelButton: false
      })
   }
}

/**
 * Feuert ein Modal
 * @param {string|int} code
 * @param {string} type
 * @return {void}
 */
function fireModal(code, type= "success") {
   if(
      globalvars.lang_arr.sweet.modal[code] !== undefined
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
         title: globalvars.lang_arr.sweet[type],
         text: globalvars.lang_arr.sweet.modal[code],
         icon: type,
         timer: 3000,
         didOpen: (toast) => {
            toast.addEventListener('click', Swal.close)
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
         }
      })
   }
}