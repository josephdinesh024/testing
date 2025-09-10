import { verifyToken } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { hashPassword } from "@/lib/util"
import { headers } from "next/headers"

const res = {
    "status": 0,
    "user": null,
    "message": null
}

export async function GET(req, params) {

    try {

        let data = await prisma.user.findMany({
            orderBy: {
                updated_at: 'desc',
            },
        })
        res.status = 1
        res.user = data
        res.message = null
    } catch (error) {
        res.status = 0
        res.user = null
        res.message = error?.message
    }

    return Response.json(res)
}

export async function POST(req, params) {
    let header = await headers()
    let userId = parseInt(header.get("x-user-id")) || 0
    try {
        if (userId) {
            let user = await prisma.user.findUnique({
                where: {
                    id: userId,
                    role: "admin"
                }
            });

            if (user == null || user?.length <= 0) {
                throw new Error("Permission denied or invalid user")
            }
        } else {
            throw new Error("Missing user id. invalid header")
        }
        
        try {
            let data = await req.json()
            if (data["password"]) {
                data["password"] = hashPassword(data["password"])
            } else {
                throw new Error("Invalid data formate")
            }
            let post = await prisma.user.create({
                data
            })
            res.status = 1
            res.user = post
            res.message = null
        } catch (error) {
            res.status = 0
            res.user = null
            res.message = error?.message
        }

    } catch (error) {
        res.status = 0
        res.user = null
        res.message = error?.message
    }


    return Response.json(res)
}

