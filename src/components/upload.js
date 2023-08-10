import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import Papa from 'papaparse';
import { useHistory } from "react-router-dom";
import { toast, Slide } from "react-toastify";
import '../App.css';
import myContext from  './appContext'

function Upload() {
  const {setPropurl} = useContext(myContext);
  const history = useHistory();
  const [show, setShow] = useState(true);
  const fileRef = useRef(null);
  const [filedata, setFileData] = useState(false);
  const [spin, setSpin] = useState(false);
  const [modal, setModal] = useState(false);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [url, setUrl] = useState('');
  const [checkedItems, setCheckedItems] = useState([]);
  const [job, setJob] = useState('');


  useEffect(() => {
    axios
        .get("http://3.88.224.113:90/get_prop/")
        .then((response) => {
          setData(response.data)
          setData2(response.data)
          setShow(false);
        })
        .catch((e) => {
          notify22(e.message, "error");
        });

  }, []);
  // const uploadfile = (e) => {
  //   if (!filedata) {
  //     e.preventDefault();
  //     notify22("Please select file", "error");
  //   } else {
  //     setSpin(true);
  //     e.preventDefault();
  //     const formData = new FormData();
  //     formData.append("file", filedata);
  //     axios
  //       .post("http://3.88.224.113:90/", formData)
  //       .then((response) => {
  //         history.push("/properties");
  //       })
  //       .catch((e) => {
  //         notify22(e.message, "error");
  //         setSpin(false);
  //       });
  //   }
  // };
  const adddata =()=>{
    if(url == ''){
      notify22("Please enter the url", "error")
    }
    else{
      setData([{'url':url,'status':'new'},...data])
      setUrl('')
      setModal(false)
      notify22("Url Added", "success")      
    }
  }

  // const upload=(file)=>{
  //   // setFileData(e.target.files[0])
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       const csvData = event.target.result;        
  //       // Parse the CSV data using papaparse
  //       const { data: parsedData } = Papa.parse(csvData, {
  //         header: false, 
  //         skipEmptyLines: true,
  //       });
  //       setData((prevData) => [...prevData, ...parsedData]);
  //     };
  //     reader.readAsText(file);
  //     fileRef.current.value = ''; 
  //     notify22("File Added", "success") 
  //   }
  // }

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
          return { url: urlArr[0], status: 'new' };
        });
  
        setData((prevData) => [...prevData, ...formattedData]);
      };
      reader.readAsText(file);
      fileRef.current.value = '';
      notify22("File Added", "success");
    }
  };
  

  const del=(obj)=>{
    const updatedArray = data.filter(item => item.url !== obj.url);
    setData(updatedArray);
    const updatedItems = checkedItems.filter(item => item.url !== obj.url);
    setCheckedItems(updatedItems)
    // const updatedItems = [...data];
    // updatedItems.splice(i, 1);
    // setData(updatedItems);
    notify22("Url Deleted", "success") 
  }


  const handleCheckboxChange = (obj) => {
    // if(obj.url)
    const isUrlMatched = checkedItems.some(item => item.url === obj.url);
    if (isUrlMatched) {
      // URL is matched
      const updatedArray = checkedItems.filter(item => item.url !== obj.url);
      if(obj.status == 'pending')
      {
        // if(data2.some(item => item.url === obj.url))
        // {console.log('present')}
        // else{
        //   console.log('absent')
        // }
        const updatedArray = data.map(item => {
          if (item.url === obj.url) {
            return { ...item, status: "new" };
          }
          return item;
        });
        setData(updatedArray)
      }
      setCheckedItems(updatedArray)
    } else {
      // URL is not matched
      if(obj.status == 'new')
      {
        const updatedArray = data.map(item => {
          if (item.url === obj.url) {
            return { ...item, status: "pending" };
          }
          return item;
        });
        setData(updatedArray)
      }
      setCheckedItems([...checkedItems,obj])
    }

    





    // const updatedData = [...data];

    // // Check if the status of the item at the given index is 'pending'
    // if (updatedData[index]?.status === 'pending') {
    //   const isURLExists = data2.some((item) => item.url === data[index].url);
    //   if (!isURLExists){
    //     console.log('present')
    //     updatedData[index].status = 'new';
    //   }
    //   else{
    //     updatedData[index].status = 'scraped';
    //   }

      
    // } 
    // else{
    //   updatedData[index].status = 'pending';
    // }
    // const newDataArray = updatedData.map((item, i)=>{
    //   if (i==index){
    //     setCheckedItems([...checkedItems,item])
    //   }
    // })

    // setData(updatedData); 
    // setCheckedItems((prevCheckedItems) => ({
    //   ...prevCheckedItems,
    //   [index]: !prevCheckedItems[index],
    // }));
  };

const next=()=>{
  setSpin(true)
  // const hasPendingItems = data.some((item) => item.status === 'pending');
  // const checkedData = data.filter((_, index) => checkedItems[index]);
  // const flattenedCheckedData = checkedData.flat();
  // console.log('hasPendingItems',hasPendingItems)
  console.log(checkedItems.length)
  if(checkedItems.length == 0){
    setSpin(false)
    notify22('Select property to scrap', "error")
  }
  else{
    axios.post("http://3.88.224.113:90/crawl/",data)
        .then((response) => {
          const hell = checkedItems?.map((item) => item.url);
          console.log('hell',hell)
          
          axios.post("http://3.88.224.113:90/jobs/",hell)
          .then((response) => {
            console.log('response.data',response.data)
            // setPropurl(checkedItems)
          history.push(`/crawl?url=${response.data.id}`)
          })
          
          setSpin(false)
        })
        .catch((e) => {
          notify22(e.message, "error");
          setSpin(false);
        });
  }
}

