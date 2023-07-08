import React, { useEffect, useState, useRef }  from 'react'
import axios from 'axios';
import { useLocation,useHistory } from 'react-router-dom';

function Edit() {
    const location = useLocation();
    const history = useHistory();
    const [info , setInfo] = useState()
    const [modal , setModal] = useState(false)
    const [key , setKey] = useState('')
    const [value , setValue] = useState('')
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const data = queryParams.get('url');
        axios.post("http://127.0.0.1:8000/edit/",data).then(response=>{
            setInfo(response.data)
            console.log('error',response)
          }).catch(e =>{
            console.log('hell',e)
          })
         
       },[]);
       const open=(k,v)=>{
        setKey(k)
        setValue(v)
        setModal(true)
       }
  return (
    <>
       {modal && <div className="another-modal fixed w-full inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster bg-[#ababab73]">
		<div className="border border-blue-500 shadow-lg modal-container bg-white w-4/12 md:max-w-11/12 mx-auto rounded-xl shadow-lg z-50 overflow-y-auto">
			<div className="modal-content py-4 text-left px-6">
				<div className="flex justify-between items-center pb-3">
					<p className="text-2xl font-bold text-gray-500">Edit {key}</p>
					<div className="modal-close cursor-pointer z-50" onClick={()=> setModal(false)}>
						<svg className="fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
							viewBox="0 0 18 18">
							<path
								d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z">
							</path>
						</svg>
					</div>
				</div>
				<div className="my-5 mr-5 ml-5 flex justify-center">
                    <form method="POST" id="add_caretaker_form"  className="w-full">
                        <div className="">
                            <div className="">
                                <label for="names" className="text-md text-gray-600">{key}</label>
                            </div>
                            <div className="">
                                <input type="text" value={value} onChange={(e)=>setValue(e)} name="names" className="h-3 p-6 w-full border-2 border-gray-300 mb-5 rounded-md" />
                            </div>
                        </div>
                    </form>
				</div>
				<div className="flex justify-end pt-2 space-x-14">
					<button
						className="px-4 bg-gray-200 p-3 rounded text-black hover:bg-gray-300 font-semibold" onClick={()=> setModal(false)}>Cancel</button>
					<button
						className="px-4 bg-blue-500 p-3 ml-3 rounded-lg text-white hover:bg-teal-400" >Confirm</button>
				</div>
			</div>
		</div>
	</div>} 






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
                                        <div className="font-semibold text-left">Key</div>
                                    </th>
                                    <th className="p-2 whitespace-nowrap">
                                        <div className="font-semibold text-left">Value</div>
                                    </th>
                                    <th className="p-2 whitespace-nowrap">
                                        <div className="font-semibold text-left">Edit</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-gray-100">
                            {info && Object.keys(info).slice(0, -2).map((key) => (
                                 <tr key={key}>
                                 <td className="p-2 whitespace-nowrap"> 
                                     <div className="flex items-center">
                                         <div className="font-medium text-gray-800 capitalize">{key.replace(/_/g, ' ')}</div>
                                     </div>
                                 </td>
                                 <td className="p-2 whitespace-nowrap">
                                     <div className="text-left">{info[key]}</div>
                                 </td>
                                 <td className="p-2 whitespace-nowrap">
                                     <div className="text-lg text-left">
                                 <button onClick={()=> open(key,info[key])} className="group relative py-[5px] px-3 overflow-hidden rounded-xl text-sm bg-green-500 text-white">
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

export default Edit