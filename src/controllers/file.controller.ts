import { CSVData } from "../models/file.model";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export class CSVHandler {
    private sortColumn: string | null = null;
    private sortAscending: boolean = true;
    private chart: Chart | null = null;

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

    // Parse CSV
    parseCSV(text: string): void {
        const lines = text.split('\n').filter(line => line.trim() !== ''); // Filtra líneas vacías
        const headers = lines[0].split(',').map(header => header.trim()); // Asegúrate de que las cabeceras estén bien formateadas
    
        this.csvData = lines.slice(1).map(line => {
            const values = line.split(',').map(value => value.trim());
            const obj: CSVData = {};
    
            // Solo procesa la línea si tiene el mismo número de valores que de cabeceras
            if (values.length === headers.length) {
                headers.forEach((header, index) => {
                    obj[header] = values[index];
                });
            } else {
                console.warn(`Skipping line due to column mismatch: ${line}`);
            }
    
            return obj;
        }).filter(obj => Object.keys(obj).length > 0); // Filtra los objetos vacíos
    
        this.renderTable(1);
    }

    filterData(data: CSVData[], searchQuery: string): CSVData[] {
        return data.filter(row => {
            return Object.values(row).some(value => value.includes(searchQuery));
        });
    }

    sortData(data: CSVData[], column: string, ascending: boolean): CSVData[] {
        return data.sort((a, b) => {
            if (a[column] < b[column]) return ascending ? -1 : 1;
            if (a[column] > b[column]) return ascending ? 1 : -1;
            return 0;
        });
    }

    paginateData(data: CSVData[], page: number, recordsPerPage: number): CSVData[] {
        const start = (page - 1) * recordsPerPage;
        return data.slice(start, start + recordsPerPage);
    }

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
            th.textContent = header;
            th.addEventListener('click', () => {
                if (this.sortColumn === header) {
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

    renderChart(data: CSVData[]): void {
        // Elimina el gráfico anterior si existe
        if (this.chart) {
            this.chart.destroy();
        }

        // Crear un nuevo lienzo para el gráfico
        const ctx = document.createElement('canvas');
        this.tableContainer.appendChild(ctx);

        // Datos para el gráfico
        const departments = data.reduce((acc: { [key: string]: number }, row) => {
            const dept = row['Department']; // Ajusta esto al nombre real de tu columna
            if (dept) {
                acc[dept] = (acc[dept] || 0) + 1;
            }
            return acc;
        }, {});

        const labels = Object.keys(departments);
        const values = Object.values(departments);

        // Crear el gráfico
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '# of Municipalities',
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    renderTable(page: number): void {
        let filteredData = this.filterData(this.csvData, this.searchInput.value);
        if (this.sortColumn) {
            filteredData = this.sortData(filteredData, this.sortColumn, this.sortAscending);
        }
        const paginatedData = this.paginateData(filteredData, page, this.recordsPerPage);
        this.currentPage = page;
        this.renderHTMLTable(paginatedData);
        this.renderPagination(filteredData.length);
        this.renderChart(filteredData);  // Actualiza el gráfico con los datos filtrados y ordenados
    }
}




