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
    const [show,setShow] = useState(true)
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const data = queryParams.get('url');
        axios.post("http://127.0.0.1:8000/edit/",data).then(response=>{
            setInfo(response.data)
            setShow(false)
          }).catch(e =>{
            console.log(e)
          })
         
       },[]);
       const open=(k,v)=>{
        setKey(k)
        setValue(v)
        setModal(true)
       }
       const confirm=()=>{
        console.log(info)
        setInfo({...info,[key]:value})
        setModal(false)
       }
       const upload=()=>{
        axios.post("http://127.0.0.1:8000/update/",info).then(response=>{
            console.log(response.data)
       })}
  return (
    <>
    {show ? (<div class="flex items-center justify-center h-screen"><div role="status">
    <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only">Loading...</span>
</div></div>) : (<>       {modal && <div className="another-modal fixed w-full inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster bg-[#ababab73]">
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
                    <form id="add_caretaker_form"  className="w-full">
                        <div className="">
                            <div className="">
                                <label for="names" className="text-md text-gray-600">{key}</label>
                            </div>
                            <div className="">
                                <input type="text" value={value} onChange={(e)=>setValue(e.target.value)} name="names" className="h-3 p-6 w-full border-2 border-gray-300 mb-5 rounded-md" />
                            </div>
                        </div>
                    </form>
				</div>
				<div className="flex justify-end pt-2 space-x-14">
					<button
						className="px-4 bg-gray-200 p-3 rounded text-black hover:bg-gray-300 font-semibold" onClick={()=> setModal(false)}>Cancel</button>
					<button
						className="px-4 bg-blue-500 p-3 ml-3 rounded-lg text-white hover:bg-teal-400" onClick={()=> confirm()} >Confirm</button>
				</div>
			</div>
		</div>
	</div>} 






    <section className="antialiased bg-gray-100 text-gray-600 px-4">
        <div className="flex flex-col justify-center py-8">
            <div className="w-full bg-white shadow-lg rounded-sm border border-gray-200">
                <header className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800 text-2xl">Unit detail data</h2>
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
                            {info && Object.keys(info).map((key) => (
                            (key != 'Image_Path' && key != 'Image_Urls') ? (
                                <tr key={key}>
                                     {console.log('key',key)}
                                 <td className="p2"> 
                                     <div className="flex items-center">
                                         <div className="font-medium text-gray-800 capitalize">{key.replace(/_/g, ' ')}</div>
                                     </div>
                                 </td>
                                 <td className="p-2 max-w-[400px]">
                                 {key === 'amenities' ? <div className="text-left">{info[key].join(', ')}</div> : <div className="text-left">{info[key]}</div>}
                                     {/* <div className="text-left">{info[key]}</div> */}
                                 </td>
                                 <td className="p-2">
                                 {(key === 'amenities' || key === 'description') ? null :  (<div className="text-lg text-left">
                                 <button onClick={()=> open(key,info[key])} className="group relative py-[5px] px-3 overflow-hidden rounded-xl text-sm bg-green-500 text-white">
                                     Edit
                                     <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                                 </button>
                                     </div>)}
                                    
                                 </td>
                             </tr>
                            ) : null
                            ))}




                            {/* {info && Object.keys(info).map((key) => (
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
                            ))} */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div>
                

            {/* <div id="accordion-open" data-accordion="open"> */}
  {/* <h2 id="accordion-open-heading-1">
    <button type="button" className="bg-white flex items-center justify-between w-full p-3 font-medium text-left text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" data-accordion-target="#accordion-open-body-1" aria-expanded="true" aria-controls="accordion-open-body-1">
      <span className="flex items-center"><svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>Image Urls</span>
      <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
      </svg>
    </button>
  </h2>
  <div id="accordion-open-body-1" className="hidden" aria-labelledby="accordion-open-heading-1">
    <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
      <p className="mb-2 text-gray-500 dark:text-gray-400">{info?.Image_Urls.split(',')}</p>
      </div>
  </div> */}
  {/* <h2 id="accordion-open-heading-2">
    <button type="button" className="bg-white flex items-center justify-between w-full p-3 font-medium text-left text-gray-500 border border-b-0 border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" data-accordion-target="#accordion-open-body-2" aria-expanded="false" aria-controls="accordion-open-body-2">
      <span className="flex items-center"><svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>Image path</span>
      <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
      </svg>
    </button>
  </h2>
  <div id="accordion-open-body-2" className="hidden" aria-labelledby="accordion-open-heading-2">
    <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700">
      <p className="mb-2 text-gray-500 dark:text-gray-400">{info?.Image_Path}</p>
         </div>
  </div> */}
  {/* <h2 id="accordion-open-heading-3">
    <button type="button" className="bg-white flex items-center justify-between w-full p-3 font-medium text-left text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" data-accordion-target="#accordion-open-body-3" aria-expanded="false" aria-controls="accordion-open-body-3">
      <span className="flex items-center"><svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>Description</span>
      <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
      </svg>
    </button>
  </h2>
  <div id="accordion-open-body-3" className="hidden" aria-labelledby="accordion-open-heading-3">
    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
      <p className="mb-2 text-gray-500 dark:text-gray-400">{info?.description}</p>
      
    </div>
  </div>
  <h2 id="accordion-open-heading-4">
    <button type="button" className="bg-white flex items-center justify-between w-full p-3 font-medium text-left text-gray-500 border border-gray-200 focus:ring-4 rounded-b-xl focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" data-accordion-target="#accordion-open-body-4" aria-expanded="false" aria-controls="accordion-open-body-4">
      <span className="flex items-center"><svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>Amenities</span>
      <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
      </svg>
    </button>
  </h2>
  <div id="accordion-open-body-4" className="hidden" aria-labelledby="accordion-open-heading-4">
    <div className="p-5 border border-t-0 border-gray-200 dark:border-gray-700">
      <p className="mb-2 text-gray-500 dark:text-gray-400">{info?.amenities}</p>
      
    </div>
  </div>
</div> */}


            <button onClick={()=> upload()} className="group float-right m-4 relative py-[5px] px-7 overflow-hidden rounded-xl text-sm bg-green-500 text-white">
                                     Upload
                                     <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                                 </button>
                                 </div>
        </div>
    </section></>)}


        </>
  )
}

export default Edit