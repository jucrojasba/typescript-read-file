import { CSVData } from "../../../models/file.model";
import { CSVHandler } from "../../../controllers/file.controller";
import './upload-file.css';

export function uploadFileView() {
    const $root = document.getElementById('root') as HTMLElement;

    // Page Content
    $root.innerHTML = `
        <input type="file" id="fileInput" accept=".csv" />
        <input type="text" id="searchInput" placeholder="Search..."/>
        <div id="tableContainer"></div>
        <div id="paginationContainer"></div>
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
        }
    });
}
