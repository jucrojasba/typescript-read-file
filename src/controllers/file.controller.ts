import { CSVData } from "../models/file.model";

export class CSVHandler {
    private sortColumn: string | null = null;
    private sortAscending: boolean = true;


    constructor(
        private csvData: CSVData[],
        private currentPage: number,
        private recordsPerPage: number,
        private searchInput: HTMLInputElement,
        private tableContainer: HTMLDivElement,
        private paginationContainer: HTMLDivElement
    ) {
        this.searchInput.addEventListener('input', this.debounce(() => this.renderTable(this.currentPage), 300));
    }

    debounce(func: Function, wait: number) {
        let timeout: number;
        return (...args: any) => {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Controller for Upload files
    handleFileUpload(event: Event): void {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file && file.type === 'text/csv') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = (e.target as FileReader).result as string;
                this.parseCSV(text);
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a valid CSV file.');
        }
    }

    // Controller for Parse CSV
    parseCSV(text: string): void {
        const lines = text.split('\n').filter(line => line.trim() !== ''); 
        const headers = lines[0].split(',').map(header => header.trim()); 
    
        this.csvData = lines.slice(1).map(line => {
            const values = line.split(',').map(value => value.trim());
            const obj: CSVData = {};
    
            if (values.length === headers.length) {
                headers.forEach((header, index) => {
                    obj[header] = values[index];
                });
            } else {
                console.warn(`Skipping line due to column mismatch: ${line}`);
            }
    
            return obj;
        }).filter(obj => Object.keys(obj).length > 0);
    
        this.renderTable(1);
    }

    //Controller for filter data
    filterData(data: CSVData[], searchQuery: string): CSVData[] {
        return data.filter(row => {
            return Object.values(row).some(value => value.includes(searchQuery));
        });
    }

    //Controller for sort Data
    sortData(data: CSVData[], column: string, ascending: boolean): CSVData[] {
        return data.sort((a, b) => {
            if (a[column] < b[column]) return ascending ? -1 : 1;
            if (a[column] > b[column]) return ascending ? 1 : -1;
            return 0;
        });
    }
    
    //Controller for pagination
    paginateData(data: CSVData[], page: number, recordsPerPage: number): CSVData[] {
        const start = (page - 1) * recordsPerPage;
        return data.slice(start, start + recordsPerPage);
    }
    
    //Controller for render table
    renderHTMLTable(data: CSVData[]): void {
        if (!data.length) {
            this.tableContainer.innerHTML = '<p>No data available.</p>';
            return;
        }

        const headers = Object.keys(data[0]);
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = '⇅'+header;
            th.addEventListener('click', () => {
                if (this.sortColumn === header ) {
                    this.sortAscending = !this.sortAscending;
                } else {
                    this.sortColumn = header;
                    this.sortAscending = true;
                }
                this.renderTable(this.currentPage);
            });
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
        this.tableContainer.innerHTML = '';
        this.tableContainer.appendChild(table);
    }
    
    // Controller for render pagination
    renderPagination(totalRecords: number): void {
        const totalPages = Math.ceil(totalRecords / this.recordsPerPage);
        this.paginationContainer.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i.toString();
            button.addEventListener('click', () => this.renderTable(i));
            this.paginationContainer.appendChild(button);
        }
    }
    
    // Controller for render table and pagination
    renderTable(page: number): void {
        let filteredData = this.filterData(this.csvData, this.searchInput.value);
        if (this.sortColumn) {
            filteredData = this.sortData(filteredData, this.sortColumn, this.sortAscending);
        }
        const paginatedData = this.paginateData(filteredData, page, this.recordsPerPage);
        this.currentPage = page;
        this.renderHTMLTable(paginatedData);
        this.renderPagination(filteredData.length); // Actualiza el gráfico con los datos filtrados y ordenados
    }
    
    //Controller for download data
    downloadCSV(): void {
        let filteredData = this.filterData(this.csvData, this.searchInput.value);
        if (this.sortColumn) {
            filteredData = this.sortData(filteredData, this.sortColumn, this.sortAscending);
        }
        const paginatedData = this.paginateData(filteredData, this.currentPage, this.recordsPerPage);
    
        const headers = Object.keys(paginatedData[0] || {});
        const csvRows: string[] = [];
    
        csvRows.push(headers.join(','));
    
        for (const row of paginatedData) {
            csvRows.push(headers.map(header => JSON.stringify(row[header] || '')).join(','));
        }
    
        const csvContent = csvRows.join('\n');
    
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
    
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'MyQuery.csv');
        a.click();
    
        URL.revokeObjectURL(url);
    }
    
}




