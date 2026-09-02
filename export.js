// 📄 Export/Import Functions

class ExportImport {
    static exportJSON(data, filename = 'export.json') {
        const json = Utils.toJSON(data);
        Utils.downloadFile(json, filename, 'application/json');
    }

    static exportCSV(data, filename = 'export.csv') {
        if (Array.isArray(data) && data.length === 0) {
            Utils.showAlert('داده‌ای برای صادرات وجود ندارد', 'warning');
            return;
        }

        let csv = '';
        if (Array.isArray(data)) {
            const keys = Object.keys(data[0]);
            csv = keys.join(',') + '\n';
            data.forEach(item => {
                csv += keys.map(key => {
                    const val = item[key];
                    return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
                }).join(',') + '\n';
            });
        }
        Utils.downloadFile(csv, filename, 'text/csv');
    }

    static exportExcel(data, filename = 'export.xlsx') {
        // Simple Excel-like format (actually CSV)
        this.exportCSV(data, filename.replace('.xlsx', '.csv'));
    }

    static exportPDF(data, title = 'Report') {
        let html = `
            <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #6366f1; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                    th { background: #6366f1; color: white; }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <p>تاریخ: ${new Date().toLocaleDateString('fa-IR')}</p>
                <table>
        `;

        if (Array.isArray(data) && data.length > 0) {
            const keys = Object.keys(data[0]);
            html += '<thead><tr>';
            keys.forEach(key => html += `<th>${key}</th>`);
            html += '</tr></thead><tbody>';
            data.forEach(item => {
                html += '<tr>';
                keys.forEach(key => html += `<td>${item[key] || '-'}</td>`);
                html += '</tr>';
            });
            html += '</tbody>';
        }

        html += '</table></body></html>';
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
    }

    static async importJSON(fileContent) {
        try {
            const data = Utils.parseJSON(fileContent);
            if (!data) {
                return { success: false, message: 'فایل JSON نامعتبر است' };
            }
            return { success: true, data };
        } catch (error) {
            return { success: false, message: 'خطا در پردازش فایل: ' + error.message };
        }
    }

    static async importCSV(fileContent) {
        try {
            const lines = fileContent.trim().split('\n');
            if (lines.length < 2) {
                return { success: false, message: 'فایل CSV خالی است' };
            }

            const headers = lines[0].split(',');
            const data = [];

            for (let i = 1; i < lines.length; i++) {
                const obj = {};
                const values = lines[i].split(',');
                headers.forEach((header, index) => {
                    obj[header] = values[index] || '';
                });
                data.push(obj);
            }

            return { success: true, data };
        } catch (error) {
            return { success: false, message: 'خطا در پردازش فایل CSV: ' + error.message };
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExportImport;
}