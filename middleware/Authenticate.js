
import jwt from "jsonwebtoken";


const authMiddleWare = (request,response,next) =>{
    const authHeader = request.headers.authorization;
    console.log(request.headers)
    if(!authHeader === null || authHeader === undefined){
        return response.status(401).json({
            status:"error",
            message:"Unauthorized"
        })
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token,process.env.JWT_SECRET,(error,user)=>{
        if(error){
            return response.status(403).json({
                status:"error",
                message:"Forbidden"
            })
        }

        request.user = user;
        next();
    })

}

export default authMiddleWare;
