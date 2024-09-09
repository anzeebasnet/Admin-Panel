"use client";

import React from "react";
import * as XLSX from "xlsx";

// Function to export the table to Excel
const exportToExcel = (data: any[], fileName: string) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Convert the data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write the workbook and trigger download
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

type TableData = {
  id: number;
  name: string;
  age: number;
  city: string;
};

const data: TableData[] = [
  { id: 1, name: "John Doe", age: 28, city: "New York" },
  { id: 2, name: "Jane Smith", age: 34, city: "Los Angeles" },
  { id: 3, name: "Tom Brown", age: 22, city: "Chicago" },
];

const TableComponent = () => {
  const handleExport = () => {
    // Call the exportToExcel function with your data and file name
    exportToExcel(data, "TableData");
  };

  return (
    <div className=" py-6">
      <table className="min-w-full bg-white dark:bg-dark_gray border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">ID</th>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Age</th>
            <th className="px-4 py-2 border-b">City</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {data.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-2 border-b">{row.id}</td>
              <td className="px-4 py-2 border-b">{row.name}</td>
              <td className="px-4 py-2 border-b">{row.age}</td>
              <td className="px-4 py-2 border-b">{row.city}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleExport}
        className="mt-4 bg-bg_orange bg-blue-500 text-white px-4 py-2 rounded "
      >
        Export to Excel
      </button>
    </div>
  );
};

export default TableComponent;