import prisma from "@/lib/prisma"
import { broadcastMessage } from "../../../ws/route"

const res = {
    "status" : 0,
    "post" : null,
    "message" : null
}

export async function GET(req, params) {
    try {
        let pm = await params?.params
        let ID = parseInt(pm?.id) || 0
        if(ID == 0){
            throw new Error("Invalid post id")
        }else{
            let post = await prisma.post.findUnique({
                where:{id:ID}
            })
            if(post == null)
                throw new Error("Invalid post id")
            res.status = 1
            res.post = post
            res.message = null
        }
    }catch (error) {
        res.status = 0
        res.post = null
        res.message = error.message
    }

    return Response.json(res)
}

export async function PUT(req, params) {
    try {

        let data = await req.json()
        let pm = await params?.params
        let ID = parseInt(pm?.id) || 0
        if(ID == 0){
            throw new Error("Invalid post id")
        }else{
            let post = await prisma.post.update({
                where:{id:ID},
                data
            })
            broadcastMessage({"type":"update",post})
            res.status = 1
            res.post = post
            res.message = null
        }
    }catch (error) {
        res.status = 0
        res.post = null
        res.message = error.message
    }

    return Response.json(res)
}