import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Tutorial } from '../../../models/tutorial.model';
import { AppState } from '../../../app.state';
import { ThemeService } from '../../services/theme.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Title } from "@angular/platform-browser";
import * as TutorialActions from '../../../actions/tutorial.actions';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {

  tutorials: Observable<Tutorial[]>;
  theme: boolean = true;
  state: boolean;

  constructor(private store: Store<AppState>, private fms: FlashMessagesService, private ts: ThemeService, private title: Title) {
    this.tutorials = store.select('tutorial');
  }

  delTutorial(index) {
    this.store.dispatch(new TutorialActions.RemoveTutorial(index));
    this.fms.show("City removed from favorites!",
      {
        cssClass: 'fixed-top mx-auto mt-5 bg-success w-50 text-white text-center',
        timeout: 4000
      });
    return
  }

  ngOnInit(): void {
    this.title.setTitle('Weather App | Favorites');
    this.ts.currentMessage.subscribe(message => this.state = message);
  }



}
