import React, { useState } from "react";
import axios from "axios";
import { toast, Slide } from "react-toastify";

function Addproperty({data,setData}) {
    const [modal, setModal] = useState(false);
    const [url, setUrl] = useState("");

    const adddata = () => {
        if (url == "") {
          notify22("Please enter the url", "error");
        } else {
          const value = { url: url, status: 'new'};
          axios
            .post("http://18.191.139.138:90/create_prop/", value)
            .then((response) => {
              setData([response.data, ...data]);
              setUrl("");
              setModal(false);
              notify22("Url Added", "success");
            })
            .catch((e) => {
              notify22(e.response.data.url[0], "error");
            });
        }};

      const notify22 = (msg, type) =>
      toast(msg, {
        transition: Slide,
        autoClose: 3000,
        position: "top-right",
        type: type,
      });

  return (
    <>
    <button
    onClick={() => setModal(!modal)}
    className="border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 ml-[95px] mb-2 group relative overflow-hidden text-white"
  >
    Add Address
    <div className="absolute inset-0 h-full w-full scale-0 rounded-md transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
  </button>
    {modal && (
        <div className="py-12 bg-gray-700 bg-opacity-30 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0">
          <div role="alert" className="container mx-auto w-8/12">
            <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
              <h1 className="text-gray-800 font-lg font-bold tracking-normal leading-tight mb-4">
                Add New Property
              </h1>
              <p className="text-left text-gray-800 text-sm font-bold leading-tight tracking-normal">
                Property Url
              </p>
              <div className="relative mb-5 mt-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-4 text-sm border-gray-300 rounded border"
                  required
                  placeholder="Enter URL"
                />
              </div>
              <div className="flex items-center justify-start w-full">
                <button
                  onClick={adddata}
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                >
                  Submit
                </button>
                <button
                  onClick={() => {setModal(!modal);setUrl("");}}
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
              <button
                onClick={() => {setModal(!modal);setUrl("");}}
                className="cursor-pointer absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600"
                aria-label="close modal"
                role="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-x"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}</>
  )
}

export default Addproperty