import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import Add from "./refresh/refresh";
import DataTable from "react-data-table-component";
import { toast, Slide } from "react-toastify";

function Schedule() {
  return (
    <>
    <h1 className="text-2xl font-mono text-red-600 m-8">
    Schedule Listing Upload
  </h1>

  <div className="overflow-x-auto">
    <div className="min-w-screen flex items-center justify-center font-sans overflow-hidden">
      <div className="w-full lg:w-5/6">
        <div className="flex items-center justify-between">
          <div></div>
          <div>
            {/* <Add data={data} setData={setData} /> */}
          </div>
        </div>
        <DataTable
        //   columns={columns}
        //   data={data}
          pagination
          highlightOnHover
          fixedHeader
        />
      </div>
    </div>
  </div>
  </>
  )
}

export default Schedule