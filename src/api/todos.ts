import axios from "axios";
import { todosUrl } from "./config";
import { Task } from "../types";
export async function apiGetTodos(){
try {
    const response=await axios.get(todosUrl)
    console.log(response);
    return response.data
    
} catch (error) {
    throw new Error("Błąd pobierania zadań ")
}    
}
export async function apiAddTodo(todo:Task):Promise<Task>{
    const {id,...rest}=todo
    console.log(rest);
    
try {
    const response=await axios.post(todosUrl,JSON.stringify(rest))
    console.log(response);
    return response.data
    
} catch (error) {
    throw new Error("Błąd dodawania zadania ")
}    
}
export async function apiDeleteTodo(id:string):Promise<void>{
try {
    const response = await axios.delete(`${todosUrl}/${id}`);
    console.log(response);
    
} catch (error:any) {
    console.error("Błąd usuwania zadania:", error.message);
    throw new Error(error.response?.data?.message || "Nie udało się usunąć zadania");
}    
}