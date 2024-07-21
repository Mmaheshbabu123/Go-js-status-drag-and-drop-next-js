"use client"
import React, { Suspense ,useEffect,useState,useRef } from 'react';
// export  async function getServerSideProps() {
//   const res = await fetch('https://jsonplaceholder.typicode.com/todos');
//
//   const data = await res.json();
//   data.push({'id':Math.random().toString().split(".")[1]?.toLowerCase(),'title':'new2'});
//   return {
//     props:{
//       todos:data,
//     }
//   }
// };
export default function Ssrexample ({}) {
 const [todos,setTodos] = useState([]);
  useEffect(()=>{

    const fetchTodos = async()=>{
      setTimeout(async ()=> {
        const res = await fetch('https://jsonplaceholder.typicode.com/todos');
        const data = await res.json();
        setTodos(data);
      },1000)


    }
    fetchTodos();
  },[])
  return(
    <>
    {todos?.length === 0 ? (<div>Loading...</div>):(todos?.map((item)=>(
           <div id = {item.id}>
           <p>{item.id}:{item.title}</p>
           </div>
         )))
       }


     </>



  );
}
