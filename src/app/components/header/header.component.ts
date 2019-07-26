import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  theme: boolean = true;
  state: string = "Day";

  constructor(private ts: ThemeService) { }

  ngOnInit() {
    this.ts.currentMessage.subscribe(message => this.theme = message);
  }

  changeTheme() {
    this.theme = !this.theme;
    this.state = this.theme ? "Day" : "Night"
    this.ts.changeMessage(this.theme);
  }


}
