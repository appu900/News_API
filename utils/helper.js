import { supportedMimes } from "../config/fileSystem.js";
import {v4 as uuid} from "uuid";





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

