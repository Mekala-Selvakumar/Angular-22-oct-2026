class Employee {

    // id: number;
    // name: string;
    // salary: number;

    // constructor(id: number, name: string, salary: number) {
    //     this.id = id;
    //     this.name = name;
    //     this.salary = salary;
    // }

        constructor(
        public id: number,
        public name: string,
        public salary: number
    ) {}


    displayDetails(): void {
        console.log(`${this.id} - ${this.name} - ${this.salary}`);
    }
}

const employee1 = new Employee(101, "Arun", 75000);

employee1.displayDetails();
