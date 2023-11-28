import React from 'react'
import Papa from "papaparse";

function Download({datas}) {

    const handleDownload = () => {

        // Create a new array with sorted objects by 'price'
        const sortedArray = [...datas].sort((a, b) => a.price - b.price);
        const csv = arrayToCSV(sortedArray);
        downloadCSV(csv, "data.csv");
      };
    
      const arrayToCSV = (array) => {
        let new_array = [];
    
        array.map((obj) => {
            delete obj.reality_user;
            delete obj.property;
            delete obj.status;
    
            new_array.push(obj);
        });
        const csv = Papa.unparse(new_array);
        return csv;
      };
      const downloadCSV = (csv, filename) => {
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, filename);
        } else {
          const link = document.createElement("a");
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      };
  return (
    <button
                onClick={() => handleDownload()}
                className="mb-8 float-left border border-green-500 bg-green-500 text-white rounded-md px-2 py-2 m-2 group relative overflow-hidden text-white"
              >
                Download csv
              </button>
  )
}

export default Download