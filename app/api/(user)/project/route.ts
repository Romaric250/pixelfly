import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { CheckUser } from "@/utils";
import { log } from "node:console";

export async function POST(req:Request){
    try {

        
        const {data} = await req.json()
        const user = await CheckUser()

        if(!user){
            return new NextResponse("Unauthorized", {status: 401})
        }

       
        await db.project.create({
            data:{
                ...data,
                userid:user.id    
            }
        })


        
    } catch (error:any) {
       console.log("error", error.message)
       return new NextResponse("internal server error", {status: 500})
        
    }
}


export async function GET(req:Request){
    try {

        const user = await CheckUser()
        if (!user){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const userProjects = await db.project.findMany({
            where:{
                userId:user.id
            }
        })

        return new NextResponse(JSON.stringify(userProjects), {status:200})  
        
    } catch (error:any) {
        console.log("error", error.message);
        return new NextResponse("internal server error", {status: 500})
        
    }
}