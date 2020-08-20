import { Component, OnInit } from '@angular/core';
import { InfoService } from 'src/app/services/info.service';


@Component({
  selector: 'inova-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menuIsOpen = false

  constructor(public infoService: InfoService) { }

  ngOnInit(): void {
  }
}
