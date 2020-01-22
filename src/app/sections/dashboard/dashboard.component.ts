import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  docs=[ 
    {id:"jaajsaksd", nombre:"qlq", updateAt:new Date(),}
  ]
  user={ user_name:"Angelica", id:1 }/*
  constructor( private router: Router, private api:ApiService) { }*/

  ngOnInit() { /*
    this.api.getDocuments().subscribe((docs)=>{
      console.log(docs);
    });*/
  }/*

  open_doc(id:string){
    console.log(id);
    this.router.navigate(["document",id]);
  }*/

}
