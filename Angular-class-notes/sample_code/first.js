var status1 = "approved";
console.log(status1);
switch (status1) {
    case "pending":
        console.log("Awaiting approval");
        break;
    case "approved":
        console.log("Request approved");
        break;
    case "rejected":
        console.log("Request rejected");
        break;
}
//let - block level scope
for (var i = 1; i <= 5; i++) {
    console.log(i);
}
//console.log(i); // This will cause a TypeScript error because 'i' is not accessible outside the for loop
var colors = ["red", "green", "blue"];
for (var i = 0; i < colors.length; i++) {
    console.log(colors[i]);
}
console.log("-------------------");
for (var _i = 0, colors_1 = colors; _i < colors_1.length; _i++) {
    var color = colors_1[_i];
    console.log(color);
}
var learner = {
    name: "Priya",
    age: 22,
    course: "Angular"
};
for (var key in learner) {
    console.log(key, learner[key]);
}
function calculateSum(a, b) {
    var result = 0;
    if (a > 100 && b > 100) {
        var sum = a + b + 100;
        result = a + b + 100;
    }
    // sum is  - block level scope - it available only inside the if  block
    // console.log(sum);
    console.log(result);
    return result;
}
function calculate(operand1, operand2) {
    var result = 0;
    var total = 0;
    if (operand1 > 100 && operand2 > 100) {
        result = operand1 + operand2 + 100;
        total = operand1 + operand2;
        //redeclare var is allowed
        // var total=100;
    }
    // sum is  - block level scope - it available only inside the if  block
    // console.log(sum);
    console.log(result);
    console.log(total);
    return result;
}
function displayEmployeeId(id) {
    if (typeof id === "number") {
        console.log("Employee ID (number): " + id);
        console.log("Employee ID (number): ".concat(id));
    }
    else if (typeof id === "string") {
        console.log("Employee ID (string): ".concat(id));
    }
}
displayEmployeeId(101);
displayEmployeeId("EMP-101");
