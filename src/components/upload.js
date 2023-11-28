import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import Papa from "papaparse";
import { useHistory, Link  } from "react-router-dom";
import { toast, Slide } from "react-toastify";
import "../App.css";
import { useDropzone } from "react-dropzone";
import Dropzone from "react-dropzone";
import { neighbour } from "./neighbour";
import SweetAlert from "react-bootstrap-sweetalert";
import DataTable from "react-data-table-component";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Tempdescription from "./upload/tempdescription";
import SearchJobImg from "./upload/searchJob";
import Addproperty from "./upload/Addproperty";
import Scrapall from "./upload/Scrapall";


function Upload() {
  const history = useHistory();
  const [show, setShow] = useState(true);
  const fileRef = useRef(null);
  const [spin, setSpin] = useState(false);
  const [neighbourmodal, setNeighbourmodal] = useState(false);
  const [neighbourname, setNeighbourname] = useState("");
  const [popup, setPopup] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertproperty, setAlertproperty] = useState(false);
  const [delalertproperty, setDelalertproperty] = useState(false);
  const [imgdel, setImgdel] = useState(false);
  const [imgModel, setImgModel] = useState(false);
  const [imgModelsrc, setImgModelsrc] = useState(false);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [description, setDescription] = useState([]);
  const [templatedescription, setTemplatedescription] = useState([]);
  const [newtemplatedescription, setNewtemplatedescription] = useState("");
  const [checkedItems, setCheckedItems] = useState([]);
  const [popid, setPopid] = useState(false);
  const [images, setImages] = useState({});
  const [streetimg, setStreetimg] = useState([]);
  const [tab, setTab] = useState(neighbour);
  const [activeTab, setActiveTab] = useState(0);
  const [amenities, setAmenities] = useState([]);
  const [checkedTab, setCheckedTab] = useState({
    Manhattan: [],
    Brooklyn: [],
    Queens: [],
    Bronx: [],
    Staten_Island: [],
    Others: [],
  });

  const generateDummyData = (count) => {
    return Array.from({ length: count }, (_, index) => ({
      id: `item-${index}`,
      content: `item ${index}`,
    }));
  };
  const [items, setItems] = useState(generateDummyData(6));

  const grid = 8;

  const getItemStyle = (isDragging, draggableStyle) => ({
    // Some basic styles to make the items look a bit nicer
    userSelect: "none",
    margin: `2px`,

    // Styles we need to apply on draggables
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver) => ({
    display: "-webkit-inline-box",
    padding: grid,
    overflow: "auto",
  });
  // A little function to help with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  const onDragEnd = (result, name, type) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }
    const updatedItems = reorder(
      images[name][type],
      result.source.index,
      result.destination.index
    );

    setImages({
      ...images,
      [name]: {
        ...images[name],
        [type]: updatedItems,
      },
    });
    axios
      .post("http://18.191.139.138:90/update_image/", {
        update: updatedItems,
        property: popid,
        name: name,
        type: type,
      })
      .then((response) => {
        notify22("Updated", "success");
      })
      .catch((e) => {
        notify22("Not Updated", "error");
      });
  };

  const columns = [
    {
      name: "PROPERTY URL",
      selector: (row) => row?.url,
      width: "300px",
    },
    {
      name: "SCRAP",
      cell: (row) => (
        <label className="flex items-center relative w-max cursor-pointer select-none">
          <input
            type="checkbox"
            checked={checkedItems.map((data) => data.url).includes(row.url)}
            onChange={() => handleCheckboxChange(row)}
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
       width: "90px",
    },
    {
      name: "STATUS",
      cell: (row) => row.status,
      width: "90px",
    },
    {
      name: "OPT",
      cell: (row) => (
        <div className="transform hover:text-purple-500">
          <button
            onClick={() => {
              getDetails(row);
            }}
            className="group relative p-2 w-16 overflow-hidden rounded-2xl bg-blue-500 text-xs font-bold text-white"
          >
            Details
            <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
          </button>
        </div>
      ),
      width: "90px",
    },
    {
      name: "Images",
      selector: (row) => <p>{getTotalArrayElements(row?.images)}</p>,
      width: "90px",
    },
     {
      name: "Description",
      selector: (row) => (<select
        value={row.use_desc}
        onChange={(e) => {
          usedesc(
            e.target.value,
            row.id
          );
        }}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="streeteasy">streeteasy</option>
        <option value="template">template</option>
        <option value="costume">costume</option>
      </select>),
    },
    {
      name: "Upload Images",
      cell: (row) => (
        <label className="flex items-center relative w-max cursor-pointer select-none">
          <input
            type="checkbox"
            checked={row.upload_img}
            onChange={() => uploadImg(!row.upload_img, row.id)}
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
      width: "120px",
    },
    {
      name: "ACTIONS",
      cell: (row) => (
        <div className="transform hover:text-purple-500">
          <button
            onClick={() => {setAlertproperty(true);setDelalertproperty(row)}}
            className="group relative p-2 w-16 overflow-hidden rounded-2xl bg-red-500 text-xs font-bold text-white"
          >
            Delete
            <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
          </button>
        </div>
      ),
      width: "90px",
    },
  ];
  const paginationOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
    selectAllRowsItem: true,
    selectAllRowsItemText: "All",
  };

  useEffect(() => {
    const url =
      "http://18.191.139.138:90/external_images/" +
      "1 Dutch Street #4F".replace(/#/g, "") +
      "/1.jpg";
    axios
      .get("http://18.191.139.138:90/get_prop/")
      .then((response) => {
        setData(response.data);
        setData2(response.data);
        setShow(false);
      })
      .catch((e) => {
        notify22(e.message, "error");
      })
  }, []);


  const usedesc=(value,id)=>{
    const data = { use_desc: value};
    axios
      .patch(`http://18.191.139.138:90/neighbour/${id}/`, data)
      .then((response) => {
        setData((prevData) =>
          prevData.map((obj) =>
            obj.id === response.data.id ? { ...obj, ...response.data } : obj
          )
        );
        notify22("Data Updated", "success");
      })
      .catch((e) => {
        notify22(e.message, "error");
      });
  }



  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });
  const upload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target.result;
        const { data: parsedData } = Papa.parse(csvData, {
          header: false,
          skipEmptyLines: true,
        });

        // Convert the array of arrays to an array of objects
        const formattedData = parsedData.map((urlArr) => {
          return { url: urlArr[0], status: "pending" };
        });
        setCheckedItems((prevData) => [...prevData, ...formattedData]);
        setData((prevData) => [...formattedData, ...prevData]);
      };
      reader.readAsText(file);
      fileRef.current.value = "";
      notify22("File Added", "success");
    }
  };

  const del = () => {
    if (delalertproperty.id) {
      axios
        .delete(`http://18.191.139.138:90/get_prop/${delalertproperty.id}/`)
        .then((response) => {
          const updatedArray = data.filter((item) => item.url !== delalertproperty.url);
          setData(updatedArray);
          const updatedItems = checkedItems.filter((item) => item.url !== delalertproperty.url);
          setCheckedItems(updatedItems);
          // const updatedItems = [...data];
          // updatedItems.splice(i, 1);
          // setData(updatedItems);
          notify22("Url Deleted", "success");
          setAlertproperty(false);
          setDelalertproperty(false);
        })
        .catch((e) => {
          notify22(e.message, "error");
        });
    }


  };

  const handleCheckboxChange = (obj) => {
    // if(obj.url)
    const isUrlMatched = checkedItems.some((item) => item.url === obj.url);
    if (isUrlMatched) {
      // URL is matched
      const updatedArray = checkedItems.filter((item) => item.url !== obj.url);
      if (obj.status == "pending") {
        const updatedArray = data.map((item) => {
          if (item.url === obj.url) {
            return { ...item, status: "new" };
          }
          return item;
        });
        setData(updatedArray);
      }
      setCheckedItems(updatedArray);
    } else {
      // URL is not matched
      if (obj.status == "new") {
        const updatedArray = data.map((item) => {
          if (item.url === obj.url) {
            return { ...item, status: "pending" };
          }
          return item;
        });
        setData(updatedArray);
      }
      setCheckedItems([...checkedItems, obj]);
    }
  };

  const next = () => {
    setSpin(true);
    // const hasPendingItems = data.some((item) => item.status === 'pending');
    // const checkedData = data.filter((_, index) => checkedItems[index]);
    // const flattenedCheckedData = checkedData.flat();
    if (checkedItems.length == 0) {
      setSpin(false);
      notify22("Select property to scrap", "error");
    } else {
      axios
        .post("http://18.191.139.138:90/crawl/", checkedItems)
        .then((response) => {
          const hell = checkedItems?.map((item) => item.url);

          axios
            .post("http://18.191.139.138:90/jobs/", hell)
            .then((response) => {
              // setPropurl(checkedItems)
              history.push(`/crawl?url=${response.data.id}`);
            });

          setSpin(false);
        })
        .catch((e) => {
          notify22(e.message, "error");
          setSpin(false);
        });
    }
  };

  const schedule = () => {
    setSpin(true);
    if (checkedItems.length == 0) {
      setSpin(false);
      notify22("Select property to scrap", "error");
    } else {
      console.log('checkedItems',checkedItems)
      // axios
      //   .post("http://18.191.139.138:90/crawl/", data)
      //   .then((response) => {
      //     const hell = checkedItems?.map((item) => item.url);

      //     axios
      //       .post("http://18.191.139.138:90/jobs/", hell)
      //       .then((response) => {
      //         // setPropurl(checkedItems)
      //         history.push(`/crawl?url=${response.data.id}`);
      //       });

      //     setSpin(false);
      //   })
      //   .catch((e) => {
      //     notify22(e.message, "error");
      //     setSpin(false);
      //   });
      history.push(`/schedule`);
    }
  };

  const handleDownload = () => {
    const csv = arrayToCSV(data);
    downloadCSV(csv, "data.csv");
  };

  const arrayToCSV = (array) => {
    // const urls = data.map(item => [item.url]);
    const csv = Papa.unparse(array);
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

  const handleAmenities = (event) => {
    const value = event.target.value;
    if (event.target.checked) {
      // If checkbox is checked, add the value to the state
      setAmenities((prevCheckedItems) => [...prevCheckedItems, value]);
    } else {
      // If checkbox is unchecked, remove the value from the state
      setAmenities((prevCheckedItems) =>
        prevCheckedItems.filter((item) => item !== value)
      );
    }
  };

  const onDrop = (files, status, type) => {
    files.map((fill) => {
      const formData = new FormData();
      formData.append("image", fill);
      formData.append("status", status);
      formData.append("property", popid);
      formData.append("type", type);
      axios
        .post("http://18.191.139.138:90/upload_image/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          setImages(response.data.images);
          const updatedData = data.map(item => {
            if (item.id === response.data.id) {
              return { ...item, ...response.data };
            }
            return item;
          });
          setData(updatedData)

          notify22("Image Updated", "success");
        })
        .catch((e) => {
          notify22(e.message, "error");
        });
    });
  };

  const handletabChecked = (event, label) => {
    const value = event.target.value;
    let lengths = false;

    Object.keys(checkedTab).forEach((key) => {
      if (key != label && checkedTab[key].length > 0) {
        lengths = true;
      }
      if (key === label && checkedTab[key].length >= 1) {
        lengths = true;
      }
    });
    if (lengths) {
      notify22("Please select one neighbour", "error");
      return;
    }
    if (event.target.checked) {
      setCheckedTab((prevCheckedTab) => ({
        ...prevCheckedTab,
        [label]: [...prevCheckedTab[label], value],
      }));
    } else {
      setCheckedTab((prevCheckedTab) => ({
        ...prevCheckedTab,
        [label]: prevCheckedTab[label]?.filter((item) => item !== value),
      }));
    }
  };

  const getDetails = (data) => {
    setPopup(true);
    setTab((prevTab) => {
      const updatedTab = prevTab.map((section) => {
        if (section.label === "Others") {
          return { ...section, content: data.neighbour.Others };
        }
        return section;
      });
      return updatedTab;
    });
    setCheckedTab(data.neighbour);
    setPopid(data.id);
    setImages(data.images);
    let desc = []
    if(data.description.length > 0){
      desc = data.description
    }
    else{
      desc = ['']
    }
    setDescription(desc);

    setAmenities(
      Object.keys(data.images).filter((key) => {
        return (
          !["livingroom", "bedroom", "bathroom", "kitchen"].includes(key) &&
          (data.images[key]?.furnished?.length > 0 ||
            data.images[key]?.unfurnished?.length > 0)
        );
      })
    );

    axios
      .get(`http://18.191.139.138:90/getstreet_img/?property_id=${data.id}`)
      .then((response) => {
        setStreetimg(response.data);
      })
      .catch((error) => {
        notify22(error.message, "error");
      });
  };

  const submitDetail = () => {
    let desc = description
    let length = desc.length
    if(desc[length-1] === ''){
      desc.pop();
    }
    const value = { neighbour: checkedTab, description : desc };
    axios
      .patch(`http://18.191.139.138:90/neighbour/${popid}/`, value)
      .then((response) => {
        setData((prevData) =>
          prevData.map((obj) =>
            obj.id === response.data.id ? { ...obj, ...response.data } : obj
          )
        );
        notify22("Data Updated", "success");
      })
      .catch((e) => {
        notify22(e.message, "error");
      });
    setPopid(false);
    setPopup(!popup);
    setImages({});
    setAmenities([]);
  };

  const submittemplateDetail = () => {
    let desc = description
    let length = desc.length
    if(desc[length-1] === ''){
      desc.pop();
    }
    const value = { neighbour: checkedTab, description : desc };
    axios
      .patch(`http://18.191.139.138:90/neighbour/${popid}/`, value)
      .then((response) => {
        setData((prevData) =>
          prevData.map((obj) =>
            obj.id === response.data.id ? { ...obj, ...response.data } : obj
          )
        );
        notify22("Data Updated", "success");
      })
      .catch((e) => {
        notify22(e.message, "error");
      });
    setPopid(false);
    setPopup(!popup);
    setImages({});
    setAmenities([]);
  };

  const delimg = () => {
    axios
      .post("http://18.191.139.138:90/del_image/", imgdel)
      .then((response) => {
        setImages(response.data.images);
        setAlert(false);
        setImgdel(false);
        notify22("Image deleted", "success");
      })
      .catch((e) => {
        setAlert(false);
        setImgdel(false);
        notify22(e.message, "error");
      });
  };

  const settab = () => {
    setTab((prevTab) => {
      const updatedTab = [...prevTab];
      const othersSectionIndex = updatedTab.findIndex(
        (section) => section.label === "Others"
      );
      if (othersSectionIndex !== -1) {
        updatedTab[othersSectionIndex].content.push(neighbourname);
      }
      return updatedTab;
    });
    setNeighbourmodal(!neighbourmodal);
    setNeighbourname("");
  };
  const getTotalArrayElements = (data) => {
    let totalElements = 0;

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key];

        if (Array.isArray(value)) {
          totalElements += value.length;
        } else if (typeof value === "object") {
          totalElements += getTotalArrayElements(value); // Recursively calculate for nested objects
        }
      }
    }
    return totalElements;
  };
  const uploadImg = (imgdata, id) => {
    const value = { upload_img: imgdata };
    axios
      .patch(`http://18.191.139.138:90/neighbour/${id}/`, value)
      .then((response) => {
        setData((prevData) =>
          prevData.map((obj) =>
            obj.id === response.data.id ? { ...obj, ...response.data } : obj
          )
        );
        notify22("Data Updated", "success");
      })
      .catch((e) => {
        notify22(e.message, "error");
      });
  };

  const handledesc = (e,index)=>{
    const updatedDescription = [...description]; // Create a copy of the description array
    updatedDescription[index] = e.target.value; // Update the value at the specified index
    setDescription(updatedDescription); 
  }

  const handletemplatedesc = ()=>{
    if (newtemplatedescription == ""){
      notify22('Please enter some data', "error");
    }
    else{
    const data={description:newtemplatedescription}
    axios
    .post("http://18.191.139.138:90/template_desc/",data )
    .then((res) => {
      setTemplatedescription([res.data,...templatedescription])
      setNewtemplatedescription('')
      notify22('Description Added', "success");
    }).catch((e) => {
      notify22(e.message, "error");
    });
  }}

  const notify22 = (msg, type) =>
    toast(msg, {
      transition: Slide,
      autoClose: 3000,
      position: "top-right",
      type: type,
    });

  return (
    <>
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
        <>
          <SweetAlert
            show={alert}
            danger
            title="Woot!"
            showCancel
            confirmBtnText="Yes, delete it!"
            cancelBtnText="No!"
            onConfirm={delimg}
            onCancel={() => {
              setAlert(false);
              setImgdel(false);
            }}
          >
            {" "}
            Do you want to delete it!
          </SweetAlert>
          <SweetAlert
            show={alertproperty}
            danger
            title="Woot!"
            showCancel
            confirmBtnText="Yes, delete it!"
            cancelBtnText="No!"
            onConfirm={del}
            onCancel={() => {
              setAlertproperty(false);
              setDelalertproperty(false);
            }}
          >
            {" "}
            Do you want to delete it!
          </SweetAlert>

          {imgModel && (
            <div
              id="image-modal"
              className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75"
            >
              <div className="relative">
                <img
                  className="max-w-[800px] max-h-[500px]"
                  src={imgModelsrc}
                  alt="Full Screen Image"
                />
                <button
                  onClick={() => {
                    setImgModel(false);
                    setImgModelsrc(false);
                  }}
                  className="absolute top-2 right-2 p-2 text-white rounded-full bg-gray-800 hover:bg-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {neighbourmodal && (
            <div className="py-12 bg-gray-700 bg-opacity-30 transition duration-150 ease-in-out z-[100] fixed top-0 right-0 bottom-0 left-0">
              <div role="alert" className="container mx-auto w-8/12">
                <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
                  <h1 className="text-gray-800 font-lg font-bold tracking-normal leading-tight mb-4">
                    Add New Neighbour
                  </h1>
                  <p className="text-left text-gray-800 text-sm font-bold leading-tight tracking-normal">
                    Neighbour
                  </p>
                  <div className="relative mb-5 mt-2">
                    <input
                      type="url"
                      value={neighbourname}
                      onChange={(e) => setNeighbourname(e.target.value)}
                      className="text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-4 text-sm border-gray-300 rounded border"
                      required
                      placeholder="Enter Neighbour"
                    />
                  </div>
                  <div className="flex items-center justify-start w-full">
                    <button
                      onClick={() => settab()}
                      className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => {
                        setNeighbourmodal(!neighbourmodal);
                        setNeighbourname("");
                      }}
                      className="focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setNeighbourmodal(!neighbourmodal);
                      setNeighbourname("");
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
          )}

          {popup && (
            <div className="fixed top-0 bg-gray-700 bg-opacity-30 right-0 bottom-0 overflow-y-auto left-0 flex items-center justify-center bg-gray-700 bg-opacity-30 transition duration-150 ease-in-out z-10">
              <div className="py-12 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0">
                <div role="alert" className="container mx-auto w-9/12">
                  <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
                    <p className="text-gray-800 font-lg text-xl font-bold tracking-normal leading-tight mb-4">
                      Add Property Details
                    </p>

                    <div className="grid divide-y divide-neutral-200 border rounded-lg px-4 mx-auto mt-8">
                      <div className="py-3">
                        <details className="group">
                          <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                            <span className="capitalize">Property Images</span>

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

                          <div className="flex justify-between items-center">
                            <p className="mt-4 text-left text-gray-800 text-lg font-bold leading-tight tracking-normal">
                              Livingroom Images
                            </p>
                          </div>
                          <ChildComponent
                            setImgModel={setImgModel}
                            setImgModelsrc={setImgModelsrc}
                            setAlert={setAlert}
                            setImgdel={setImgdel}
                            images={images}
                            setData={setData}
                            data={data}
                            setImages={setImages}
                            name="livingroom"
                            onDrop={onDrop}
                            onDragEnd={onDragEnd}
                            getListStyle={getListStyle}
                            getItemStyle={getItemStyle}
                            items={items}
                            popid={popid}
                          />
                          <p className="text-left text-gray-800 text-lg font-bold leading-tight tracking-normal mt-4">
                            Bedroom Images
                          </p>
                          <ChildComponent
                            setImgModel={setImgModel}
                            setImgModelsrc={setImgModelsrc}
                            setAlert={setAlert}
                            setImgdel={setImgdel}
                            images={images}
                            setData={setData}
                            data={data}
                            setImages={setImages}
                            name="bedroom"
                            onDrop={onDrop}
                            onDragEnd={onDragEnd}
                            getListStyle={getListStyle}
                            getItemStyle={getItemStyle}
                            items={items}
                            popid={popid}
                          />
                          <p className="text-left text-gray-800 text-lg font-bold leading-tight tracking-normal mt-4">
                            Bathroom Images
                          </p>
                          <ChildComponent
                            setImgModel={setImgModel}
                            setImgModelsrc={setImgModelsrc}
                            setAlert={setAlert}
                            setImgdel={setImgdel}
                            images={images}
                            setData={setData}
                            setImages={setImages}
                            data={data}
                            name="bathroom"
                            onDrop={onDrop}
                            onDragEnd={onDragEnd}
                            getListStyle={getListStyle}
                            getItemStyle={getItemStyle}
                            items={items}
                            popid={popid}
                          />
                          <p className="text-left text-gray-800 text-lg font-bold leading-tight tracking-normal mt-4">
                            Kitchen Images
                          </p>
                          <ChildComponent
                            setImgModel={setImgModel}
                            setImgModelsrc={setImgModelsrc}
                            setAlert={setAlert}
                            setImgdel={setImgdel}
                            images={images}
                            setData={setData}
                            setImages={setImages}
                            data={data}
                            name="kitchen"
                            onDrop={onDrop}
                            onDragEnd={onDragEnd}
                            getListStyle={getListStyle}
                            getItemStyle={getItemStyle}
                            items={items}
                            popid={popid}
                          />
                          <p className="text-left text-gray-800 text-lg font-bold leading-tight tracking-normal mt-4">
                            Add more Images
                          </p>
                          <ChildComponent
                            setImgModel={setImgModel}
                            setImgModelsrc={setImgModelsrc}
                            setAlert={setAlert}
                            setImgdel={setImgdel}
                            images={images}
                            setData={setData}
                            setImages={setImages}
                            data={data}
                            name="more"
                            onDrop={onDrop}
                            onDragEnd={onDragEnd}
                            getListStyle={getListStyle}
                            getItemStyle={getItemStyle}
                            items={items}
                            popid={popid}
                          />
                          <p className="text-left text-gray-800 text-lg font-bold leading-tight tracking-normal mb-0 mt-4">
                            Amenities
                          </p>
                          <div className="text-left grid">
                            <label className="mt-3">
                              <input
                                onChange={(e) => handleAmenities(e)}
                                checked={amenities?.includes("lounge")}
                                value="lounge"
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                              <span className="ml-2 text-gray-700">Lounge</span>
                            </label>
                            {(amenities?.includes("lounge") ||
                              images["lounge"]?.length > 0) && (
                              <ChildComponent
                                setImgModel={setImgModel}
                                setImgModelsrc={setImgModelsrc}
                                setAlert={setAlert}
                                setImgdel={setImgdel}
                                images={images}
                                setData={setData}
                                setImages={setImages}
                                data={data}
                                name="lounge"
                                onDrop={onDrop}
                                onDragEnd={onDragEnd}
                                getListStyle={getListStyle}
                                getItemStyle={getItemStyle}
                                items={items}
                                popid={popid}
                              />
                            )}
                            <label className="items-center mt-3">
                              <input
                                onChange={(e) => handleAmenities(e)}
                                checked={amenities?.includes("roof_deck")}
                                value="roof_deck"
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                              <span className="ml-2 text-gray-700">
                                Roof deck
                              </span>
                            </label>
                            {(amenities?.includes("roof_deck") ||
                              images["roof_deck"]?.length > 0) && (
                              <ChildComponent
                                setImgModel={setImgModel}
                                setImgModelsrc={setImgModelsrc}
                                setAlert={setAlert}
                                setImgdel={setImgdel}
                                images={images}
                                setData={setData}
                                setImages={setImages}
                                data={data}
                                name="roof_deck"
                                onDrop={onDrop}
                                onDragEnd={onDragEnd}
                                getListStyle={getListStyle}
                                getItemStyle={getItemStyle}
                                items={items}
                                popid={popid}
                              />
                            )}
                            <label className="items-center mt-3">
                              <input
                                onChange={(e) => handleAmenities(e)}
                                checked={amenities?.includes("gym")}
                                value="gym"
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                              <span className="ml-2 text-gray-700">Gym</span>
                            </label>
                            {(amenities.includes("gym") ||
                              images["gym"]?.length > 0) && (
                              <ChildComponent
                                setImgModel={setImgModel}
                                setImgModelsrc={setImgModelsrc}
                                setAlert={setAlert}
                                setImgdel={setImgdel}
                                images={images}
                                setData={setData}
                                setImages={setImages}
                                data={data}
                                name="gym"
                                onDrop={onDrop}
                                onDragEnd={onDragEnd}
                                getListStyle={getListStyle}
                                getItemStyle={getItemStyle}
                                items={items}
                                popid={popid}
                              />
                            )}
                            <label className="inline-flex items-center mt-3">
                              <input
                                onChange={(e) => handleAmenities(e)}
                                checked={amenities?.includes("pool")}
                                value="pool"
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                              <span className="ml-2 text-gray-700">Pool</span>
                            </label>
                            {(amenities.includes("pool") ||
                              images["pool"]?.length > 0) && (
                              <ChildComponent
                                setImgModel={setImgModel}
                                setImgModelsrc={setImgModelsrc}
                                setAlert={setAlert}
                                setImgdel={setImgdel}
                                images={images}
                                setData={setData}
                                setImages={setImages}
                                data={data}
                                name="pool"
                                onDrop={onDrop}
                                onDragEnd={onDragEnd}
                                getListStyle={getListStyle}
                                getItemStyle={getItemStyle}
                                items={items}
                                popid={popid}
                              />
                            )}
                            <label className="inline-flex items-center mt-3">
                              <input
                                onChange={(e) => handleAmenities(e)}
                                checked={amenities?.includes("lobby")}
                                value="lobby"
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                              <span className="ml-2 text-gray-700">Lobby</span>
                            </label>
                            {(amenities.includes("lobby") ||
                              images["lobby"]?.length > 0) && (
                              <ChildComponent
                                setImgModel={setImgModel}
                                setImgModelsrc={setImgModelsrc}
                                setAlert={setAlert}
                                setImgdel={setImgdel}
                                images={images}
                                setData={setData}
                                setImages={setImages}
                                data={data}
                                name="lobby"
                                onDrop={onDrop}
                                onDragEnd={onDragEnd}
                                getListStyle={getListStyle}
                                getItemStyle={getItemStyle}
                                items={items}
                                popid={popid}
                              />
                            )}
                            <label className="inline-flex items-center mt-3">
                              <input
                                onChange={(e) => handleAmenities(e)}
                                checked={amenities?.includes("golf_room")}
                                value="golf_room"
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                              <span className="ml-2 text-gray-700">
                                Golf room
                              </span>
                            </label>
                            {(amenities.includes("golf_room") ||
                              images["golf_room"]?.length > 0) && (
                              <ChildComponent
                                setImgModel={setImgModel}
                                setImgModelsrc={setImgModelsrc}
                                setAlert={setAlert}
                                setImgdel={setImgdel}
                                images={images}
                                setData={setData}
                                setImages={setImages}
                                data={data}
                                name="golf_room"
                                onDrop={onDrop}
                                onDragEnd={onDragEnd}
                                getListStyle={getListStyle}
                                getItemStyle={getItemStyle}
                                items={items}
                                popid={popid}
                              />
                            )}
                            <label className="inline-flex items-center mt-3">
                              <input
                                onChange={(e) => handleAmenities(e)}
                                checked={amenities?.includes("others")}
                                type="checkbox"
                                value="others"
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                              <span className="ml-2 text-gray-700">Others</span>
                            </label>
                            {(amenities.includes("others") ||
                              images["others"]?.length > 0) && (
                              <ChildComponent
                                setImgModel={setImgModel}
                                setImgModelsrc={setImgModelsrc}
                                setAlert={setAlert}
                                setImgdel={setImgdel}
                                images={images}
                                setData={setData}
                                setImages={setImages}
                                data={data}
                                name="others"
                                onDrop={onDrop}
                                onDragEnd={onDragEnd}
                                getListStyle={getListStyle}
                                getItemStyle={getItemStyle}
                                items={items}
                                popid={popid}
                              />
                            )}
                          </div>
                        </details>
                      </div>
                    </div>

                    {/* <p className="text-gray-800 font-lg text-xl font-bold tracking-normal leading-tight mb-4">
                      Add Neighbours Detail
                    </p> */}

                    <div className="grid divide-y divide-neutral-200 border rounded-lg px-4 mx-auto mt-8">
                      <div className="py-3">
                        <details className="group">
                          <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                            <span className="capitalize">Neighbours</span>

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
                          <div className="flex flex-column">
                            <div className="w-full">
                              <div className="flex flex-col sm:flex-row">
                                {tab.map((tab, index) => (
                                  <button
                                    key={index}
                                    className={`text-gray-600 py-4 px-6 block hover:text-blue-500 focus:outline-none ${
                                      activeTab === index
                                        ? "text-blue-500 border-b-2 font-medium border-blue-500"
                                        : ""
                                    }`}
                                    onClick={() => setActiveTab(index)}
                                  >
                                    {tab.label} &#123;
                                    {checkedTab[tab.label]?.length}&#125;
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="w-full">
                              <p className="text-left">
                               
                                <span
                                  onClick={() => {
                                    let lengths = false;

                                    Object.keys(checkedTab).forEach((key) => {
                                      if (
                                        key != tab[activeTab].label &&
                                        checkedTab[key].length > 0
                                      ) {
                                        lengths = true;
                                      }
                                    });
                                    if (lengths) {
                                      notify22(
                                        "Please select one neighbour",
                                        "error"
                                      );
                                      return;
                                    }
                                    tab[activeTab].content.map((item) => {
                                      setCheckedTab((prevCheckedTab) => ({
                                        ...prevCheckedTab,
                                        [tab[activeTab].label]: prevCheckedTab[
                                          tab[activeTab].label
                                        ].filter((neigh) => neigh !== item),
                                      }));
                                    });
                                  }}
                                  className="cursor-pointer"
                                >
                                  {" "}
                                  Clear
                                </span>
                              </p>
                              <div className="grid grid-cols-3">
                                {tab[activeTab].content.map((item) => (
                                  <label
                                    key={item}
                                    className="inline-flex items-center mt-3"
                                  >
                                    <input
                                      checked={checkedTab[tab[activeTab].label]
                                        ?.map((data) => data)
                                        .includes(item)}
                                      onChange={(e) =>
                                        handletabChecked(
                                          e,
                                          tab[activeTab].label
                                        )
                                      }
                                      type="checkbox"
                                      value={item}
                                      className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-700">
                                      {item}
                                    </span>
                                  </label>
                                ))}
                              </div>
                              {tab[activeTab].label == "Others" ? (
                                <>
                                  <button
                                    onClick={() =>
                                      setNeighbourmodal(!neighbourmodal)
                                    }
                                    className="border border-green-800 bg-green-800 hover:bg-green-600 text-white rounded-md px-4 py-2 ml-[95px] mb-2 group relative overflow-hidden text-white"
                                  >
                                    Add Neighbours
                                    <div className="absolute inset-0 h-full w-full scale-0 rounded-md transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                                  </button>
                                </>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                        </details>
                      </div>
                    </div>

                    <div className="grid divide-y divide-neutral-200 border rounded-lg px-4 mx-auto mt-8">
                      <div className="py-3">
                        <details className="group">
                          <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                            <span className="capitalize">
                              StreetEasy Images
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

                          <div className="p-3 bg-gray-100 rounded-lg h-[237px] overflow-y-auto mt-2">
                            <section className="container">
                              <div className="flex flex-wrap gap-2">
                                {streetimg.length === 0 && (
                                  <p>No image to show</p>
                                )}
                                {streetimg?.map((file) =>
                                  file["image_paths"]?.map((image, i) => (
                                    <div key={i} className="relative">
                                      <img
                                        onClick={() => {
                                          setImgModel(true);
                                          setImgModelsrc(
                                            "http://18.191.139.138:90/external_images/" +
                                              file.complete_title.replace(
                                                /#/g,
                                                ""
                                              ) +
                                              "/" +
                                              image.split("/").pop()
                                          );
                                        }}
                                        className="w-[104px] h-[104px] border-dashed rounded border-2 border-gray-400 cursor-pointer"
                                        src={
                                          "http://18.191.139.138:90/external_images/" +
                                          file.complete_title.replace(
                                            /#/g,
                                            ""
                                          ) +
                                          "/" +
                                          image.split("/").pop()
                                        }
                                        alt={
                                          "http://18.191.139.138:90/external_images/" +
                                          file.complete_title.replace(
                                            /#/g,
                                            ""
                                          ) +
                                          "/" +
                                          image.split("/").pop()
                                        }
                                      />
                                      <a
                                        target="blank"
                                        href={image.trim()}
                                        download
                                      >
                                        <div className="absolute top-2 right-2 p-[4px] cursor-pointer text-white rounded-full bg-gray-800 hover:bg-gray-600">
                                          <svg
                                            width="20px"
                                            height="20px"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M12.5535 16.5061C12.4114 16.6615 12.2106 16.75 12 16.75C11.7894 16.75 11.5886 16.6615 11.4465 16.5061L7.44648 12.1311C7.16698 11.8254 7.18822 11.351 7.49392 11.0715C7.79963 10.792 8.27402 10.8132 8.55352 11.1189L11.25 14.0682V3C11.25 2.58579 11.5858 2.25 12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V14.0682L15.4465 11.1189C15.726 10.8132 16.2004 10.792 16.5061 11.0715C16.8118 11.351 16.833 11.8254 16.5535 12.1311L12.5535 16.5061Z"
                                              fill="white"
                                            />
                                            <path
                                              d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z"
                                              fill="white"
                                            />
                                          </svg>{" "}
                                        </div>
                                      </a>
                                    </div>
                                  ))
                                )}
                              </div>
                            </section>
                          </div>
                        </details>
                      </div>
                    </div>

                    <div className="grid divide-y divide-neutral-200 border rounded-lg px-4 mx-auto mt-8">
                      <div className="py-3">
                        <details className="group">
                          <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                            <span className="capitalize">Costume Description</span>
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
                          {description?.map((desc, i) => (
                            <div key={i} className="relative">
                              <textarea
                                value={desc}
                                onChange={(e) => handledesc(e,i)}
                                className="w-100 min-h-[100px] mt-2 rounded-md relative p-2 px-4"
                                placeholder="Add a description..."
                              >
                              </textarea>
                              
                              <div className="absolute top-4 right-2 p-1 rounded-full bg-gray-800 hover:bg-gray-600">
                                  <svg
                                    onClick={() => {
                                      setDescription([...description.slice(0, i), ...description.slice(i + 1)])
                                    }}
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
                           <button
                        onClick={() => {
                         const last= description.length
                         if (description[last-1] === ''){
                          notify22('Enter data in the previous description','error')
                         }
                         else{
                          setDescription([...description, ""])}}
                         }
                        className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                      >
                        Add More Description
                      </button>
                        </details>
                      </div>
                    </div>

                    <div className="flex items-center justify-start w-full mt-4">
                      <button
                        onClick={() => submitDetail()}
                        className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => {
                          setPopup(!popup);
                          setPopid(false);
                          setImages({});
                          setAmenities([]);
                        }}
                        className="focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setPopup(!popup);
                        setPopid(false);
                        setImages({});
                        setAmenities([]);
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


          <h1 className="text-2xl font-mono text-red-600 m-8">Upload CSV</h1>

          <div className="overflow-x-auto">
            <div className="min-w-screen flex items-center justify-center font-sans overflow-hidden">
              <div className="w-full lg:w-5/6">
                <div className="flex items-center justify-between">
                  <div>
                    {/* <input
                      type="file"
                      accept=".csv"
                      ref={fileRef}
                      onChange={(e) => upload(e.target.files[0])}
                    /> */}
                    <SearchJobImg data={data} setData={setData} />

                  </div>
                  
                  <div>
                  <Link to="/refresh"> <button
        className="border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 mb-2 group relative overflow-hidden text-white"
      >
        Refresh Listing
        <div className="absolute inset-0 h-full w-full scale-0 rounded-md transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
      </button></Link>
                  </div>
                  <div className="justify-end">
                    <div>
                    <Addproperty data={data} setData={setData}/>
                    </div>
                    <Scrapall data={data} setData={setData} setCheckedItems={setCheckedItems}/>
                  </div>
                </div>
                <DataTable
                  columns={columns}
                  data={data || []}
                  pagination
                  highlightOnHover
                  fixedHeader
                  paginationComponentOptions={paginationOptions}
                />
                <Tempdescription />

                {data?.length && (
                  <>
                  <button
                    onClick={() => next()}
                    disabled={spin != false}
                    className="mb-8 float-right border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 group relative overflow-hidden text-white"
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
                    Next
                    <div className="absolute inset-0 h-full w-full scale-0 rounded-md transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                  </button>

<button
onClick={() => schedule()}
disabled={spin != false}
className="mb-8 float-right border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 group relative overflow-hidden text-white"
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
Schedule
<div className="absolute inset-0 h-full w-full scale-0 rounded-md transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
</button></>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function ChildComponent({
  images,
  setImages,
  data,
  setData,
  onDrop,
  name,
  setAlert,
  setImgdel,
  setImgModel,
  setImgModelsrc,
  onDragEnd,
  getListStyle,
  getItemStyle,
  items,
  popid,
}) {
  const [modal, setModal] = useState(false);
  const [num, setNum] = useState(false);
  const [status, setStatus] = useState(false);
  const [delalert, setDelalert] = useState(false);
  const [index, setIndex] = useState("");

  const submitnum=()=>{
    const more = images?.['more']?.[status];
    const updatedDataArray = more.map((item, i) => {
      if (index === i) {
        return { ...item, key: parseInt(num, 10) };
      }
      return item;
    });
      const value= {
          ...images,
            more: {
              ...images.more,
              [status]: updatedDataArray
            }
          }
        const imgnum = { images: value};
    axios
      .patch(`http://18.191.139.138:90/neighbour/${popid}/`, imgnum)
      .then((response) => {
        notify22("Data Updated", "success");
        const updatedData = data.map(item => {
          if (item.id === response.data.id) {
            // Update the item with the matching id
            return { ...item, ...response.data };
          }
          return item;
        });
        setData(updatedData)
        setImages(value)
        setModal(false);
        setNum(false);
        setIndex('');
        setStatus(false);
      })
      .catch((e) => {
        notify22(e.message, "error");
      });
  }

  const del=()=>{
    const more = images?.['more']?.[status];
    const updatedDataArray = more.filter((item, i) => i !== index);;
      const value= {
        ...images,
          more: {
            ...images.more,
            [status]: updatedDataArray
          }
        }
      const imgdel = { images: value};
    axios
      .patch(`http://18.191.139.138:90/neighbour/${popid}/`,imgdel)
      .then((response) => {
        const updatedData = data.map(item => {
          if (item.id === response.data.id) {
            // Update the item with the matching id
            return { ...item, ...response.data };
          }
          return item;
        });
        setData(updatedData)
        setImages(value)
        setDelalert(false);
        setIndex(false);
        setStatus(false)
        notify22("Data Updated", "success");
      })
      .catch((e) => {
        notify22(e.message, "error");
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
            show={delalert}
            danger
            title="Woot!"
            showCancel
            confirmBtnText="Yes, delete it!"
            cancelBtnText="No!"
            onConfirm={del}
            onCancel={() => {
              setDelalert(false);
              setIndex(false);
              setStatus(false)
            }}
          >
            {" "}
            Do you want to delete it!
          </SweetAlert>
    {modal && (
        <div className="h-100 py-12 bg-gray-700 bg-opacity-30 transition duration-150 ease-in-out z-10 fixed top-0 right-0 bottom-0 left-0">
          <div role="alert" className="container mx-auto w-8/12">
            <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
              <h1 className="text-gray-800 font-lg font-bold tracking-normal leading-tight mb-4">
                Change Number
              </h1>
              <p className="text-left text-gray-800 text-sm font-bold leading-tight tracking-normal">
                Img Number
              </p>
              <div className="relative mb-5 mt-2">
                <input
                  type="number"
                  value={num}
                  onChange={(e) => setNum(e.target.value)}
                  className="text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-4 text-sm border-gray-300 rounded border"
                  required
                  placeholder="Enter URL"
                />
              </div>
              <div className="flex items-center justify-start w-full">
                <button 
                onClick={()=>{submitnum()}}
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm"
                >
                  Submit
                </button>
                <button
                  onClick={() => {setModal(!modal);setNum(false);setIndex('');setStatus(false)}}
                  className="focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
              <button
                onClick={() => {setModal(!modal);setNum(false);setIndex('');setStatus(false)}}
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


    {name == 'more'? <div className="flex">
        <div className=" w-1/2 inline-block ">
          <div className="bg-gray-100 pt-2 rounded-lg h-[180px] overflow-auto mt-2 mr-2">
            <div className="flex items-center justify-between px-4">
              <div>
                <p className="font-bold m-0">More Furnished</p>
              </div>
              <div className="justify-end">
                <Dropzone onDrop={(e) => onDrop(e, name, "furnished")}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <button className="text-xs float-left border border-green-500 bg-green-500 text-white rounded-md p-1 group relative overflow-hidden text-white m-0">
                        Add Image
                      </button>
                    </div>
                  )}
                </Dropzone>
              </div>
            </div>
            <section className="container">
              <div className="flex flex-wrap gap-2 relative">

                      {images?.[name]?.["furnished"]?.length === 0 && (
                        <p>Add images to show</p>
                      )}
                      {images?.[name]?.["furnished"]?.map((item, index) => (
                            <div key={index}
                              className="relative">
                              <img
                                onClick={() => {
                                  setImgModel(true);
                                  setImgModelsrc(
                                    `http://18.191.139.138:90/${item.url}`
                                  );
                                }}
                                className="w-[104px] h-[104px] border-dashed rounded border-2 border-gray-400 cursor-pointer"
                                src={`http://18.191.139.138:90/${item.url}`}
                              />
                              <div className="absolute top-2 right-2 p-1 rounded-full bg-gray-800 hover:bg-gray-600">
                                <svg
                                  onClick={() => {
                                    setDelalert(true);
                                    setIndex(index);
                                    setStatus('furnished')
                                  }}
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
                              <div onClick={() => {setModal(!modal);setNum(item.key);setIndex(index);setStatus('furnished')}} className="cursor-pointer absolute bottom-2 right-2 p-1 rounded-full bg-gray-800 hover:bg-gray-600">
                                <p className="text-white m-0 leading-[0.6] text-[11px] p-[2px]">
                                  {item.key}
                                </p>
                              </div>
                            </div>
                      ))}
              </div>
            </section>
          </div>
        </div>
        <div className=" w-1/2 inline-block ">
          <div className="bg-gray-100 pt-2 rounded-lg h-[180px] overflow-auto mt-2 mr-2">
            <div className="flex items-center justify-between px-4">
              <div>
                <p className="font-bold m-0">Unfurnished</p>
              </div>
              <div className="justify-end">
                <Dropzone onDrop={(e) => onDrop(e, name, "unfurnished")}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <button className="text-xs float-left border border-green-500 bg-green-500 text-white rounded-md p-1 group relative overflow-hidden text-white m-0">
                        Add Image
                      </button>
                    </div>
                  )}
                </Dropzone>
              </div>
            </div>
            <section className="container">
              <div className="flex flex-wrap gap-2 relative">

                      {images?.[name]?.["unfurnished"]?.length === 0 && (
                        <p>Add images to show</p>
                      )}
                      {images?.[name]?.["unfurnished"]?.map((item, index) => (
                            <div key={index}
                              className="relative">
                              <img
                                onClick={() => {
                                  setImgModel(true);
                                  setImgModelsrc(
                                    `http://18.191.139.138:90/${item.url}`
                                  );
                                }}
                                className="w-[104px] h-[104px] border-dashed rounded border-2 border-gray-400 cursor-pointer"
                                src={`http://18.191.139.138:90/${item.url}`}
                              />
                              <div className="absolute top-2 right-2 p-1 rounded-full bg-gray-800 hover:bg-gray-600">
                                <svg
                                  onClick={() => {
                                    setDelalert(true);
                                    setIndex(index);
                                    setStatus('unfurnished')
                                  }}
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
                              <div onClick={() => {setModal(!modal);setNum(item.key);setIndex(index);setStatus('unfurnished')}} className="cursor-pointer absolute bottom-2 right-2 p-1 rounded-full bg-gray-800 hover:bg-gray-600">
                                <p className="text-white m-0 leading-[0.6] text-[11px] p-[2px]">
                                  {item.key}
                                </p>
                              </div>
                            </div>
                      ))}
              </div>
            </section>
          </div>
        </div>
      </div>:
      <div className="flex">
      <div className=" w-1/2 inline-block ">
        <div className="bg-gray-100 pt-2 rounded-lg h-[180px] overflow-auto mt-2 mr-2">
          <div className="flex items-center justify-between px-4">
            <div>
              <p className="font-bold m-0">Furnished</p>
            </div>
            <div className="justify-end">
              <Dropzone onDrop={(e) => onDrop(e, name, "furnished")}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <button className="text-xs float-left border border-green-500 bg-green-500 text-white rounded-md p-1 group relative overflow-hidden text-white m-0">
                      Add Image
                    </button>
                  </div>
                )}
              </Dropzone>
            </div>
          </div>
          <section className="container">
            <div className="flex flex-wrap gap-2 relative">
              <DragDropContext
                onDragEnd={(result) => onDragEnd(result, name, "furnished")}
              >
                <Droppable droppableId="droppable" direction="horizontal">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      {images?.[name]?.["furnished"]?.length === 0 && (
                        <p>Add images to show</p>
                      )}
                      {images?.[name]?.["furnished"]?.map((item, index) => (
                        <Draggable
                          key={item}
                          draggableId={item}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              className="relative"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <img
                                onClick={() => {
                                  setImgModel(true);
                                  setImgModelsrc(
                                    `http://18.191.139.138:90/${item}`
                                  );
                                }}
                                className="w-[104px] h-[104px] border-dashed rounded border-2 border-gray-400 cursor-pointer"
                                src={`http://18.191.139.138:90/${item}`}
                              />
                              <div className="absolute top-2 right-2 p-1 rounded-full bg-gray-800 hover:bg-gray-600">
                                <svg
                                  onClick={() => {
                                    setAlert(true);
                                    setImgdel({
                                      url: item,
                                      type: "furnished",
                                      status: name,
                                      property: popid,
                                    });
                                  }}
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
                              <div className="absolute bottom-2 right-2 p-1 rounded-full bg-gray-800 hover:bg-gray-600">
                                <p className="text-white m-0 leading-[0.6] text-[11px] p-[2px]">
                                  {index + 1}
                                </p>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </section>
        </div>
      </div>
      <div className=" w-1/2 inline-block ">
        <div className="bg-gray-100 pt-2 rounded-lg h-[180px] overflow-auto mt-2 mr-2">
          <div className="flex items-center justify-between px-4">
            <div>
              <p className="font-bold m-0">Unfurnished</p>
            </div>
            <div className="justify-end">
              <Dropzone onDrop={(e) => onDrop(e, name, "unfurnished")}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <button className="text-xs float-left border border-green-500 bg-green-500 text-white rounded-md p-1 group relative overflow-hidden text-white m-0">
                      Add Image
                    </button>
                  </div>
                )}
              </Dropzone>
            </div>
          </div>
          <section className="container">
            <div className="flex flex-wrap gap-2 relative">
              <DragDropContext
                onDragEnd={(result) => onDragEnd(result, name, "unfurnished")}
              >
                <Droppable droppableId="droppable" direction="horizontal">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                      {...provided.droppableProps}
                    >
                      {images?.[name]?.["unfurnished"]?.length == 0 && (
                        <p>Add images to show</p>
                      )}
                      {images?.[name]?.["unfurnished"]?.map((item, index) => (
                        <Draggable
                          key={item.toString()}
                          draggableId={item.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              className="relative"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <img
                                onClick={() => {
                                  setImgModel(true);
                                  setImgModelsrc(
                                    `http://18.191.139.138:90/${item}`
                                  );
                                }}
                                className="w-[104px] h-[104px] border-dashed rounded border-2 border-gray-400 cursor-pointer"
                                src={`http://18.191.139.138:90/${item}`}
                              />
                              <div className="absolute top-2 right-2 p-1 rounded-full bg-gray-800 hover:bg-gray-600">
                                <svg
                                  onClick={() => {
                                    setAlert(true);
                                    setImgdel({
                                      url: item,
                                      type: "unfurnished",
                                      status: name,
                                      property: popid,
                                    });
                                  }}
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
                              <div className="absolute bottom-2 right-2 p-1 rounded-full bg-gray-800 hover:bg-gray-600">
                                <p className="text-white m-0 leading-[0.6] text-[11px] p-[2px]">
                                  {index + 1}
                                </p>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </section>
        </div>
      </div>
    </div>}
      {/* <div className="flex">
        <div className=" w-1/2 inline-block ">
          <div className="bg-gray-100 pt-2 rounded-lg h-[180px] overflow-auto mt-2 mr-2">
            <div className="flex items-center justify-between px-4">
              <div>
                <p className="font-bold m-0">Furnished</p>
              </div>
              <div className="justify-end">
                <Dropzone onDrop={(e) => onDrop(e, name, "furnished")}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <button className="text-xs float-left border border-green-500 bg-green-500 text-white rounded-md p-1 group relative overflow-hidden text-white m-0">
                        Add Image
                      </button>
                    </div>
                  )}
                </Dropzone>
              </div>
            </div>
            <section className="container">
              <div className="flex flex-wrap gap-2 relative">
                <DragDropContext
                  onDragEnd={(result) => onDragEnd(result, name, "furnished")}
                >
                  <Droppable droppableId="droppable" direction="horizontal">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                      >
                        {images?.[name]?.["furnished"]?.length === 0 && (
                          <p>Add images to show</p>
                        )}
                        {images?.[name]?.["furnished"]?.map((item, index) => (
                          <Draggable
                            key={item}
                            draggableId={item}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                className="relative"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                <img
                                  onClick={() => {
                                    setImgModel(true);
                                    setImgModelsrc(
                                      `http://18.191.139.138:90/${item}`
                                    );
                                  }}
                                  className="w-[104px] h-[104px] border-dashed rounded border-2 border-gray-400 cursor-pointer"
                                  src={`http://18.191.139.138:90/${item}`}
                                />
                                <div className="absolute top-2 right-2 p-1 rounded-full bg-gray-800 hover:bg-gray-600">
                                  <svg
                                    onClick={() => {
                                      setAlert(true);
                                      setImgdel({
                                        url: item,
                                        type: "furnished",
                                        status: name,
                                        property: popid,
                                      });
                                    }}
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
                                <div className="absolute bottom-2 right-2 p-1 rounded-full bg-gray-800 hover:bg-gray-600">
                                  <p className="text-white m-0 leading-[0.6] text-[11px] p-[2px]">
                                    {index + 1}
                                  </p>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </section>
          </div>
        </div>
        <div className=" w-1/2 inline-block ">
          <div className="bg-gray-100 pt-2 rounded-lg h-[180px] overflow-auto mt-2 mr-2">
            <div className="flex items-center justify-between px-4">
              <div>
                <p className="font-bold m-0">Unfurnished</p>
              </div>
              <div className="justify-end">
                <Dropzone onDrop={(e) => onDrop(e, name, "unfurnished")}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <button className="text-xs float-left border border-green-500 bg-green-500 text-white rounded-md p-1 group relative overflow-hidden text-white m-0">
                        Add Image
                      </button>
                    </div>
                  )}
                </Dropzone>
              </div>
            </div>
            <section className="container">
              <div className="flex flex-wrap gap-2 relative">
                <DragDropContext
                  onDragEnd={(result) => onDragEnd(result, name, "unfurnished")}
                >
                  <Droppable droppableId="droppable" direction="horizontal">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                        {...provided.droppableProps}
                      >
                        {images?.[name]?.["unfurnished"]?.length == 0 && (
                          <p>Add images to show</p>
                        )}
                        {images?.[name]?.["unfurnished"]?.map((item, index) => (
                          <Draggable
                            key={item.toString()}
                            draggableId={item.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                className="relative"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                <img
                                  onClick={() => {
                                    setImgModel(true);
                                    setImgModelsrc(
                                      `http://18.191.139.138:90/${item}`
                                    );
                                  }}
                                  className="w-[104px] h-[104px] border-dashed rounded border-2 border-gray-400 cursor-pointer"
                                  src={`http://18.191.139.138:90/${item}`}
                                />
                                <div className="absolute top-2 right-2 p-1 rounded-full bg-gray-800 hover:bg-gray-600">
                                  <svg
                                    onClick={() => {
                                      setAlert(true);
                                      setImgdel({
                                        url: item,
                                        type: "unfurnished",
                                        status: name,
                                        property: popid,
                                      });
                                    }}
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
                                <div className="absolute bottom-2 right-2 p-1 rounded-full bg-gray-800 hover:bg-gray-600">
                                  <p className="text-white m-0 leading-[0.6] text-[11px] p-[2px]">
                                    {index + 1}
                                  </p>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </section>
          </div>
        </div>
      </div> */}

    </>
  );
}

export default Upload;
