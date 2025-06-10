import React from 'react'
import { getPost } from '../api/PostApi';
import { useEffect } from 'react';
import { useState } from 'react';


const Posts = () => {
    const [data,setData]=useState([])
  const getPostData=async () => {
    const res =await getPost();
    console.log(res.data)
    setData(res.data)

};
useEffect(() => {
      getPostData();
  }, []);
  return (
    <div className='px-[44px] py-[30px] bg-lime-200'>
        <ul className='grid grid-cols-3 border-2 '>{
            data.map((curElem) => {
                const {id,title,body}=curElem;
                return <li key={id} className=' gap-2 p-5 border-2 border-blue-300 ' >
                    <h2 className='mt-[10px]'> Title:{title}</h2>
                    <p className='mt-[10px]'>Body :{body}</p>
                    <div className='flex justify-between mt-[20px]'>
                    <button className='px-[10px] py-[4px] rounded-full border-black border-2'>Edit</button>
                    <button className='px-[10px] py-[4px] rounded-full border-black border-2'>Delete</button>
                    </div>
                </li>
                
            })}
        </ul>
    </div>
  )
}

export default Posts