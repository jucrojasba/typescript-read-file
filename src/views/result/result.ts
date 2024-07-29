import { CSVData } from "../../../models/file.model";
import { CSVHandler } from "../../../controllers/file.controller";
import './result.css';

export function resultView(){
    const $root=document.getElementById('root') as HTMLElement;
    $root.innerHTML=`
    <h1>Hola desde results</h1>
    <input type="text" id="searchInput" placeholder="Search..."/>
    <div id="tableContainer"></div>
    <div id="paginationContainer"></div>
    `;

    let csvData: CSVData[] = [];
    let currentPage: number = 1;
    const recordsPerPage: number = 15;

    const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
    const tableContainer = document.getElementById('tableContainer') as HTMLDivElement | null;
    const paginationContainer = document.getElementById('paginationContainer') as HTMLDivElement | null;

    if (!searchInput || !tableContainer || !paginationContainer) {
        console.error('One or more elements are missing from the DOM.');
        return;
    }

    // Instanciar
    const csvHandler = new CSVHandler(csvData, currentPage, recordsPerPage, searchInput, tableContainer, paginationContainer);


    // Load file input value from localStorage
    const storedFileContent = localStorage.getItem('csvFileContent');
    if (storedFileContent) {
        const blob = new Blob([storedFileContent], { type: 'text/csv' });
        const file = new File([blob], 'stored.csv', { type: 'text/csv' });
        csvHandler.handleFileUpload({ target: { files: [file] } } as any);
    }

    searchInput.addEventListener('input', () => csvHandler.renderTable(currentPage));
} 