import React, { useState } from 'react'



const Searchinput = ({sendDataToParent}:any) => {

   const [query ,setQuery]=useState<string>("")
   
  

  const  handleSubmit=(e:any)=>{
     e.preventDefault()
      sendDataToParent(query);
    console.log("running")
   }


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="h-auto  inline-flex  " >
                        <div className=" ">
                            <input value={query} onChange={(e)=>setQuery(e.target.value)} type="text" name="search" className=" focus:outline-none  focus:ring-0 focus:ring-blue-500 focus:border-blue-500 w-[800px] ml-[50px] h-11 p-1 " placeholder="Search Your Todo Here" />
                        </div>
                        <div className=" bg-black border  text-white px-4 w-10 h-11 mr-10  flex flex-col items-center justify-center ">
                            <button type='submit' className=" "><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className=" w-7 h-7">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
</svg>
</button>
                        </div>
                        </div>
                        </form>
    </div>
  )
}

export default Searchinput