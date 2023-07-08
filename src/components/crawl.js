import React, { useEffect, useState, useRef }  from 'react'
import axios from 'axios';
import { useLocation,useHistory } from 'react-router-dom';
function Crawl() {
    const location = useLocation();
    const history = useHistory();
    const [datas,setDatas] = useState([])
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const data = queryParams.get('url');
        axios.post("http://127.0.0.1:8000/crawl/",data).then(response=>{
            setDatas(response.data)
            console.log(response)
          }).catch(e =>{
            console.log('hell',e)
          })
         
       },[]);
       const crawl=(data)=>{
        history.push(`/edit?url=${data}`)
      }
  return (
    <>
    <section className="antialiased bg-gray-100 text-gray-600 h-screen px-4">
        <div className="flex flex-col justify-center py-8">
            <div className="w-full bg-white shadow-lg rounded-sm border border-gray-200">
                <header className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800 text-2xl">Scraped Data</h2>
                </header>
                <div className="p-3">
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full">
                            <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                                <tr>
                                    <th className="p-2 whitespace-nowrap">
                                        <div className="font-semibold text-left">Title</div>
                                    </th>
                                    <th className="p-2 whitespace-nowrap">
                                        <div className="font-semibold text-left">Url</div>
                                    </th>
                                    <th className="p-2 whitespace-nowrap">
                                        <div className="font-semibold text-left">Edit</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-gray-100">
                               {datas?.map((data)=>(
                                <tr>
                                <td className="p-2 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="font-medium text-gray-800">{data.title}</div>
                                    </div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                    <div className="text-left">{data.url}</div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                    <div className="text-lg text-left">
                                <button  onClick={() => crawl(data.url)} className="group relative py-[5px] px-3 overflow-hidden rounded-xl text-sm bg-green-500 text-white">
                                    Edit
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

export default Crawl