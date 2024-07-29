import { CSVData } from "../../models/file.model";
import { CSVHandler } from "../../controllers/file.controller";
import './result.css';

export function resultView(){
    const $root=document.getElementById('root') as HTMLElement;
    $root.innerHTML=`
    <h1>Results</h1>
    <div class="actions">
    <input type="text" id="searchInput" placeholder="Search..."/>
    <button id="download">Download CSV</button>
    <button id="clearCSV">Upload another CSV</button>
    </div>
    <h3>Pages</h3>
    <div id="paginationContainer"></div>
    <div id="tableContainer"></div>
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

    // Instanciate
    const csvHandler = new CSVHandler(csvData, currentPage, recordsPerPage, searchInput, tableContainer, paginationContainer);


    // Load file input value from localStorage
    const storedFileContent = localStorage.getItem('csvFileContent');
    if (storedFileContent) {
        const blob = new Blob([storedFileContent], { type: 'text/csv' });
        const file = new File([blob], 'stored.csv', { type: 'text/csv' });
        
        const event = { target: { files: [file] } } as any;
        csvHandler.handleFileUpload(event);
    }

    searchInput.addEventListener('input', () => csvHandler.renderTable(currentPage));

    //Delete CSV
    const $clearCSVButton = document.getElementById('clearCSV') as HTMLButtonElement | null;
    if ($clearCSVButton) {
        $clearCSVButton.addEventListener('click', () => {
            localStorage.removeItem('csvFileContent');
            window.location.reload();
        });
    }

    // Download CSV
    document.getElementById('download')?.addEventListener('click', () => csvHandler.downloadCSV());
} 