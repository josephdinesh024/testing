"use client"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react"


export default function PostByIDPage({params}){
    let [post,setPost] = useState({})
        const router = useRouter();
    let pm = use(params)
    useEffect(()=>{
        let ID = pm?.id
        fetch("/api/post/"+ID)
        .then(res => res.json())
        .then(data =>{
            console.log(data?.post)
            if(data?.status)
                setPost(data?.post)
            else
                router.push("/")
        })
    },[])
    return <>
    <div className="m-20">
        <div id="Posts">
            {Post(post)}
        </div>
    </div>
    </>
}

const Post = (props)=>{

    return<div key={props?.id} className="p-4">
            <Link href={`/post/${props?.id}`}><h3 className="font-medium text-xl">{props?.title}</h3></Link>
            <p className="md:text-lg p-3">{props?.content}</p>
        </div>
}