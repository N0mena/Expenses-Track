import { useState } from "react";
import "tailwindcss";

function ExpenseForm() {
  const [recurring, setRecurring] = useState(false);
  const [ saved, setSaved ] = useState(false);
  const [ cancelled, setCancelled ] = useState(false)


  return (
    <>
      <div className="flex flex-col items-center text-black place-content-center mt-10 ">
        <div className="flex flex-col p-3 w-100 rounded-xl border-2 border-gray-400 shadow-md ">
          <h1 className="flex  flex-col items-center mb-3 text-2xl ">
            Add expense{" "}
          </h1>
          <hr />
          <div className="">
            <p> Type : </p>
            <div className="flex w-full place-content-center gap-3 m-1">
              <button
                type="button" 
                className=" box-border px-4 py-1 border-gray-300 shadow-sm hover:border-2 hover:py-0.5 hover:px-3.5 focus:bg-gray-300 bg-white rounded-sm "
                onClick={() => setRecurring(false)}
              >
                {" "}
                One-time{" "}
              </button>
              <button
                type="button"
                className=" box-border px-4 py-1 border-gray-300 shadow-sm hover:border-2 hover:py-0.5 hover:px-3.5 focus:bg-gray-300 bg-white rounded-sm "
                onClick={() => setRecurring(true)}
              >
                {" "}
                Recuring{" "}
              </button>
            </div>
          </div>
          <hr />
          <div className=" w-full place-content-end m-1">
            <p>Creation Date </p>
          </div>
          <div>
            <div className=" w-full place-content-between m-1">
              <p>Title</p>
              <input
                type="text"
                name=""
                id=""
                className=" rounded-md w-full p-0.5 pl-2 bg-gray-200 focus:outline-1 "
              />
            </div>
            <div className=" w-full place-content-between m-1">
              <p>Amount</p>
              <input
                type="text"
                name=""
                id=""
                className=" rounded-md w-full p-0.5 pl-2 bg-gray-200 focus:outline-1 border-b-cyan-300"
              />
            </div>
            <div className=" w-full place-content-between m-1">
              <p>Description</p>
              <textarea
                type="text"
                name=""
                id=""
                className=" rounded-md w-full p-0.5 pl-2 bg-gray-200 focus:outline-1"
              />
            </div>

            {recurring && (
              <>
                <div className=" w-full place-content-between m-1">
                  <p> Start date </p>
                  <input
                    type="date"
                    name=""
                    id=""
                    className=" rounded-md w-full p-0.5 pl-2 bg-gray-200 focus:outline-1"
                  />
                </div>
                <div className=" w-full place-content-between m-1">
                  <p> End date </p>
                  <input
                    type="date"
                    name=""
                    id=""
                    className=" rounded-md w-full p-0.5 pl-2 bg-gray-200 focus:outline-1"
                  />
                </div>
              </>
            )}
            <hr className="mt-5" />
            <div className="flex place-content-between  ">
              <p>Category</p>
              <select
                name=""
                id=""
                className="block text-base bg-gray-200  text-gray-700 m-1 p-1 border-gray-300 rounded-md shadow-sm focus:outline-1"
              ></select>
            </div>
            <hr />
            <div className="flex w-full place-content-end m-1">
              <button
                type="button"
                className="mx-2 mt-2 px-5 py-1.5 rounded-md border-gray-300 shadow-sm bg-gray-200"
              >
                Save
              </button>
              <button
                type="button"
                className="mt-2 px-5 py-1.5 rounded-md border-gray-300 shadow-sm bg-red-300"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ExpenseForm;
