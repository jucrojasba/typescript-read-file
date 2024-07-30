import './upload-file.css';
import { navigateTo } from "../../../router";

export function uploadFileView() {
    const $root = document.getElementById('root') as HTMLElement;

    // Page Content
    $root.innerHTML = `
    <div class="upload-file">
        <div class="upload-file-message">
        <h1>I ♡ CSV</h1>
        <p>Please upload a CSV file to do queries</p>
        <input type="file" id="fileInput" accept=".csv" />
        </div>
    </div>
    `;

    // Logic
    const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;


    if (!fileInput) {
        console.error('One or more elements are missing from the DOM.');
        return;
    };

    // Save file input value to localStorage on change
    fileInput.addEventListener('change', (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                localStorage.setItem('csvFileContent', reader.result as string);
            };
            reader.readAsText(file);
            window.location.reload();
        }
    });
}
