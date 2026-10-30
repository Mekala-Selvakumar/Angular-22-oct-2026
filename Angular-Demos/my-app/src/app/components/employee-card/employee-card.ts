import { Component } from '@angular/core';
import { Employee } from '../../models/employee';
import { CommonModule } from '@angular/common';


type Status='active' | 'inactive' | 'on-leave';

@Component({
  imports: [CommonModule],
  selector: 'app-employee-card',
  styleUrl: './employee-card.css',
  templateUrl: './employee-card.html',
})
export class EmployeeCard {
  price=200;
  quantity=5;
  arr:number[]=[1,2,3,4,5,6,7,8,9,10];
  status: Status = "active";

  employee:Employee=
    {
      id:1,
      name:"John Doe",
      email:"john.doe@example.com",
      permanent:true,
      department:{
        id:1,
        name:"Engineering",
        location:"Building A"
      },
      skills:[
        {
          id:1,  name:"JavaScript", "level":"Advanced"
        },
        {
          id:2, name:"Angular","level":"Intermediate"
        }
      ]
    } 


}
