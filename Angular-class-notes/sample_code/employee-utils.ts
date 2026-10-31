export interface Employee {
    id: number;
    name: string;
}

export function getEmployeeName(employee: Employee): string {
    return employee.name;
}

export const COMPANY_NAME = "ABC Technologies";
