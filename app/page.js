"use client"
import Link from "next/link"
import { useEffect, useState } from "react"


export default function PostPage(){
    let [post,usePost] = useState([])
    useEffect(()=>{
        fetch("/api/post")
        .then(res => res.json())
        .then(data =>{
            usePost(data?.post || [])
        })
    },[])

    useEffect(() => {
      const evtSource = new EventSource("/api/ws");

      evtSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
          if(data?.type == "new"){
            usePost((p) => [data?.post,...p])
          }else if (data?.type == "update"){
            let post = data?.post
            let innerDiv = document.getElementById(`post-${post?.id}`)
            if(innerDiv){
              usePost((p)=>{
                return [...p.filter(elm => elm?.id != post?.id),post]
              })
            }
          }
      };

      evtSource.onerror = (err) => {
        console.error("SSE error:", err);
      };

      return () => {
        evtSource.close();
      };
    }, []);
    return <>
    <div className="mx-40 mt-20">
        <h1 className="font-medium text-2xl">Psots</h1>
        <div id="Posts">
            {post.map((elm,index) =>{return Post(elm,index)})}
        </div>
    </div>
    </>
}

const Post = (props,index)=>{

    return<div key={index} id={"post-"+props?.id} className="p-4 w-3/4">
            <Link href={`/${props?.id}`}><h3 className="font-medium text-lg">{props?.title}</h3></Link>
            <p>{props?.content.substring(0,200)}...</p>
        </div>
}
