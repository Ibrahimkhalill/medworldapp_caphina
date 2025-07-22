import React, { forwardRef, useImperativeHandle } from "react";

const QuotationPDF = forwardRef((props, ref) => {
  const { fields = [], data = [], title } = props;

  // Function to capitalize only the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Function to format the date to 'YYYY-MM-DD'
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // Return as-is if invalid date
    return date.toISOString().split("T")[0]; // Extract only 'YYYY-MM-DD'
  };

  // Function to format boolean values to 'Yes' or 'No'
  const formatValue = (value, field) => {
    if (field === "date") {
      return formatDate(value); // Handle date fields
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No"; // Convert true/false to Yes/No
    }
    return value || ""; // Return value or empty string if null/undefined
  };

  useImperativeHandle(ref, () => ({
    generateHtml: () => {
      // Add "Serial Number" header before other headers
      const headers =
        `<th>Serial No.</th>` +
        fields
          .map(
            (field) =>
              `<th>${capitalizeFirstLetter(field.replace(/_/g, " "))}</th>`
          )
          .join("");

      // Generate rows with Serial Number and formatted values
      const rows = data
        .map((row, index) => {
          return `<tr>
            <td>${index + 1}</td> <!-- Serial Number -->
            ${fields
              .map((field) => {
                const value = formatValue(row[field], field);
                return `<td>${value}</td>`;
              })
              .join("")}
          </tr>`;
        })
        .join("");

      // Generate full HTML content
      const htmlContent = `
 <html>
  <head>
    <style>
      @page {
        size: A4;
        margin: 5mm;
      }
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        zoom: 0.9;
      }
      .container {
        margin: 3mm auto;
        width: 100%;
        padding: 2mm;
        box-sizing: border-box;
      }
      h1 {
        text-align: center;
        color: #FFDC58;
        margin-bottom: 10px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        margin-top: 10px;
      }
      th, td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left;
        word-wrap: break-word;
      }
      th {
        background-color: #FFDC58;
      }
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>${title}</h1>
      <table>
        <thead>
          <tr>${headers}</tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  </body>
</html>
    `;
      return htmlContent;
    },
  }));

  return null; // No UI rendering needed for this component
});

export default QuotationPDF;
