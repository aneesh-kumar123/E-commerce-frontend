import React from "react";
import { TableDataFilter } from "./TableDataFilter";
import camelCaseToTitleCase from "@/utils/helper/camelCaseToTitleCase";

const Table = ({ data = [], requiredColumns = [], isAdmin, onView, onEdit, onDelete, limit, page }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-center text-gray-700">No data available</div>;
  }

  const filteredData = TableDataFilter(data, requiredColumns);
  const headers = Object.keys(filteredData[0]);

  // Set column widths (you can modify this as needed)
  const columnWidths = {
   aneesh:"kumar" // Example for category ID column width
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto min-w-max border-collapse border border-gray-200">
        <thead>
          <tr className="bg-purple-800 text-white">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-2 border border-gray-200 text-left"
                style={{ minWidth: columnWidths[header] || "auto", wordBreak: "break-word" }}
              >
                {header === "id" ? "S.No" : camelCaseToTitleCase(header)} {/* Replace 'id' header with 'S.No' */}
              </th>
            ))}
            <th className="px-4 py-2 border border-gray-200">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr key={rowIndex} className="text-gray-800 bg-white hover:bg-gray-100">
              {Object.entries(row).map(([key, cell], cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-2 border border-gray-200 text-center"
                  style={{
                    minWidth: columnWidths[headers[cellIndex]] || "auto",
                    wordBreak: "break-word", // Allow word to break into next line if too long
                    wordWrap: "break-word",  // Make sure long words break
                    whiteSpace: "normal",    // Allow wrapping of text
                    maxWidth: headers[cellIndex] === "description" ? "300px" : "none", // Limit max width for description
                  }}
                >
                  {key === "id" ? (rowIndex + 1 + (page - 1) * limit) : cell} {/* Replace UUID with serial number */}
                </td>
              ))}
              <td className="px-4 py-2 border border-gray-200 flex justify-center gap-2">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => onView(row.id)}
                >
                  {isAdmin ? "View" : "Balance"}
                </button>
                <button
                  className={`px-3 py-1 ${
                    isAdmin ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
                  } text-white rounded`}
                  onClick={() => onEdit(row)}
                >
                  {isAdmin ? "Edit" : "Passbook"}
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => onDelete(row.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
