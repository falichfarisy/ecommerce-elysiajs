import axios from "axios"
import { error } from "console";

export const postData = async (endpoint: string, data: Record<string, string>) => {
    try{
        // request GET from API
        const response = await axios.post(endpoint, data);
        
        return response.data;
    } catch (e) {
        console.error(`[POST] Error post data: ${e}`)
        throw error;
    }
}

export const getData = async (endpoint: string) => {
    try{
        const response = await axios.get(endpoint);
        return response.data;
    } catch (e){
        console.error(`[GET] Error get data: ${e}`)
        throw error;
    }
}