const handleDownload = () => {
  const csv = arrayToCSV(data);
  downloadCSV(csv, 'data.csv');
};

const arrayToCSV = (array) => {
  // const urls = data.map(item => [item.url]);
  const csv = Papa.unparse(array);
  return csv;
};
const downloadCSV = (csv, filename) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};

const SearchJob =()=>{
  history.push(`/crawl?url=${job}`)
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
        <>{modal && (<div className="py-12 bg-gray-700 bg-opacity-30 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0">
                <div role="alert" className="container mx-auto w-11/12 md:w-2/3 max-w-lg">
                    <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
                        <h1 className="text-gray-800 font-lg font-bold tracking-normal leading-tight mb-4">Add New Property</h1>
                        <p className="text-left text-gray-800 text-sm font-bold leading-tight tracking-normal">Property Url</p>
                        <div className="relative mb-5 mt-2">
                           
                            <input type="url" value={url} onChange={(e)=> setUrl(e.target.value)} className="text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-4 text-sm border-gray-300 rounded border" required placeholder="Enter URL" />
                        </div>
                        <div className="flex items-center justify-start w-full">
                            <button onClick={adddata} className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-sm">Submit</button>
                            <button  onClick={() => setModal(!modal)} className="focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm">Cancel</button>
                        </div>
                        <button  onClick={() => setModal(!modal)} className="cursor-pointer absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out rounded focus:ring-2 focus:outline-none focus:ring-gray-600" aria-label="close modal" role="button">
                            <svg  xmlns="http://www.w3.org/2000/svg"  className="icon icon-tabler icon-tabler-x" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
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
                <input
                  type="file"
                  accept=".csv"
                  ref={fileRef}
                  onChange={(e) => upload(e.target.files[0])}
                />
              </div>
              <div className="justify-end">
              <button onClick={() => setModal(!modal)} className="border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 ml-[95px] mb-2 group relative overflow-hidden text-white">
                Add Address
                <div className="absolute inset-0 h-full w-full scale-0 rounded-md transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
              </button>
              <div className="w-60 flex border rounded-lg shadow-md">
        <input
          type="number"
          className="w-40 flex-grow p-2 rounded-l-lg"
          placeholder="Enter Job Id"
          value={job}
          onChange={(e) =>{setJob(e.target.value >= 0 ? e.target.value : job)}}
        />
        <button
        disabled={job == ''}
          className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
          onClick={SearchJob}
        >
          Search
        </button>
      </div>
              </div>
            </div>
            {data.length!=0 ? ( <><div className="bg-white shadow-md rounded my-6">
          <table className="min-w-max w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left w-2/5">Property Url</th>
                    <th className="py-3 px-6 text-left w-1/5">Scrap</th>
                    <th className="py-3 px-6 text-left w-1/5">Status</th>
                    <th className="py-3 px-6 text-center w-1/5">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                {data.map((datas,i)=>(<tr key={i} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-medium">{datas.url.length > 50 ? datas.url.substring(0, 50) + "..." : datas.url}</span>
                      </div>
                    </td>
                    <td>

<label className="flex items-center relative w-max cursor-pointer select-none">
  <input type="checkbox" 
  checked={checkedItems.map(data => data.url).includes(datas.url)}
  onChange={() => handleCheckboxChange(datas)}
  className="input appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 bg-red-500" />
  <span className="absolute font-medium text-xs uppercase right-1 text-white"> NO</span>
  <span className="absolute font-medium text-xs uppercase right-8 text-white"> YES </span>
  <span className="w-7 h-7 right-7 absolute rounded-full transform transition-transform bg-gray-200" />
</label>
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-medium">{datas.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex text-center justify-center">
                        <div className="transform hover:text-purple-500">
                          <button onClick={()=>del(datas)} className="group relative p-2 w-24 overflow-hidden rounded-2xl bg-red-500 text-xs font-bold text-white">
                            Delete
                            <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>))}
                </tbody>
              </table> 
              </div>
              
              {/* <button onClick={()=> handleDownload()} className="mb-8 float-left border border-green-500 bg-green-500 text-white rounded-md px-2 py-2 m-2 group relative overflow-hidden text-white"
             >Download csv</button> */}

              <button onClick={()=> next()} disabled={(spin != false)} className="mb-8 float-right border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 group relative overflow-hidden text-white">
              {spin && <div role="status" className="inline-block">
    <svg aria-hidden="true" className="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-green-600 fill-green-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>  
    <span className="sr-only">Loading...</span>
</div>}
                Next
                <div className="absolute inset-0 h-full w-full scale-0 rounded-md transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
              </button>
              </>
              
              ):
              <p className="text-xl">No data to show</p>} 
          </div>
        </div>
      </div>
      </>)}
    </>
  );
}

export default Upload;
