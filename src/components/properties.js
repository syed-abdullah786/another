import React, { useEffect, useState, useRef } from 'react'
import axios from "axios";
import { useHistory } from 'react-router-dom';

function Properties() {
    const history = useHistory();
    const [datas,setDatas] = useState([])
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/").then(response=>{
            console.log('hello',response.data)
            setDatas(response.data)
          }).catch(e =>{
            console.log('hell',e)
          })
         
       },[]);

       const crawl=(data)=>{
        history.push(`/crawl?url=${data}`)
      }
  return (
    <>
<section className="antialiased bg-gray-100 text-gray-600 h-screen px-4">
    <div className="flex flex-col justify-center py-8">
        <div className="w-full bg-white shadow-lg rounded-sm border border-gray-200">
            <header className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800 text-2xl">Properties</h2>
            </header>
            <div className="p-3">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full">
                        <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                            <tr>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-left">ID</div>
                                </th>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-left">Title</div>
                                </th>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-left">File name</div>
                                </th>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-left">Uploaded time</div>
                                </th>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-left">Action</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                          {datas?.map((data)=>(
                             <tr key={data.id}>
                             <td className="p-2 whitespace-nowrap">
                                 <div className="flex items-center">
                                     <div className="font-medium text-gray-800">{data.id}</div>
                                 </div>
                             </td>
                             <td className="p-2 whitespace-nowrap">
                                 <div className="text-left">{data.url.split('/').pop().replace(/-/g, ' ').replace(/_/g, ' ')}</div>
                             </td>
                             <td className="p-2 whitespace-nowrap">
                                 <div className="text-left">{data.file}</div>
                             </td>
                             <td className="p-2 whitespace-nowrap">
                                 <div className="text-left font-medium text-green-500">{new Date(data.added_at).toLocaleString()}</div>
                             </td>
                             <td className="p-2 whitespace-nowrap">
                                 <div className="text-lg text-left">
<button onClick={() => crawl(data.url)} className="group relative py-[5px] px-3 overflow-hidden rounded-xl text-sm bg-green-500 text-white">
 Crawl this property
 <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
</button>
                                 </div>
                             </td>
                         </tr>
                          ))}
                           
                         
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</section>
    </>
  )
}

export default Properties