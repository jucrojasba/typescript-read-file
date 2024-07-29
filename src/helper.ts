interface CSVData {
    [key: string]: string;
}

let csvData: CSVData[] = [];
let currentPage: number = 1;
const recordsPerPage: number = 15;

const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const searchInput = document.getElementById('searchInput') as HTMLInputElement;
const tableContainer = document.getElementById('tableContainer') as HTMLDivElement;
const paginationContainer = document.getElementById('paginationContainer') as HTMLDivElement;

fileInput.addEventListener('change', handleFileUpload);
searchInput.addEventListener('input', () => renderTable(currentPage));

function handleFileUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.type === 'text/csv') {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = (e.target as FileReader).result as string;
            parseCSV(text);
        };
        reader.readAsText(file);
    } else {
        alert('Please upload a valid CSV file.');
    }
}

function parseCSV(text: string): void {
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    csvData = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj: CSVData = {};
        headers.forEach((header, index) => {
            obj[header.trim()] = values[index].trim();
        });
        return obj;
    });
    renderTable(1);
}

function renderTable(page: number): void {
    const filteredData = filterData(csvData, searchInput.value);
    const paginatedData = paginateData(filteredData, page, recordsPerPage);
    currentPage = page;
    renderHTMLTable(paginatedData);
    renderPagination(filteredData.length);
}

function filterData(data: CSVData[], query: string): CSVData[] {
    if (!query) return data;
    return data.filter(row => Object.values(row).some(value => value.includes(query)));
}

function paginateData(data: CSVData[], page: number, recordsPerPage: number): CSVData[] {
    const startIndex = (page - 1) * recordsPerPage;
    return data.slice(startIndex, startIndex + recordsPerPage);
}

function renderHTMLTable(data: CSVData[]): void {
    if (!data.length) {
        tableContainer.innerHTML = '<p>No data available.</p>';
        return;
    }

    const headers = Object.keys(data[0]);
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    data.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header];
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
}

function renderPagination(totalRecords: number): void {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i.toString();
        button.disabled = i === currentPage;
        button.addEventListener('click', () => renderTable(i));
        paginationContainer.appendChild(button);
    }
}
