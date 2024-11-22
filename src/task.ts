import { Category } from "./types";

export class Task {
  id?:number;
  name: string;
  category: Category;
  done:boolean;
  constructor(id:number,name: string, category: Category, done: boolean) {
    this.name = name;
    this.category = category;
    this.done = done;
    this.id = id;
    
  }
}
