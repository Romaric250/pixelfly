import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";


export async function CheckUser(){
    try {
        const user = await currentUser()
        if (!user){
            return null
        }
        const isUserInDb = await db.user.findFirst({
            where:{
                clerkId:user.id as string
            }
        })
        if(!isUserInDb){
            return null
        }

        return isUserInDb

        
    } catch (error:any) {
        console.log(error.message)
        
    }
}