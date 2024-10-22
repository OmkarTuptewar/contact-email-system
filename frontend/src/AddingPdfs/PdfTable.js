import React from 'react';
import * as XLSX from 'xlsx';

const PdfTable = ({ pdfs = [] }) => {
    // Base URL for the server where PDFs are stored
    const baseURL = `${process.env.REACT_APP_API_URL}`;

    // Function to export the table to Excel
    const exportToExcel = () => {
        const worksheetData = [];
        const header = ['Description', 'PDF URL'];
        worksheetData.push(header);
    
        pdfs.forEach(pdf => {
            worksheetData.push([pdf.description, pdf.url]);
        });
    
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
        // Set column widths
        const columnWidths = [
            { width: 30 }, // Width for 'Description' column
            { width: 50 }, // Width for 'PDF URL' column
        ];
        worksheet['!cols'] = columnWidths;
    
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'PDFs');
        XLSX.writeFile(workbook, 'pdfs.xlsx');
    };
    

    return (
        <div className="overflow-x-auto max-h-[50vh] overflow-y-auto">
            <div className='flex justify-between items-center mb-4'>
                <h3 className="font-bold text-lg">PDFs Table:</h3>
                <button
                    onClick={exportToExcel}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                    Export PDFs to Excel
                </button>
            </div>
            <table className="min-w-full bg-white border">
                <thead>
                    <tr>
                        <th className="text-left py-2 px-4 border-b border-gray-300" style={{ width: '60%' }}>
                            Description
                        </th>
                        <th className="text-left py-2 px-4 border-b border-gray-300" style={{ width: '40%' }}>
                            PDF URL
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {pdfs.length > 0 ? (
                        pdfs.map((pdf, index) => (
                            <tr key={index}>
                                <td className="py-2 px-4 border-b border-gray-300 border-r-2" style={{ width: '40%' }}>
                                    {pdf.description}
                                </td>
                                <td className="py-2 px-4 border-b border-gray-300 border-l-2" style={{ width: '60%' }}>
                                    {pdf.url ? (
                                        <a
                                            href={`${baseURL}${pdf.url}`} // Combine base URL with the relative path
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            {pdf.url}
                                        </a>
                                    ) : 'N/A'}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={2} className="py-2 px-4 text-center text-gray-400">
                                No PDFs available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PdfTable;
