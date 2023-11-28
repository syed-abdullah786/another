import React from 'react'
import { useHistory } from "react-router-dom";

function Filter({datas,setShow,jobId}) {
    const history = useHistory();

    const filtered = (name) => {
        if (name == "all") {
          history.push(`/crawl?url=${jobId}`);
        } else {
          history.push(`/crawl?url=${jobId}&filter=${name}`);
        }
        setShow(true);
      };

  return (
    <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[1rem]">
    <div
      onClick={() => {
        filtered("all");
      }}
      className="bg-white drop-shadow-md rounded-lg p-4 sm:p-6 xl:p-8 cursor-pointer"
    >
      <div className="inline-block items-center">
        <div className="flex items-center justify-center">
          <p className="text-xl sm:text-xl leading-none font-bold text-gray-900">
            Total Units:
          </p>
          <p className="text-xl sm:text-xl leading-none font-bold text-gray-900">
            {datas.length}
          </p>
        </div>
      </div>
    </div>
    <div
      onClick={() => {
        filtered("uploaded");
      }}
      className="bg-white drop-shadow-md rounded-lg p-4 sm:p-6 xl:p-8 cursor-pointer"
    >
      <div className="inline-block items-center">
        <div className="flex items-center justify-center">
          <p className="text-xl sm:text-xl leading-none font-bold text-gray-900">
            Uploaded Units:
          </p>
          <p className="text-xl sm:text-xl leading-none font-bold text-gray-900">
            {datas.filter(item => item.status === 'uploaded').length}
          </p>
        </div>
      </div>
    </div>
    <div
      onClick={() => {
        filtered("uploading error");
      }}
      className="bg-white drop-shadow-md rounded-lg p-4 sm:p-6 xl:p-8 cursor-pointer"
    >
      <div className="inline-block items-center">
        <div className="flex items-center justify-center">
          <p className="text-xl sm:text-xl leading-none font-bold text-gray-900">
            Uploading Error:
          </p>
          <p className="text-xl sm:text-xl leading-none font-bold text-gray-900">
            {datas.filter(item => item.status === 'uploading error').length}
          </p>
        </div>
      </div>
    </div>
    <div
      onClick={() => {
        filtered("not found");
      }}
      className="bg-white drop-shadow-md rounded-lg p-4 sm:p-6 xl:p-8 cursor-pointer"
    >
      <div className="inline-block items-center">
        <div className="flex items-center justify-center">
          <p className="text-xl sm:text-xl leading-none font-bold text-gray-900">
            Not Found:
          </p>
          <p className="text-xl sm:text-xl leading-none font-bold text-gray-900">
            {datas.filter(item => item.status === 'not found').length}
          </p>
        </div>
      </div>
    </div>
    <div
      onClick={() => {
        filtered("duplicate listing");
      }}
      className="bg-white drop-shadow-md rounded-lg p-4 sm:p-6 xl:p-8 cursor-pointer"
    >
      <div className="inline-block items-center">
        <div className="flex items-center justify-center">
          <p className="text-xl sm:text-xl leading-none font-bold text-gray-900">
            Duplicate Listing:
          </p>
          <p className="text-xl sm:text-xl leading-none font-bold text-gray-900">
            {datas.filter(item => item.status === 'duplicate listing').length}
          </p>
        </div>
      </div>
    </div>
    <div
      onClick={() => {
        filtered("scraping error");
      }}
      className="bg-white drop-shadow-md rounded-lg p-4 sm:p-6 xl:p-8 cursor-pointer"
    >
      <div className="inline-block items-center">
        <div className="flex items-center justify-center">
          <p className="text-xl sm:text-xl leading-none font-bold text-gray-900">
            Scraping Error:
          </p>
          <p className="text-xl sm:text-xl leading-none font-bold text-gray-900">
            {datas.filter(item => item.status === 'scraping error').length}
          </p>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Filter