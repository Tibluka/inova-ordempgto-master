import { Component, OnInit } from '@angular/core';
import { InfoService } from '../services/info.service';

@Component({
  selector: 'inova-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  name:string = '';

  constructor(public infoService: InfoService) { }

  ngOnInit(): void {
    let logged_user = localStorage.getItem('logged-user');
    if(logged_user) {
      let parsed = JSON.parse(logged_user);
      this.name = parsed.nome ? parsed.nome : 'Usuário não Identificado';
    }
  }

  openNav() {
    if (this.infoService.menuIsOpen) {
      document.getElementById("sideNav").style.width = "0"
      document.getElementById("spanContent").style.display = "none"
      this.infoService.menuIsOpen = false
    } else {
      document.getElementById("sideNav").style.width = "250px"
      setTimeout(() => {
        document.getElementById("spanContent").style.display = "flex"
      }, 100);
      this.infoService.menuIsOpen = true
    }
  }

}
