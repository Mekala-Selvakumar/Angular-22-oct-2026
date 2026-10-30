import { Department } from "./department";
import { Skill } from "./skill";

 
export interface Employee {
    id: number;
    name: string;
    email: string;
    permanent: boolean;
    department: Department;
    skills: Skill[];
}
