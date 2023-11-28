import React, {useRef} from 'react'

function Scrapall({data,setData,setCheckedItems}) {
    const scrapCheckboxRef = useRef(null);

    const scrapAll = () => {
        if (scrapCheckboxRef.current.checked) {
          const updatedArray = data.map((item) => {
            if (item.status === "new") {
              return { ...item, status: "pending" };
            }
            return item;
          });
          setData(updatedArray);
          setCheckedItems(updatedArray);
        } else {
          const updatedArray = data.map((item) => {
            if (item.status === "pending") {
              return { ...item, status: "new" };
            }
            return item;
          });
          setData(updatedArray);
          setCheckedItems([]);
        }
      };

  return (
    <label className="flex font-bold float-right flex items-center relative w-max cursor-pointer select-none">
                      Scrap All&nbsp;&nbsp;
                      <input
                        type="checkbox"
                        onChange={() => scrapAll()}
                        ref={scrapCheckboxRef}
                        className="input appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 bg-red-500"
                      />
                      <span className="absolute font-medium text-xs uppercase right-1 text-white">
                        {" "}
                        NO
                      </span>
                      <span className="absolute font-medium text-xs uppercase right-8 text-white">
                        {" "}
                        YES{" "}
                      </span>
                      <span className="w-7 h-7 right-7 absolute rounded-full transform transition-transform bg-gray-200" />
                    </label>
  )
}

export default Scrapall