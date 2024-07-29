import { navigateTo } from "../../../router";

export function uploadFileView(){
    const $root= document.getElementById('root') as HTMLElement;

    //Page Content
    $root.innerHTML=`
    <h1>Hola desde upload File</h1>
    <button id="upload-file">Upload File</button>
    `;

    //Logic
    const $uploadFile = document.getElementById('upload-file') as HTMLButtonElement;
    $uploadFile.addEventListener('click',()=>{
        localStorage.setItem('uploadedFile', 'Holi')
        navigateTo('/result')
    })


}