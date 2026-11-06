import { Component } from '@angular/core';
import { Employee } from '../../models/employee';
import { CommonModule, LowerCasePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { StockStatusPipe } from '../../pipes/stock-status-pipe';
import { SqrtPipe } from '../../pipes/sqrt-pipe';

@Component({
  // imports: [UpperCasePipe, LowerCasePipe, TitleCasePipe],
    imports: [CommonModule,StockStatusPipe,SqrtPipe],

  selector: 'app-pipedemo',
  styleUrl: './pipedemo.css',
  templateUrl: './pipedemo.html',
})
export class Pipedemo {
  message="welcome TO anGuLar pipe demo";
today=new Date();
dob=new Date(2007,9,24);
discount=0.15

amount=876543.456253
pi:number=Math.PI
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

    product=        {
            id: 101,
            name: 'Laptop',
            price: 65000,
            stockQuantity: 4
        };

  
}
