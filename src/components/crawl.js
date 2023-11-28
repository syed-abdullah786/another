import React, { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useHistory, BrowserRouter } from "react-router-dom";
import { toast, Slide } from "react-toastify";
import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";
import myContext from "./appContext";
import DataTable from "react-data-table-component";
import Multiselect from "react-widgets/DropdownList";
import "react-widgets/styles.css";
import Convertible from "./crawl/convertible";
import Download from "./crawl/download";
import Filter from "./crawl/filter";
import Realitymxuser from "./crawl/realitymxuser";

function Crawl() {
  const { setUniturl } = useContext(myContext);
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const jobId = queryParams.get("url");
  const filterId = queryParams.get("filter");

  const [pen, setpen] = useState([]);
  const [datas, setDatas] = useState([]);
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [spin, setSpin] = useState(false);
  const [detailspin, setDetailspin] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [shouldSendRequest, setShouldSendRequest] = useState(true);
  const [modal, setModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [total, setTotal] = useState(false);
  const [pending, setPending] = useState(false);
  const [value, setValue] = useState("");
  const [users, setUsers] = useState("");
  const scrapCheckboxRef = useRef(null);
  const pass = useRef(null);

  const columns = [
    {
      name: "Property",
      selector: (row) =>
        row?.property_url?.split("/").pop().replace(/-/g, " ").toUpperCase(),
      sortable: true,
      width: "200px",
    },
    {
      name: "Unit",
      selector: (row) => row?.title,
    },
    {
      name: "Convertible",
      cell: (row) => (
        <select
          value={row.convertible}
          onChange={(e) => {
            changeConvertible(e.target.value, row.id);
          }}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      ),
    },
    {
      name: "Price",
      selector: (row) => Math.floor(row?.price?.toString()),
      sortable: true,
      width: "100px",
    },
    {
      name: "Baths",
      selector: (row) => row?.baths,
      width: "70px",
    },
    {
      name: "Beds",
      selector: (row) => row?.beds,
      width: "70px",
    },
    {
      name: "SCRAP",
      cell: (row) => (
        <label className="flex items-center relative w-max cursor-pointer select-none">
          <input
            type="checkbox"
            checked={checkedItems.some((item) => item === row.url)}
            onChange={() => handleCheckboxChange(row.url)}
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
      ),
      width: "100px",
    },
    {
      name: "Status",
      cell: (row) => (
        <span className="font-medium">
          {row.status == "pending" ? (
            <button className="py-1 cursor-default px-3 shadow-md no-underline rounded-full bg-orange-600 text-white font-sans font-semibold text-xs border-orange btn-primary">
              {row.status}
            </button>
          ) : row.status == "scraped" ? (
            <button className="py-1 cursor-default px-3 shadow-md no-underline rounded-full bg-green-600 text-white font-sans font-semibold text-xs border-orange btn-primary">
              {row.status}
            </button>
          ) : (
            <button className="py-1 cursor-default px-3 shadow-md no-underline rounded-full bg-blue-600 text-white font-sans font-semibold text-xs border-orange btn-primary">
              {row.status}
            </button>
          )}
        </span>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => detail(row.url)}
          disabled={detailspin != false}
          className="float-right border border-blue-500 bg-blue-500 text-white rounded-md px-4 py-2 group relative overflow-hidden text-white hover:border-blue-400 hover:bg-blue-400"
        >
          {detailspin == row.url && (
            <div role="status" className="inline-block">
              <svg
                aria-hidden="true"
                className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-green-600 fill-green-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
          Detail
        </button>
      ),
    },
  ];
  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
    selectAllRowsItem: true,
    selectAllRowsItemText: "All",
  };

  useEffect(() => {
    axios
      .get(`http://18.191.139.138:90/job/${jobId}/`)
      .then((response) => {
        setpen(response.data.urls);
        axios
          .post("http://18.191.139.138:90/unit/", response.data.urls)
          .then((res) => {
            setPending(res.data);
            if (filterId) {
              const Prop = res.data
                .map((outer) => {
                  const filteredUnits = outer.units.filter(
                    (unit) => unit.status === filterId
                  );
                  return { ...outer, units: filteredUnits };
                })
                .filter((outer) => outer.units.length > 0);
              const unitsWithUrl = Prop.flatMap((item) =>
                item.units.map((unit) => ({
                  ...unit, // Copy all existing properties from the unit object
                  property_url: item.url, // Add the 'url' field to each unit
                }))
              );
              setDatas(unitsWithUrl);
              setShow(false);
            } else {
              const unitsWithUrl = res.data.flatMap((item) =>
                item.units.map((unit) => ({
                  ...unit, // Copy all existing properties from the unit object
                  property_url: item.url, // Add the 'url' field to each unit
                }))
              );
              setDatas(unitsWithUrl);
              setShow(false);
            }
            setIsFirstRender(false);
            const pendingStatusCount = res.data?.reduce((count, item) => {
              return (
                count +
                (item.units?.filter((unit) => unit.status === "pending")
                  ?.length || 0)
              );
            }, 0);
            const ScrapedStatusCount = res.data?.reduce((count, item) => {
              return (
                count +
                (item.units?.filter((unit) => unit.status === "scraped")
                  ?.length || 0)
              );
            }, 0);
            const totalcount = pendingStatusCount + ScrapedStatusCount;
            setTotal(totalcount);
          });
      })
      .catch((e) => {
        notify22("No such Job id Present", "error");
        setSpin(false);
        history.push(`/`);
      });
  }, [history.location.search]);

  useEffect(() => {
    let abc = false;
    const api = (intervalId) => {
      if (pen.length > 0) {
        axios
          .post("http://18.191.139.138:90/unit/", pen)
          .then((res) => {
            setPending(res.data);
            if (filterId) {
              const Prop = res.data
                .map((outer) => {
                  const filteredUnits = outer.units.filter(
                    (unit) => unit.status === filterId
                  );
                  return { ...outer, units: filteredUnits };
                })
                .filter((outer) => outer.units.length > 0);
              const unitsWithUrl = Prop.flatMap((item) =>
                item.units.map((unit) => ({
                  ...unit, // Copy all existing properties from the unit object
                  property_url: item.url, // Add the 'url' field to each unit
                }))
              );
              setDatas(unitsWithUrl);
            } else {
              const unitsWithUrl = res.data.flatMap((item) =>
                item.units.map((unit) => ({
                  ...unit, // Copy all existing properties from the unit object
                  property_url: item.url, // Add the 'url' field to each unit
                }))
              );
              setDatas(unitsWithUrl);
            }
            setShow(false);
            setIsFirstRender(false);

            if (res.data.some((item) => item.status === "pending")) {
            } else if (
              res.data.some((item) =>
                item.units?.some(
                  (unit) =>
                    unit.status === "scraped" || unit.status === "pending"
                )
              )
            ) {
              const pendingStatusCount = res.data?.reduce((count, item) => {
                return (
                  count +
                  (item.units?.filter((unit) => unit.status === "pending")
                    ?.length || 0)
                );
              }, 0);
              const ScrapedStatusCount = res.data?.reduce((count, item) => {
                return (
                  count +
                  (item.units?.filter((unit) => unit.status === "scraped")
                    ?.length || 0)
                );
              }, 0);

              let a = ((pendingStatusCount + ScrapedStatusCount) / total) * 100;
              if (100 - a >= 100) {
                // setLoading(false);
              } else if (100 - a < 5) {
                abc = 5;
                setLoading(5);
              } else {
                abc = 100 - a;
                setLoading(100 - a);
              }
            } else {
              clearInterval(intervalId);
              if (abc != false) {
                setLoading(100);
                setTimeout(() => {
                  setLoading("");
                }, 2000);
              }
            }
          })
          .catch((e) => {
            notify22(e.message, "error");
            setSpin(false);
          });
      }
    };

    const intervalId = setInterval(() => {
      api(intervalId);
    }, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, [pen, total]);

  const scrapAll = () => {
    if (scrapCheckboxRef.current.checked) {
      const urlsArray = datas?.map((urls, item) => {
        return urls.url;
      }, []);
      setCheckedItems(urlsArray);
    } else {
      setCheckedItems([]);
    }
  };

  // const scrapAll = () => {
  //   if (scrapCheckboxRef.current.checked) {
  //     const urlsArray = datas?.reduce((urls, item) => {
  //       const unitUrls = item.units?.map((unit) => unit.url) || [];
  //       return [...urls, ...unitUrls];
  //     }, []);
  //     setCheckedItems(urlsArray);
  //   } else {
  //     setCheckedItems([]);
  //   }
  // };

  const handleCheckboxChange = (url) => {
    const isUrlChecked = checkedItems.includes(url);

    if (isUrlChecked) {
      // If the URL is already in the array, remove it
      const updatedItems = checkedItems.filter((item) => item !== url);
      setCheckedItems(updatedItems);
    } else {
      // If the URL is not in the array, add it
      setCheckedItems([...checkedItems, url]);
    }
  };

  // const done = () => {
  //   if (username == "" || password == "") {
  //     notify22("Please enter the login info", "error");
  //   } else {
  //     setSpin(true);
  //     if (checkedItems.length == 0) {
  //       setSpin(false);
  //       notify22("No unit selected", "error");
  //     } else {
  //       const items = {
  //         url: checkedItems,
  //         username: username,
  //         password: password,
  //       };
  //       axios
  //         .post("http://18.191.139.138:90/multiupdate/", items)
  //         .then((response) => {
  //           // history.push(`/edit`, response.data);
  //           notify22(response.data, "success");
  //           setSpin(false);
  //           setModal(false);
  //           setUsername("");
  //           setPassword("");
  //           setTotal(checkedItems.length);
  //           if (scrapCheckboxRef.current.checked) {
  //             scrapCheckboxRef.current.checked =
  //               !scrapCheckboxRef.current.checked;
  //           }
  //           // setLoadingItem(checkedItems.length);
  //           setCheckedItems([]);
  //           setShouldSendRequest(true);
  //         })
  //         .catch((e) => {
  //           notify22("Listing not updated", "error");
  //           setDetailspin(false);
  //           setSpin(false);
  //         });
  //     }
  //   }
  // };

  const detail = (url) => {
    setDetailspin(url);
    axios
      .post("http://18.191.139.138:90/edit/", url)
      .then((response) => {
        setUniturl(response.data);
        history.push(`/edit?id=${response.data.id}`);
        setDetailspin(false);
      })
      .catch((e) => {
        notify22(e.message, "error");
        setDetailspin(false);
      });
  };

  const changeConvertible = (conv, id) => {
    const value = {
      convertible: conv,
    };
    axios
      .patch(`http://18.191.139.138:90/convertible/${id}/`, value)
      .then((response) => {
        setDatas(
          datas.map((item) => {
            if (item.id === response.data.id) {
              return { ...item, convertible: response.data.convertible };
            } else {
              return item;
            }
          })
        );
      })
      .catch((e) => {
        notify22(e.message, "error");
      });
  };

  // const openmodal = () => {
  //   if (checkedItems.length == 0) {
  //     setSpin(false);
  //     notify22("No unit selected", "error");
  //   } else {
  //     axios
  //       .get("http://18.191.139.138:90/get_users/")
  //       .then((response) => {
  //         console.log(response.data);
  //         setUsers(response.data);
  //         setModal(true);
  //       })
  //       .catch((e) => {
  //         notify22("Not Updated", "error");
  //       });
  //   }
  // };

  // const existingOptions = ["Option 1", "Option 2", "Option 3"];

  // const handleCreate = (newItem) => {
  //   existingOptions.push(newItem);
  //   setValue(newItem);
  // };
  // const handleuserchange = (newValue) => {
  //   setValue(newValue);
  //   setUsername(newValue);
  //   const foundUser = users.find((user) => user.username === newValue);
  //   setPassword(foundUser.password);
  //   pass.current.disabled = true;
  // };
  // const handlenewuser = (newItem) => {
  //   setPassword("");
  //   pass.current.disabled = false;
  //   setUsername(newItem);
  //   setValue(newItem);
  // };

  const notify22 = (msg, type) =>
    toast(msg, {
      transition: Slide,
      autoClose: 3000,
      position: "top-right",
      type: type,
    });
  return (
    <>
      {/* {modal && (
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
              <Multiselect
                className="text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center text-sm border-gray-300 rounded border"
                data={users}
                dataKey="id"
                textField="username"
                defaultValue={[1]}
                onChange={(newValue) => {
                  handleuserchange(newValue);
                }}
                allowCreate
                onCreate={(newItem) => {
                  handlenewuser(newItem);
                }}
              />

              <p className="text-left text-gray-800 text-sm font-bold leading-tight tracking-normal">
                Password
              </p>
              <div className="relative mb-5 mt-2">
                <input
                  ref={pass}
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
                  onClick={() => done()}
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                >
                  Submit
                </button>
                <button
                  onClick={() => setModal(!modal)}
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
              <button
                onClick={() => setModal(!modal)}
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
      )} */}

      {loading && (
        <div className="fixed z-10 w-full">
          <ProgressBar
            animated
            now={loading}
            label={`${loading.toFixed(2)}%`}
          />
        </div>
      )}
      {show ? (
        <div className="flex items-center justify-center h-screen">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-12 h-12 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <section className="antialiased text-gray-600 h-screen px-2">
          <div className="">
            <div className="max-w-screen-xl mx-auto px-5 bg-white min-h-screen">
              <div className="flex flex-col items-center">
                <h2 className="font-bold text-2xl mt-5 tracking-tight">
                  Crawled Properties
                </h2>
                <p className="font-bold">
                  Your Job Id:{" "}
                  <button className="py-1 cursor-default px-3 shadow-md no-underline rounded-full bg-blue-600 text-white font-sans font-semibold text-xs border-orange btn-primary">
                    {jobId}
                  </button>
                </p>
                {pending.some((item) => item.status === "pending") && (
                  <button className="py-1 cursor-default px-3 shadow-md no-underline rounded-full bg-red-600 text-white font-sans font-semibold text-xs border-orange btn-primary">
                    Scrapers are running
                  </button>
                )}
                {filterId && (
                  <p className="font-bold">
                    Filter:{" "}
                    <button className="py-1 cursor-default px-3 shadow-md no-underline rounded-full bg-blue-600 text-white font-sans font-semibold text-xs border-orange btn-primary">
                      {filterId}
                    </button>
                  </p>
                )}
              </div>
              <Filter datas={datas} setShow={setShow} jobId={jobId} />

              <div className="p-4">
                <Convertible datas={datas} setDatas={setDatas} />

                <label className="flex font-bold float-right flex items-center relative w-max cursor-pointer select-none">
                  Scrap All&nbsp;&nbsp;
                  <input
                    type="checkbox"
                    onChange={() => scrapAll()}
                    ref={scrapCheckboxRef}
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
              </div>

              <DataTable
                title="Unit data"
                columns={columns}
                data={datas || []}
                pagination
                highlightOnHover
                fixedHeader
                paginationComponentOptions={paginationOptions}
              />
              <Download datas={datas} />



                <Realitymxuser  checkedItems={checkedItems} setCheckedItems={setCheckedItems} setShouldSendRequest={setShouldSendRequest} scrapCheckboxRef={scrapCheckboxRef} setTotal={setTotal}/>
              {/* <button
                onClick={() => openmodal()}
                disabled={spin != false}
                className="mb-8 float-right border border-green-500 bg-green-500 text-white rounded-md px-2 py-2 m-2 group relative overflow-hidden text-white"
              >
                {spin && (
                  <div role="status" className="inline-block">
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-green-600 fill-green-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
                Done
                <div className="absolute inset-0 h-full w-full scale-0 rounded-md transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
              </button> */}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Crawl;
