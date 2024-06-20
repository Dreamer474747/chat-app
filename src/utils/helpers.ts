//@ts-nocheck

import swal from "sweetalert";


const showSwal = (title: string, icon: string, buttons: string[] | string ) => {
	return swal({ title, icon, buttons })
}


export { showSwal };