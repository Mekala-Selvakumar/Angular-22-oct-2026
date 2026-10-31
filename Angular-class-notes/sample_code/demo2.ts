let employeeName: string = "Arun";
let age: number = 30;
let isActive: boolean = true;

//age="Hello"; // This will cause a TypeScript error because 'age' is of type number

let company = "ABC Technologies";
let employeeCount = 250;
 
company = "XYZ Technologies"; // Valid

// Compile-time error:
 //company = 100;

 let salaries: number[] = [45000, 55000, 65000];

salaries.push(70000); // Valid

// Compile-time error:
// salaries.push("80000");

let departmentNames: Array<string> = [
    "Engineering",
    "Finance",
    "Human Resources"
];

for (let i = 0; i < departmentNames.length; i++) {
    console.log(departmentNames[i]);
}
for (const department of departmentNames) {
    console.log(department);
}

