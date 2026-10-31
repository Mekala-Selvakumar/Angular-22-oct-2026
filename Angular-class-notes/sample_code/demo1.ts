export {};

let  count:number=100;
//console.log(count.toUpperCase()); // This will cause a TypeScript error because 'count' is of type number
let  a:any;
a=100;
//console.log(a.toUpperCase());
console.log(a);
a="Hello"
console.log(typeof(a));

let  x:unknown;
// console.log(x);
x="Welcome to TypeScript";
console.log(typeof(x)  );
console.log(x);
//console.log(x.toUpperCase()); 
if (x instanceof String) {
    console.log(x.toUpperCase());
}
if (typeof x === "string") {
    console.log(x.toUpperCase());
}
x=100
console.log(typeof(x));
if (typeof x === "number") {
    console.log(x.toFixed(2));
}
console.log(x);

interface Employee {
  id: number;
}

interface Employee {
  name: string;
}

const emp: Employee = {
  id: 101,
  name: "Arun"
};

console.log(emp.id);
console.log(emp.name);