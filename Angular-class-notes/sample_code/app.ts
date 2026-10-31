//  import { Employee, getEmployeeName, COMPANY_NAME } from "./employee-utils";
// //named export and import - it use {}
// const employee: Employee = {
//     id: 101,
//     name: "Arun"
// };

//console.log(employee.name);

//Importing with an alias
import { Employee as Staff } from "./employee-utils";
const staff: Staff = {
    id: 101,
    name: "Arun"
};
console.log(staff.name);

//default export and import - it use default keyword
import Product from "./product";

const product = new Product(1, "Laptop", 1500);
product.displayDetails();
console.log(`Discounted Price: ${product.calculateDiscount(10)}`);

//Importing default export with an alias
import  MyProduct from "./product";
const product1 = new MyProduct(1, "Laptop", 1500);
product1.displayDetails();
console.log(`Discounted Price: ${product1.calculateDiscount(10)}`);


