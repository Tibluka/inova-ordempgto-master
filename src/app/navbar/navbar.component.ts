import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'inova-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  name:string = '';

  constructor() { }

  ngOnInit(): void {
    let logged_user = localStorage.getItem('logged-user');
    if(logged_user) {
      let parsed = JSON.parse(logged_user);
      this.name = parsed.nome ? parsed.nome : 'Usuário não Identificado';
    }
  }

}
