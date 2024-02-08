import React from 'react'

function Field(props) {
  return (
   <input type={props.type} name={props.name} onChange={(e)=>{props.onChange(e)}} className='w-[360px] h-[45px] text-xl border-2 px-[15px] rounded-xl shadow-sm py-[2px] placeholder-[#878787] border-[#fffff]' placeholder={props.placeholder} />
  )
}

export default Field
