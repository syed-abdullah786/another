import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import Add from "./refresh/refresh";
import DataTable from "react-data-table-component";
import { toast, Slide } from "react-toastify";

function Refresh() {
  const [data, setData] = useState("");
  const [show, setShow] = useState(true);
  const [user, setUser] = useState(true);


  useEffect(() => {
    axios
      .get("http://18.191.139.138:90/refresh/")
      .then((response) => {
        const newData = response.data?.map((item) => {
          const matchedUser = user?.length > 0 ? user?.find((u) => u?.id === item?.reality_user[0]): null;
          return { ...item, username: matchedUser ? matchedUser.username : '' };
        });
        setData(newData);
        setShow(false);
      })
      .catch((e) => {
        notify22(e.message, "error");
      });
  }, [user]);

  useEffect(() => {
    axios
      .get("http://18.191.139.138:90/get_users/")
      .then((response) => {
        setUser(response.data);
      })
      .catch((e) => {
        notify22("Not Updated", "error");
      });
  }, []);

  const columns = [
    {
      name: "ID",
      selector: (row) => row?.id,
      width: "9%",
    },
    {
      name: "Refresh At",
      selector: (row) => {
        return <p>{readable(row?.refresh_at)}</p>;
      },
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row?.status,
      sortable: true,
    },
    {
      name: "User",
      selector: (row) => row?.username,
  }
  ];

  const readable = (datetime) => {
    const date = new Date(datetime);

    // Format the date to a user-readable format (e.g., "November 23, 2023")
    const options = { year: "numeric", month: "long", day: "numeric" };
    const userReadableDate = date.toLocaleDateString("en-US", options);

    // Format the time to a user-readable format (e.g., "12:00:00 AM")
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const userReadableTime = date.toLocaleTimeString("en-US", timeOptions);

    // Combine the date and time
    return `${userReadableDate} ${userReadableTime}`;
  };
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
          <h1 className="text-2xl font-mono text-red-600 m-8">
            Refresh Listing Data
          </h1>

          <div className="overflow-x-auto">
            <div className="min-w-screen flex items-center justify-center font-sans overflow-hidden">
              <div className="w-full lg:w-5/6">
                <div className="flex items-center justify-between">
                  <div></div>
                  <div>
                    <Add data={data} setData={setData} />
                  </div>
                </div>
                <DataTable
                  columns={columns}
                  data={data}
                  pagination
                  highlightOnHover
                  fixedHeader
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Refresh;
