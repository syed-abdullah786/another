import React, {useRef, useState } from "react";
import axios from "axios";
import { toast, Slide } from "react-toastify";
import {Multiselect} from "react-widgets";
import SweetAlert from "react-bootstrap-sweetalert";

function Realitymxuser({checkedItems,setCheckedItems,setShouldSendRequest,scrapCheckboxRef,setTotal}) {
    const [users, setUsers] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [modal, setModal] = useState(false);
    const [alert, setAlert] = useState(false);
    const [mxmodal, setMxmodal] = useState(false);
    const [deluser, setDeluser] = useState(false);
    const [selectedvalues, setSelectedvalues] = useState([]);
    const pass = useRef(null);

      const Addnewuser = () => {
        if (username == "" || password == "") {
          notify22("Please enter the login info", "error");
        } else {
          if (checkedItems.length == 0) {
            notify22("No unit selected", "error");
          } else {
            const user = {
              username: username,
              password: password,
            };
            axios
              .post("http://18.191.139.138:90/add_user/", user)
              .then((response) => {
                if (typeof response.data === "string") {
                    notify22(response.data, "error");
                  } else {
                    setUsers([...users,response.data])                  
                notify22('User Created', "success");
                setModal(false);
                setUsername("");
                setPassword("");}
              })
              .catch((e) => {
                notify22("Listing not updated", "error");
              });
          }
        }
      };

    const openmodal = () => {
        if (checkedItems.length == 0) {
          notify22("No unit selected", "error");
        } else {
          axios
            .get("http://18.191.139.138:90/get_users/")
            .then((response) => {
              setUsers(response.data);
              setMxmodal(true);
            })
            .catch((e) => {
              notify22("Not Updated", "error");
            });
        }
      };

      const handleChange = (val) => {
         setSelectedvalues(val);
      };

      const Adduser=()=>{
        if(selectedvalues.length == 0){
            notify22("Please select any user", "error");
        }
        else{
            const ids = selectedvalues.map(item => item.id);
            const value = {
                reality_user: ids,
                url: checkedItems,
              };
              axios.post("http://18.191.139.138:90/multiupdate/", value)
                .then((response) => {
                    setMxmodal(false);
                    notify22(response.data, "success");
                    setTotal(checkedItems.length);
                    if (scrapCheckboxRef.current.checked) {
                                    scrapCheckboxRef.current.checked =
                                      !scrapCheckboxRef.current.checked;
                                  }
                    setCheckedItems([])
                    setShouldSendRequest(true);
                    setSelectedvalues([])
                })
                .catch((e) => {
                  notify22(e.message, "error");
                });
        }
      }

      const delrealityuser=()=>{
        axios
            .delete(`http://18.191.139.138:90/del_user/${deluser}/`)
            .then((response) => {
              setUsers(users.filter(user => user.id != deluser))
                notify22("User Deleted", "success");
                setDeluser(false);
                setAlert(false);
                setSelectedvalues(selectedvalues.filter(user => user.id != deluser))
            })
            .catch((e) => {
              notify22("Not Deleted", "error");
            });
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
    <SweetAlert
            show={alert}
            danger
            title="Woot!"
            showCancel
            confirmBtnText="Yes, delete it!"
            cancelBtnText="No!"
            onConfirm={delrealityuser}
            onCancel={() => {
              setAlert(false);
              setDeluser(false);
            }}
          >
            {" "}
            Do you want to delete it!
          </SweetAlert>

     <button
                onClick={() => openmodal()}
                className="mb-8 float-right border border-green-500 bg-green-500 text-white rounded-md px-2 py-2 m-2 group relative overflow-hidden text-white"
              >
                Done
                <div className="absolute inset-0 h-full w-full scale-0 rounded-md transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
              </button>

              {mxmodal && (
        <div className="py-12 bg-gray-700 bg-opacity-30 transition duration-150 ease-in-out z-10 fixed top-0 right-0 bottom-0 left-0">
          <div
            role="alert"
            className="container mx-auto w-11/12 md:w-2/3 max-w-lg"
          >
            <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
              <h1 className="text-gray-800 font-lg font-bold tracking-normal leading-tight mb-4">
                Slect User
              </h1>
              <p className="text-left float-left text-gray-800 text-sm mb-0 mt-4 font-bold leading-tight tracking-normal">
                Select Users
              </p>
              <button 
              onClick={() => setModal(true)}
              className="mb-8 float-right border border-green-500 bg-green-500 text-white rounded-md px-2 py-2 m-2 group relative overflow-hidden text-white">
                Add User
              </button>
              <Multiselect
              value={selectedvalues}
                className="text-gray-600 mb-4 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center text-sm border-gray-300 rounded border"
                data={users}
                textField="username"
                onChange={(val)=>handleChange(val)}
                renderListItem={({ item }) => (
                  <div className="relative">
                    <strong>{item.username}</strong>
                    <div className="absolute top-0 right-2 p-1 rounded-full bg-gray-800 hover:bg-gray-600">
                                  <svg
                                    onClick={() => {
                                      setAlert(true);
                                      setDeluser(item.id)
                                    }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-[16px] h-[16px] flex items-center text-slate-50 mx-auto cursor-pointer"
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
                )}
              />

              <div className="flex items-center justify-start w-full">
                <button
                  onClick={() => Adduser()}
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                >
                  Submit
                </button>
                <button
                  onClick={() => {setMxmodal(false);setSelectedvalues([])}}
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
              <button
                onClick={() => {setMxmodal(false);setSelectedvalues([])}}
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
      )}




              {modal && (
        <div className="py-12 bg-gray-700 bg-opacity-30 transition duration-150 ease-in-out z-10 fixed top-0 right-0 bottom-0 left-0">
          <div
            role="alert"
            className="container mx-auto w-11/12 md:w-2/3 max-w-lg"
          >
            <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
              <h1 className="text-gray-800 font-lg font-bold tracking-normal leading-tight mb-4">
                Add RealityMX credentials
              </h1>
              <p className="text-left text-gray-800 text-sm font-bold leading-tight tracking-normal">
                Username
              </p>
              <div className="relative mb-2 mt-2">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  className="text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-4 text-sm border-gray-300 rounded border"
                  required
                  placeholder="Username"
                />
              </div>
              <p className="text-left text-gray-800 text-sm font-bold leading-tight tracking-normal">
                Password
              </p>
              <div className="relative mb-5 mt-2">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-4 text-sm border-gray-300 rounded border"
                  required
                  placeholder="Password"
                />
              </div>
              <div className="flex items-center justify-start w-full">
                <button
                  onClick={() => Addnewuser()}
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                >
                  Submit
                </button>
                <button
                  onClick={() => setModal(false)}
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
              <button
                onClick={() => setModal(false)}
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
      )}
    </>
  )
}

export default Realitymxuser