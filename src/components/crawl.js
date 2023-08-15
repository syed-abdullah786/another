import React, { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useHistory, BrowserRouter } from "react-router-dom";
import { toast, Slide } from "react-toastify";
import debounce from "lodash.debounce";
import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";
import Papa from "papaparse";
import myContext from "./appContext";

function Crawl() {
  const { setUniturl } = useContext(myContext);
  const { propurl } = useContext(myContext);
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const jobId = queryParams.get("url");
  const [pen, setpen] = useState([]);
  const [datas, setDatas] = useState([]);
  // const [title, setTitle] = useState(data.flattenedCheckedData);
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [spin, setSpin] = useState(false);
  const [detailspin, setDetailspin] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [loadingItem, setLoadingItem] = useState(false);
  const [shouldSendRequest, setShouldSendRequest] = useState(true);
  const [modal, setModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [total, setTotal] = useState(false);
  const scrapCheckboxRef = useRef(null);

  // const debouncedSetShouldSendRequest = debounce(() => {
  //   setShouldSendRequest(false);
  // }, 1000);

  useEffect(() => {
    axios
      .get(`http://3.88.224.113:90/job/${jobId}/`)
      .then((response) => {
        console.log("response.data.urls", response.data.urls);
        setpen(response.data.urls);
        axios
          .post("http://3.88.224.113:90/unit/", response.data.urls)
          .then((res) => {
            console.log("res.data", res.data);
            setDatas(res.data);
            setShow(false);
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
            console.log("ScrapedStatusCount", ScrapedStatusCount);
            console.log("pendingStatusCount", pendingStatusCount);
            const totalcount = pendingStatusCount + ScrapedStatusCount;
            console.log("totalcount", totalcount);
            setTotal(totalcount);
          });
      })
      .catch((e) => {
        notify22("No such Job id Present", "error");
        setSpin(false);
        history.push(`/`);
      });
  }, []);

  useEffect(() => {
    let abc = false;
    console.log("pen", pen);
    const api = (intervalId) => {
      if (pen.length > 0) {
        axios
          .post("http://3.88.224.113:90/unit/", pen)
          .then((res) => {
            console.log("res.data", res.data);
            setDatas(res.data);
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

              let a =
                ((pendingStatusCount + ScrapedStatusCount) / total) * 100;
              console.log("a", 100 - a);
              console.log("total", total);
              console.log("ScrapedStatusCount", ScrapedStatusCount);
              console.log("pendingStatusCount", pendingStatusCount);
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
              console.log("else");
              console.log("loading outer", abc);
              if (abc != false) {
                console.log("loading inner", loading);
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

  // useEffect(() => {
  //   let timerId;
  //   if (loadingItem) {
  //     const pendingStatusCount = datas?.reduce((count, item) => {
  //       return (
  //         count +
  //         (item.units?.filter((unit) => unit.status === "pending")
  //           ?.length || 0)
  //       );
  //     }, 0);
  //     const ScrapedStatusCount = datas?.reduce((count, item) => {
  //       return (
  //         count +
  //         (item.units?.filter((unit) => unit.status === "scraped")
  //           ?.length || 0)
  //       );
  //     }, 0);

  //     let a = (((pendingStatusCount*2)+ScrapedStatusCount)/ loadingItem) *100;
  //     console.log('a',100-a)
  //     console.log('loadingItem',loadingItem)
  //     console.log('pendingStatusCount',pendingStatusCount)
  //     if ((100 -a) >= 100) {
  //       setLoading(false);
  //     } else if ((100- a) < 5) {
  //       setLoading(5);
  //     } else {
  //       setLoading(100-a);
  //     }
  //   }

  //   const hasPendingStatusInUnits = datas?.some((item) =>
  //     item.units?.some((unit) => unit.status === "scraped" || unit.status === "pending")
  //   );

  //   // if (hasPendingStatusInUnits) {
  //   //   setShouldSendRequest(true);
  //   // }

  //   // if (datas.some((item) => item.status === "pending")) {
  //   //   setShouldSendRequest(true);
  //   // }
  //   // if (shouldSendRequest) {
  //   //   console.log('hello12 pen',pen)
  //   //   axios
  //   //     .post("http://3.88.224.113:90/unit/", pen)
  //   //     .then((response) => {
  //   //       console.log("response", response.data);
  //   //       setDatas(response.data);
  //   //       setShow(false);
  //   //       if (isFirstRender) {
  //   //         const pendingStatusCount = response.data?.reduce((count, item) => {
  //   //           return (
  //   //             count +
  //   //             (item.units?.filter((unit) => unit.status === "pending")
  //   //               ?.length || 0)
  //   //           );
  //   //         }, 0);
  //   //         const ScrapedStatusCount = response.data?.reduce((count, item) => {
  //   //           return (
  //   //             count +
  //   //             (item.units?.filter((unit) => unit.status === "scraped")
  //   //               ?.length || 0)
  //   //           );
  //   //         }, 0);
  //   //         const total= pendingStatusCount*2 + ScrapedStatusCount
  //   //         console.log('total',total)
  //   //         setLoadingItem(total);
  //   //         setIsFirstRender(false);
  //   //       }
  //   //       timerId = setTimeout(() => {
  //   //         debouncedSetShouldSendRequest();
  //   //       }, 2000);
  //   //     })
  //   //     .catch((e) => {
  //   //       notify22(e.message, "error");
  //   //       setSpin(false);
  //   //     });
  //   // }

  //   return () => {
  //     // Clear the timer when the component unmounts or the effect runs again
  //     clearTimeout(timerId);
  //   };
  // }, [shouldSendRequest,pen]);

  //   const crawl = (i, url) => {
  //     setSpin(i);
  //     axios
  //       .post("http://3.88.224.113:90/edit/", url)
  //       .then((response) => {
  //         history.push(`/edit?url=${url.split("//")[1]}`, response.data);
  //         setShow(false);
  //       })
  //       .catch((e) => {
  //         notify22(e.message, "error");
  //         setSpin(false);
  //       });
  //     // history.push(`/edit?url=${data}`)
  //   };

  const scrapAll = () => {
    if(scrapCheckboxRef.current.checked){
      const urlsArray = datas?.reduce((urls, item) => {
        const unitUrls = item.units?.map(unit => unit.url) || [];
        return [...urls, ...unitUrls];
      }, []);
      setCheckedItems(urlsArray);
    }
    else{
      setCheckedItems([]);
    }
  }

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

  const openmodal = () => {
    if (checkedItems.length == 0) {
      setSpin(false);
      notify22("No unit selected", "error");
    } else {
      setModal(true);
    }
  };

  const done = () => {
    if (username == "" || password == "") {
      console.log("empty");
      notify22("Please enter the login info", "error");
    } else {
      setSpin(true);
      if (checkedItems.length == 0) {
        setSpin(false);
        notify22("No unit selected", "error");
      } else {
        const items = {
          url: checkedItems,
          username: username,
          password: password,
        };
        console.log("items", items);
        axios
          .post("http://3.88.224.113:90/multiupdate/", items)
          .then((response) => {
            // history.push(`/edit`, response.data);
            console.log("data", response.data);
            notify22(response.data, "success");
            setSpin(false);
            setModal(false);
            setUsername("");
            setPassword("");
            setTotal(checkedItems.length);
            if (scrapCheckboxRef.current.checked) {
              scrapCheckboxRef.current.checked = !scrapCheckboxRef.current.checked;
            }
            // setLoadingItem(checkedItems.length);
            setCheckedItems([]);
            setShouldSendRequest(true);
          })
          .catch((e) => {
            notify22("Listing not updated", "error");
            setDetailspin(false);
            setSpin(false);
          });
      }
    }
  };

  const detail = (url) => {
    setDetailspin(url);
    axios
      .post("http://3.88.224.113:90/edit/", url)
      .then((response) => {
        console.log("data", response.data);
        setUniturl(response.data);
        history.push(`/edit?id=${response.data.id}`);
        setDetailspin(false);
      })
      .catch((e) => {
        notify22(e.message, "error");
        setDetailspin(false);
      });
  };

  const handleDownload = () => {
    const csv = arrayToCSV(datas);
    downloadCSV(csv, "data.csv");
  };

  const arrayToCSV = (array) => {
    let new_array = [];

    array.map((obj) => {
      console.log("obj.units", obj.units);
      obj.units.map((data) => {
        delete data.reality_user;
        delete data.property;
        delete data.status;

        new_array.push(data);
      });
    });

    console.log("new_array", new_array);
    // return Papa.unparse(csvArray);

    // const urls = data.map(item => [item.url]);
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

  // const next=()=>{
  //   if (checkedItems.length == 0) {
  //     setSpin(false);
  //     notify22("No unit selected", "error");
  //   } else {
  //     axios
  //       .post("http://3.88.224.113:90/multiupdate/", checkedItems)
  //       .then((response) => {
  //         // history.push(`/edit`, response.data);
  //         console.log("data", response.data);
  //         notify22(response.data, "success");
  //         setSpin(false);
  //         setModal(false)
  //         setUsername('')
  //         setPassword('')
  //         setLoadingItem(checkedItems.length)
  //         setCheckedItems([])
  //         setShouldSendRequest(true)
  //       })
  //       .catch((e) => {
  //         notify22("Listing not updated", "error");
  //         setDetailspin(false);
  //         setSpin(false);
  //       });
  //   }}

  const notify22 = (msg, type) =>
    toast(msg, {
      transition: Slide,
      autoClose: 3000,
      position: "top-right",
      type: type,
    });
  return (
    <>
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
              <div className="relative mb-2">
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
      )}

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
              </div>

              <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[1rem]">
                <div className="bg-white drop-shadow-md rounded-lg p-4 sm:p-6 xl:p-8 ">
                  <div className="inline-block items-center">
                    <div className="flex items-center justify-center">
                      <p className="text-xl sm:text-xl leading-none font-bold text-gray-900">
                        Total Units:
                      </p>
                      <p className="text-xl sm:text-xl leading-none font-bold text-gray-900">
                        {datas?.reduce((count, item) => {
                          return count + (item.units?.length || 0);
                        }, 0)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white drop-shadow-md rounded-lg p-4 sm:p-6 xl:p-8 ">
                  <div className="inline-block items-center">
                    <div className="flex items-center justify-center">
                      <p className="text-xl sm:text-xl leading-none font-bold text-gray-900">
                        Uploaded Units:
                      </p>
                      <p className="text-xl sm:text-xl leading-none font-bold text-gray-900">
                        {datas?.reduce((count, item) => {
                          return (
                            count +
                            (item.units?.filter(
                              (unit) => unit.status === "uploaded"
                            )?.length || 0)
                          );
                        }, 0)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white drop-shadow-md rounded-lg p-4 sm:p-6 xl:p-8 ">
                  <div className="inline-block items-center">
                    <div className="flex items-center justify-center">
                      <p className="text-xl sm:text-xl leading-none font-bold text-gray-900">
                        Uploading Error:
                      </p>
                      <p className="text-xl sm:text-xl leading-none font-bold text-gray-900">
                        {datas?.reduce((count, item) => {
                          return (
                            count +
                            (item.units?.filter(
                              (unit) => unit.status === "uploading error"
                            )?.length || 0)
                          );
                        }, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
              <label className="flex font-bold float-right flex items-center relative w-max cursor-pointer select-none">
                Scrap All&nbsp;&nbsp;
  <input type="checkbox" 
  onChange={() => scrapAll()}
  ref={scrapCheckboxRef}
  className="input appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 bg-red-500" />
  <span className="absolute font-medium text-xs uppercase right-1 text-white"> NO</span>
  <span className="absolute font-medium text-xs uppercase right-8 text-white"> YES </span>
  <span className="w-7 h-7 right-7 absolute rounded-full transform transition-transform bg-gray-200" />
</label>
              </div>

              <div className="grid divide-y divide-neutral-200 border rounded-lg px-4 mx-auto mt-8">
                {datas.map((innerArray, i) => (
                  <div key={i} className="py-3">
                    <details className="group">
                      <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                        <span className="capitalize">
                          {innerArray.url.split("/").pop().replace(/-/g, " ")}
                          {innerArray.status == "pending" && (
                            <button className="mx-4 py-1 cursor-default px-3 shadow-md no-underline rounded-full bg-orange-600 text-white font-sans font-semibold text-xs border-orange btn-primary">
                              Pending
                            </button>
                          )}
                        </span>

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

                      <table className="mt-3 min-w-max w-full table-auto border border-slate-300">
                        <thead>
                          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-2 text-left w-2/10">
                              Unit Title
                            </th>
                            <th className="py-3 px-2 text-left w-1/10">
                              Price
                            </th>
                            <th className="py-3 px-2 text-left w-1/10">
                              Baths
                            </th>
                            <th className="py-3 px-2 text-left w-1/10">Beds</th>
                            <th className="py-3 px-2 text-left w-1/10">
                              Scrap
                            </th>
                            <th className="py-3 px-2 text-left w-1/10">
                              Status
                            </th>
                            <th className="py-3 px-2 text-left w-2/10">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                          {innerArray.units.map((data, innerIndex) => (
                            <tr
                              key={innerIndex}
                              className="border-b border-gray-200 hover:bg-gray-100"
                            >
                              <td className="py-3 px-2 text-left whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="font-medium">
                                    {data.url}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-2 text-left whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="font-medium">
                                    {data.price}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-2 text-left whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="font-medium">
                                    {data.baths}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-2 text-left whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="font-medium">
                                    {data.beds}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-2 text-center">
                                <label className="flex items-center relative w-max cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={checkedItems.some(
                                      (item) => item === data.url
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(data.url)
                                    }
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
                              </td>
                              <td className="py-3 px-2 text-left whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="font-medium">
                                    {data.status == "pending" ? (
                                      <button className="mx-4 py-1 cursor-default px-3 shadow-md no-underline rounded-full bg-orange-600 text-white font-sans font-semibold text-xs border-orange btn-primary">
                                        {data.status}
                                      </button>
                                    ) : data.status == "scraped" ? (
                                      <button className="mx-4 py-1 cursor-default px-3 shadow-md no-underline rounded-full bg-green-600 text-white font-sans font-semibold text-xs border-orange btn-primary">
                                        {data.status}
                                      </button>
                                    ) : (
                                      <button className="mx-4 py-1 cursor-default px-3 shadow-md no-underline rounded-full bg-blue-600 text-white font-sans font-semibold text-xs border-orange btn-primary">
                                        {data.status}
                                      </button>
                                    )}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-2 text-left whitespace-nowrap">
                                <div className="flex items-center">
                                  <button
                                    onClick={() => detail(data.url)}
                                    disabled={detailspin != false}
                                    className="mb-8 float-right border border-blue-500 bg-blue-500 text-white rounded-md px-4 py-2 m-2 group relative overflow-hidden text-white hover:border-blue-400 hover:bg-blue-400"
                                  >
                                    {detailspin == data.url && (
                                      <div
                                        role="status"
                                        className="inline-block"
                                      >
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
                                        <span className="sr-only">
                                          Loading...
                                        </span>
                                      </div>
                                    )}
                                    Detail
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </details>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleDownload()}
                className="mb-8 float-left border border-green-500 bg-green-500 text-white rounded-md px-2 py-2 m-2 group relative overflow-hidden text-white"
              >
                Download csv
              </button>

              {/* <button
                onClick={() => next()}
                className="mb-8 float-right border border-green-500 bg-green-500 text-white rounded-md px-2 py-2 m-2 group relative overflow-hidden text-white"
              >
                Next
                <div className="absolute inset-0 h-full w-full scale-0 rounded-md transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
              </button> */}

              <button
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
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Crawl;
