import { navigateTo } from '../../../router';
import './not-found.css'

export function notFoundView(){
    const $root = document.getElementById('root') as HTMLElement;
    $root.innerHTML = `
    <div class="root-container-not-found">
    <div class="not-found-container">
        <div class="message">
        <h1>404 Not Found</h1>
        <p>La página que busca no fue encontrada.</p>
        <button id="back-home">Back to Home</button>
        </div>
    </div>
    </div>;
    `;

    const $backToHome = document.getElementById('back-home') as HTMLButtonElement;

    $backToHome.addEventListener('click', (e)=>{
        e.preventDefault();
        navigateTo('/upload-file');
    })
}