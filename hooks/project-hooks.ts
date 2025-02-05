"use server"
import { db } from "@/lib/db"
import { Project } from "@/types"
import { CheckUser } from "@/utils"
import { toast } from "sonner"
import {revalidatePath, revalidateTag} from "next/cache"


export async function GetProjects(){
    try {
        const user = await CheckUser()
        if(!user){
            return null
        }

        const userProjects = await db.project.findMany({
            where:{
                userId:user.id
            }
        })

        return userProjects
        
    } catch (error:any) {
        console.log("error", error.message)
        return null
        
    }
}

export async function GetAProject(projectId:string){
    try {
        const user = await CheckUser()
        if(!user){
            return null
        }


        const project = await db.project.findFirst({
            where:{
                id:projectId,
                userId:user.id
            }
        })
        
        return project

        
    } catch (error:any) {
        console.log("error", error.message)
        return null
        
    }
}

export async function CreateProject(data:Project){
    try {

        const user = await CheckUser()
        if(!user){
            return null
        }

       const project =  await db.project.create({
            data:{
                userId:user.id,
                ...data
            }
        })

       console.log("project created", project)
        //  revalidatePath("/dashboard/projects",'page')

        
    } catch (error:any) {
        console.log("error", error.message)
        return null
        
    }
}

export async function UpdateProject(projectId:string, data:Project){
    try {


        const user = await CheckUser()

        if(!user){
            return null
        }

        const checkProject = await db.project.findFirst({
            where:{
                id:projectId,
                userId:user.id
            }
        })

        if(!checkProject){
            return null
        }

        const updatedProject = await db.project.update({
            where:{
                id:projectId,
                userId:user.id
            },
            data:{
                ...data
            }
        })

        
    return updatedProject

        
    } catch (error:any) {
        console.log("error", error.message)
        return null
        
    }
}

export async function DeleteProject(projectId:string){
    try {
        const user = await CheckUser()
        if(!user){
            return null
        }

        const checkProject = await db.project.findFirst({
            where:{
                id:projectId,
                userId:user.id
            }
        })

        if(!checkProject){
            return null
        }

        await db.project.delete({
            where:{
                id:projectId
            }
        })

        return "Project deleted"
        
    } catch (error:any) {
        console.log("error", error.message)
        return null
        
    }
}