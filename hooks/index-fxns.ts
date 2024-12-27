
import axios from 'axios'




export const GenerateCertificate = asnyc() => {
 try {

    const request = await axios.post('api/certificates/generate', {
        
    })


    if (request.status === 200){

        return request.data

    }
    return null
    } catch (eror:any) {


        console.log(eror.message)
        return null 
        
    }
    


}