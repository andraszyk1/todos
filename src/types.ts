export enum Category  {
    GYM="sport",
    WORK="praca",
    SCHOOL="nauka",
    SCHOPPING="zakupy",
    HOUSE="dom",
}
export enum Mode  {
    PROD="PROD",
    DEV="DEV",
}
export type Task = {
    id:string;
    name: string;
    category: string;
    done:boolean;
}
export const categories=[Category.GYM,Category.WORK,Category.SCHOOL,Category.SCHOPPING,Category.HOUSE]