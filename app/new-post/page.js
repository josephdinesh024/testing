"use client"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function NewPostPage(){
    let [post,usePost] = useState([])
    useEffect(()=>{
        fetch("/api/post")
        .then(res => res.json())
        .then(data =>{
            usePost(data?.post || [])
        })
    },[])

    const FormSubmit = async(e)=>{
        e.preventDefault()
        let forms = new FormData(e.target)
        let title = forms.get("title")
        let content = forms.get("content")
        if(title != "" && content != ""){
            try {
                let res = await fetch("/api/post",{
                    method:"POST",
                    body:JSON.stringify({
                        title,content
                    })
                });
                let data = await res.json()
                if(data?.status){
                    usePost([data?.post,...post])
                }else{
                    console.log("Error",data?.message)
                }
            } catch (error) {
                console.log(error)
            }
        }else{
            console.log("Error: Missing importent data. Invalid data format.")
        }
    }

    return<>
    <div className="mx-36 mt-20">
        <div className="grid md:grid-cols-2">
            <div id="Posts">
                {post.map((elm,index) =>{return Post(elm,index)})}
            </div>
            <div id="forms">
                <form onSubmit={(e)=>FormSubmit(e)}>
                    <h1 className="font-semibold text-2xl">New Post Form</h1>
                    <div className="p-4">
                        <label htmlFor="title" className="font-medium text-xl">Post Title:</label>
                        <input type="text" id="title" name="title" placeholder="title" className="p-3 mt-2 focus:outline-none border rounded-lg w-full"/>
                    </div>
                    <div className="p-4">
                        <label htmlFor="content" className="font-medium text-xl">Post Title:</label>
                        <textarea id="content" name="content" placeholder="Post content" rows={5} className="p-3 mt-2 focus:outline-none border rounded-lg w-full"></textarea>
                    </div>
                    <div className="flex justify-end mt-3">
                        <button className="px-8 py-3 font-medium border rounded-xl hover:bg-gray-100 cursor-pointer">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    </>
}

const Post = (props,index)=>{

    return<div key={index} id={"post-"+props?.id} className="p-4 w-3/4 border shadow-xl rounded-2xl my-3">
            <Link href={`/${props?.id}`}><h3 className="font-medium text-lg">{props?.title}</h3></Link>
            <p>{props?.content.substring(0,150)}...</p>
        </div>
}