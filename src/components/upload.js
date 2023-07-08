import React, { useEffect, useState, useRef } from 'react'
import axios from "axios";
import { useHistory } from 'react-router-dom';

function Upload() {
  const history = useHistory();
    const fileRef = useRef(null);
    const [filedata, setFileData] = useState(false);



    const uploadfile=(e)=>{
        const formData = new FormData();
  formData.append('file', filedata);
        e.preventDefault();
        axios.post("http://127.0.0.1:8000/",formData).then(response=>{
            console.log('hello',response)
            history.push('/properties');
          }).catch(e =>{
            console.log('hell',e)
          })
      }
  return (
    <>
          <h1 className="text-2xl font-mono text-red-600 m-8">Upload CSV</h1>
          <form encType="multipart/form-data">
          <input type="file"  ref={fileRef} onChange={(e)=> setFileData(e.target.files[0])}  />
          <button
            onClick={(e)=>uploadfile(e)}
            type="submit"
            className="border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
          >
            Upload File
          </button>
          </form>
          </>
  )
}

export default Upload