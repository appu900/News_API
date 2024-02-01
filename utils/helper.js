import { supportedMimes } from "../config/fileSystem.js";
import {v4 as uuid} from "uuid";
import fs from "fs";





export const imageValidator = (size,mimetype) =>{
    if(bytesToMb(size) > 3){
        return "Image size should not be greater than 3mb"
    }
    else if(!supportedMimes.includes(mimetype)){
        return "Invalid image format"
    }
}


export const bytesToMb = (bytes) =>{
    return bytes/(1024 * 1024)
}


export const generateRandomNumber = () =>{
    let randomNumber =  uuid();
    return randomNumber;
}


export const getImageUrl = (imgName) =>{
    return `${process.env.APP_URL}/images/${imgName}`
}




export const removeImage = (imageName) => {
     const path = process.cwd() + "/public/images/" + imageName;
     if(fs.existsSync(path)){
        fs.unlinkSync(path);
     }
}


export const uploadImage = (image) =>{
    const imgExt = image?.name.split(".");
    const imageName = generateRandomNumber() + "." + imgExt[1];
    const uploadPath = process.cwd() + "/public/images/" + imageName;
    image.mv(uploadPath, (error) => {
        if (error) throw error;
    });

    return imageName;
}

