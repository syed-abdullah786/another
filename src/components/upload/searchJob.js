import React, { useState, useRef} from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { toast, Slide } from "react-toastify";

function SearchJobImg({data,setData}) {
    const history = useHistory();
    const [job, setJob] = useState("");
    const uploadimgCheckboxRef = useRef(null);

    const Search = () => {
        history.push(`/crawl?url=${job}`);
      };

      const updateAll=()=>{
        if (uploadimgCheckboxRef.current.checked) {
          const value={upload_img:true}
          axios
          .patch(`http://18.191.139.138:90/update_allimg/`, value)
          .then((response) => {
            setData(data.map(item => ({ ...item, upload_img: true })))
            notify22("Data Updated", "success");
          })
          .catch((e) => {
            notify22(e.message, "error");
          });
    
        } else {
          const value={upload_img:false}
          axios
          .patch(`http://18.191.139.138:90/update_allimg/`, value)
          .then((response) => {
            setData(data.map(item => ({ ...item, upload_img: false })))
            notify22("Data Updated", "success");
          })
          .catch((e) => {
            notify22(e.message, "error");
          });
    
        }
      }

      const notify22 = (msg, type) =>
      toast(msg, {
        transition: Slide,
        autoClose: 3000,
        position: "top-right",
        type: type,
      });

  return (
    <>
    <p className="text-left font-bold mb-2">Search by job id</p>
                    <div className="my-2 w-60 flex border rounded-lg shadow-md">
                      <input
                        type="number"
                        className="w-40 flex-grow p-2 rounded-l-lg"
                        placeholder="Enter Job Id"
                        value={job}
                        onChange={(e) => {
                          setJob(e.target.value >= 0 ? e.target.value : job);
                        }}
                      />
                      <button
                        disabled={job == ""}
                        className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
                        onClick={Search}
                      >
                        Search
                      </button>
                    </div>
                    <label className="flex font-bold flex items-center relative w-max cursor-pointer select-none">
                      Upload All Images&nbsp;&nbsp;
                      <input
                      checked={!data.some(item => item.upload_img === false)}
                        type="checkbox"
                        onChange={() => updateAll()}
                        ref={uploadimgCheckboxRef}
                        className="input appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 bg-red-500"
                      />
                      <span className="absolute font-medium text-xs uppercase right-1 text-white">
                        {" "}
                        NO
                      </span>
                      <span className="absolute font-medium text-xs uppercase right-8 text-white">
                        {" "}
                        YES{" "}
                      </span>
                      <span className="w-7 h-7 right-7 absolute rounded-full transform transition-transform bg-gray-200" />
                    </label>
                    
                    
                    </>
  )
}

export default SearchJobImg