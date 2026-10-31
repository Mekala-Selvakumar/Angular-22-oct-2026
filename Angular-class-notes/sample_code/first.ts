// type Status = "pending" | "approved" | "rejected";

// let status1: Status = "approved";
// console.log(status1);
// switch (status1 as Status) {
//     case "pending":
//         console.log("Awaiting approval");
//         break;

//     case "approved":
//         console.log("Request approved");
//         break;

//     case "rejected":
//         console.log("Request rejected");
//         break;
// }

//let - block level scope
for (let i: number = 1; i <= 5; i++) {
    console.log(i);
}
//console.log(i); // This will cause a TypeScript error because 'i' is not accessible outside the for loop

let colors: string[] = ["red", "green", "blue"];
for(let i:number = 0; i < colors.length; i++) {
    console.log(colors[i]);
}
console.log("-------------------")
for (let color of colors) {
    console.log(color);
}

let learner = {
    name: "Priya",
    age: 22,
    course: "Angular"
};

for (const key in learner) {
    console.log(key, learner[key as keyof typeof learner]);
}


function  calculateSum(a:number,b:number):number{
    let result:number=0;
    if (a>100 && b>100){
        let sum=a+b+100;
        result=a+b+100;
    }
    // sum is  - block level scope - it available only inside the if  block
   // console.log(sum);
   console.log(result);
   return result;
}

function  calculate(operand1:number,operand2:number):number{
    var result:number=0;
    var total:number=0;
    if (operand1>100 && operand2>100){
         result=operand1+operand2+100;
         total=operand1+operand2;
         //redeclare var is allowed
        // var total=100;
    }
    // sum is  - block level scope - it available only inside the if  block
   // console.log(sum);
   console.log(result);
   console.log(total);
    return result;
}


function displayEmployeeId(id: number | string): void {
   if (typeof id === "number") {
    console.log("Employee ID (number): " + id);
      console.log(`Employee ID (number): ${id}`);
   }
    else if (typeof id === "string") {
    console.log(`Employee ID (string): ${id}`);
}
}

displayEmployeeId(101);
displayEmployeeId("EMP-101");
