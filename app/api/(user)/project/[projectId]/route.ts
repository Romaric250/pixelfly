import { CheckUser } from "@/utils"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PUT(req:Request, {params}:{params:Promise<{projectId:string}>}){
    try {
        const {projectId} = await params
        const {data} = await req.json()

        const user = await CheckUser()
        if(!user){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const checkProject = await db.project.findFirst({
            where:{
                id:projectId, 
                userId:user.id
            }
        })

        if(!checkProject){
            return new NextResponse("Project not found", {status: 404})
        }

        await db.project.update({
            where:{
                id:projectId,
                userId:user.id
            },
            data:{
                ...data
            }
        })

        return new NextResponse("Project updated", {status: 200})
    } catch (error:any) {
        console.log("error", error.message)
        return new NextResponse("internal server error", {status: 500})
        
    }
}


export async function GET(req:Request, {params}:{params:Promise<{projectId:string}>}){
    try {
        const {projectId} = await params
        const user = await CheckUser()

        if(!user){
            return new NextResponse("Unathorized", {status: 401})
        }

        const project = await db.project.findFirst({
            where:{
                id:projectId,
                userId:user.id
            }
        })

    return new NextResponse(JSON.stringify(project), {status: 200})
        
    } catch (error:any) {
        console.log(error.message) 
        return new NextResponse("Internal server error", {status: 500})

        
    }
}

export async function DELETE(req:Request, {params}:{params:Promise<{projectId:string}>}){
    try {

        const user = await CheckUser()
        const {projectId} = await params
        if(!user){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const checkProject = await db.project.findFirst({
            where:{
                id:projectId,
                userId:user.id 
            }
        })

        if(!checkProject){
            return new NextResponse("Project not found", {status: 404})
        }

        await db.project.delete({
            where:{
                id:projectId,
                userId:user.id
            }
        })
        
        return new NextResponse("Project deleted", {status: 200})
    } catch (error:any) {
        console.log(error.message)
        return new NextResponse("internal server error", {status: 500})
        
    }

}