import { useState } from "react";

function colorChangingButton () {
 const [isActive, setIsActive] = useState(false)
 
    const handleClick = () =>{
        setIsActive(!isActive)
    }

    return(
        <>
        <button type="button" 
        onClick={handleClick}
        className={"box-border px-4 py-1 border-gray-300 shadow-sm hover:border-2 hover:py-0.5 hover:px-3.5 focus:bg-gray-300 bg-white rounded-sm ${isActive ? 'bg-white' : 'bg-gray-300'}" }>
        </button>
            
        </>
    )
}
export default colorChangingButton;