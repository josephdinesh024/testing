import { generateToken } from "@/lib/auth";
import prisma from "@/lib/prisma"
import { isPasswordCorrect } from "@/lib/util";


const res = {
    status : 0,
    user : null,
    message: null
}

export async function POST(req, params) {
    let data = await req.json()
    try {
        if(data?.email == "" || data?.password == ""){
            throw new Error("Invalid data format.")
        }
        let user = await prisma.user.findUnique({
            where : {
                email : data?.email
            }
        });

        if(user == null || user?.length <= 0){
            throw new Error("Invalid user email id.")
        }else if(await isPasswordCorrect(data?.password, user?.password)){
            let accessToken  = await generateToken(user?.id)
            res.status = 1
            res.user = user
            res.message = null
            res["access_token"] = accessToken
        }else{
            throw new Error("Invalid user password.")
        }
    } catch (error) {
        res.status = 0
        res.user = null
        res.message = error?.message
    }

    return Response.json(res)
}