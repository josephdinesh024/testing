import prisma from "@/lib/prisma"
import { broadcastMessage } from "../../ws/route"

const res = {
    "status" : 0,
    "post" : null,
    "message" : null
}

export async function GET(req, params) {
    try {

        let data = await prisma.post.findMany({
            orderBy: {
                updated_at: 'desc',
            },
        })
        res.status = 1
        res.post = data
        res.message = null
    }catch (error) {
        res.status = 0
        res.post = null
        res.message = error?.message
    }

    return Response.json(res)
}

