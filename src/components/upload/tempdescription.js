import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { toast, Slide } from "react-toastify";
import SweetAlert from "react-bootstrap-sweetalert";

function Tempdescription() {
  const [description, setDescription] = useState([]);
  const [value, setValue] = useState("");
  const [modal, setModal] = useState(false);
  const [id, setId] = useState(false);
  const [alert, setAlert] = useState(false);

  const getData = () => {
    axios
      .get("http://18.191.139.138:90/template_desc/")
      .then((res) => {
        setDescription(res.data);
        setModal(true);
      })
      .catch((e) => {
        notify22(e.message, "error");
      });
  };

  const handledesc = () => {
    if (value == "") {
      notify22("Please enter some data", "error");
    } else {
      const data = { description: value };
      axios
        .post("http://18.191.139.138:90/template_desc/", data)
        .then((res) => {
          setDescription([res.data, ...description]);
          setValue("");
          notify22("Description Added", "success");
        })
        .catch((e) => {
          notify22(e.message, "error");
        });
    }
  };

  const del = () => {
    axios
      .delete(`http://18.191.139.138:90/del_template_desc/${id}/`)
      .then((res) => {
        const updatedList = description.filter((item) => item.id !== id);

        // Update the state with the new list
        setDescription(updatedList);
        notify22("Deleted", "success");
      })
      .catch((e) => {
        notify22(e.message, "error");
      });
    setAlert(false);
    setId(false);
  };

  const notify22 = (msg, type) =>
    toast(msg, {
      transition: Slide,
      autoClose: 3000,
      position: "top-right",
      type: type,
    });

  return (
    <>
      <SweetAlert
        show={alert}
        danger
        title="Woot!"
        showCancel
        confirmBtnText="Yes, delete it!"
        cancelBtnText="No!"
        onConfirm={del}
        onCancel={() => {
          setAlert(false);
          setId(false);
        }}
      >
        {" "}
        Do you want to delete it!
      </SweetAlert>
      <button
        onClick={() => getData()}
        className="mb-8 float-left border border-green-500 bg-green-500 text-white rounded-md px-2 py-2 m-2 group relative overflow-hidden text-white"
      >
        Template description
      </button>

      {modal && (
        <div className="fixed top-0 bg-gray-700 bg-opacity-30 right-0 bottom-0 overflow-y-auto left-0 flex items-center justify-center bg-gray-700 bg-opacity-30 transition duration-150 ease-in-out z-10">
          <div className="py-12 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0">
            <div role="alert" className="container mx-auto w-9/12">
              <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
                <p className="text-gray-800 font-lg text-xl font-bold tracking-normal leading-tight mb-4">
                  Add Template Description
                </p>

                <div className="grid divide-y divide-neutral-200 border rounded-lg px-4 mx-auto mt-8">
                  <div className="py-3">
                    <details className="group">
                      <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                        <span className="capitalize">Template Description</span>
                        <span className="transition group-open:rotate-180">
                          <svg
                            fill="none"
                            height="24"
                            shapeRendering="geometricPrecision"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            width="24"
                          >
                            <path d="M6 9l6 6 6-6"></path>
                          </svg>
                        </span>
                      </summary>
                      <textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-100 min-h-[100px] mt-2 rounded-md relative p-2 px-4"
                        placeholder="Add a description..."
                      ></textarea>
                      <button
                        onClick={() => handledesc()}
                        className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                      >
                        Save Description
                      </button>
                      {description?.map((desc, i) => (
                        <div key={i} className="relative mt-2">
                          <div className="text-left bg-gray-100 border rounded-lg p-3">
                            <p>{desc.description}</p>
                          </div>
                          <div
                            onClick={() => {
                              setAlert(true);
                              setId(desc.id);
                            }}
                            className="absolute top-4 right-2 p-1 rounded-full bg-gray-800 hover:bg-gray-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-[20px] h-[20px] flex items-center text-slate-50 mx-auto cursor-pointer"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </details>
                  </div>
                </div>

                <div className="flex items-center justify-start w-full mt-4">
                  <button
                    onClick={() => {
                      setModal(false);
                    }}
                    className="focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
                <button
                  onClick={() => {
                    setModal(false);
                  }}
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
        </div>
      )}
    </>
  );
}

export default Tempdescription;
