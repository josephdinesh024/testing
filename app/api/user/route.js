import prisma from "@/lib/prisma"
import { hashPassword } from "@/lib/util"

const res = {
    "status" : 0,
    "user" : null,
    "message" : null
}

export async function GET(req, params) {
    try {

        let data = await prisma.user.findMany({
            orderBy: {
                updatedAt: 'desc',
            },
        })
        res.status = 1
        res.user = data
        res.message = null
    }catch (error) {
        res.status = 0
        res.user = null
        res.message = error?.message
    }

    return Response.json(res)
}

export async function POST(req, params) {
    let userId = req?.user-id
    try {
        let data = await req.json()
        if(data["password"]){
            data["password"] = hashPassword(data["password"])
        }else{
            throw new Error("Invalid data formate")
        }
        let post = await prisma.user.create({
            data
        })
        res.status = 1
        res.user = post
        res.message = null
    }catch (error) {
        res.status = 0
        res.user = null
        res.message = error?.message
    }

    return Response.json(res)
}

