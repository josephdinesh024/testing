import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/util";

const res = {
    "status" : 0,
    "user" : null,
    "message" : null
}

export async function GET(params) {
    try{
        let user = await prisma.user.findFirst()
        let data = {
            name: process.env.USER_NAME,
            email: process.env.USER_EMAIL,
            role : "admin",
            password: await hashPassword(process.env.USER_PASSWORD || "admin@123"),
        }

        if(user == null || user?.length <= 0){
            user = await prisma.user.create({data});

            res.status = 1
            res.user = user
            res.message = "Database seeded successfully"
        }else{
            res.status = 1
            res.user = null
            res.message = "Seeding skiped."
        }
    }catch(error){
        res.status = 0
        res.user = null
        res.message = error?.message
    }

    return Response.json(res)
}