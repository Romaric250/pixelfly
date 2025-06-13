"use server"
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function CheckUser(){
    try {
        const session = await auth.api.getSession({
            headers: new Headers()
        });

        if (!session) {
            return null;
        }

        const isUserInDb = await db.user.findFirst({
            where:{
                id: session.user.id
            }
        })

        if(!isUserInDb){
            return null
        }

        return isUserInDb

    } catch (error:any) {
        console.log(error.message)
        return null;
    }
}