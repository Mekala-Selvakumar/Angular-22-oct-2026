//  interface Employee {
//     id: number;
//     name: string;
//     department: string;
//     salary: number;
// }

// const employee: Employee = {
//     id: 101,
//     name: "Arun",
//     department: "Engineering",
//     salary: 75000,
//  };
interface PaymentProcessor {
    processPayment(amount: number): boolean;
    refundPayment(transactionId: string): void;
}
class CardPaymentProcessor implements PaymentProcessor {

    processPayment(amount: number): boolean {
        console.log(`Processing payment: ${amount}`);
        return true;
    }

    refundPayment(transactionId: string): void {
        console.log(`Refunding transaction: ${transactionId}`);
    }
}
type EmployeeStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE";
let employeeStatus: EmployeeStatus = "ACTIVE"; // This will cause a TypeScript error
console.log(`Employee status: ${employeeStatus}`);

function Logger(target: Function) {
    console.log("Class created:", target.name);
}

@Logger
class Customer{
    constructor(public name: string) {}
}
