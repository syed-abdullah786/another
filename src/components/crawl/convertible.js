import React, { useState } from 'react'
import axios from "axios";
import { toast, Slide } from "react-toastify";

function Convertible({datas,setDatas}) {
    const [value,setValue]=useState('')

    const Onhandlechange= (value,datas)=>{
        if (value != ''){
        const ids = datas.map(item => item.id)
        const data={ids:ids,value:value}
        console.log('datas',datas)
        axios
          .post("http://18.191.139.138:90/update_allconv/",data )
          .then((res) => {
            console.log('data',res.data)
            setValue(value)
            setDatas(datas.map(item => ({ ...item, convertible: value })))
            notify22('Updated', "success");

          }).catch((e) => {
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
     <label className="font-bold float-left items-center relative w-max cursor-pointer select-none">
                  Convertible All
              <select
        value={value}
        onChange={(e) => {
          Onhandlechange(
            e.target.value,
            datas
          );
        }}
        className="bg-gray-50 w-[100px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value=''>Select</option>
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
      </label>
    </>
  )
}

export default Convertible