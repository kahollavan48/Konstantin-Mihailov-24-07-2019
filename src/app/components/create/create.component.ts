import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { Observable } from 'rxjs';
import { Tutorial } from '../../../models/tutorial.model';
import { Title } from "@angular/platform-browser";
import { ThemeService } from '../../services/theme.service'
import { CityServiceService } from '../../services/city-service.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ActivatedRoute } from '@angular/router';
import * as TutorialActions from '../../../actions/tutorial.actions';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  // bQ45spNGkGXvHEYnK5C5UTA5oIgTD3VW

  theme: boolean = true;
  cityName: string;
  cityNameOutput: string;
  citySearchWeather: any;
  citySearchKey: number;
  currentLocationKey: number;
  currLat: number;
  currLng: number;
  state: boolean;
  cityKey: number;
  urlParam: string;
  tutorials: Observable<Tutorial[]>;
  favoritesArr: any[] = [];
  citySearchWeatherResult: any;

  constructor(
    private title: Title,
    private ts: ThemeService,
    private route: ActivatedRoute,
    private fms: FlashMessagesService,
    private store: Store<AppState>,
    private cs: CityServiceService
  ) { this.tutorials = store.select('tutorial'); }

  ngOnInit(): void {
    this.getUrlParam();
    this.ts.currentMessage.subscribe(message => this.state = message);
    this.title.setTitle('Weather App | Home');
  }

  getUrlParam() {
    this.urlParam = this.route.snapshot.paramMap.get('cityName');
    if (this.urlParam) {
      // here we got the city name from favorites page by reading url param!
      this.findCity(this.urlParam);
    } else {
      this.getCurrentLocation();
    }
  }

  addTutorial(cityKey, city, weatherData) {
    this.store.subscribe(state => {
      state.tutorial.forEach(element => { this.favoritesArr.push(element.name.toLowerCase()) });
    })
    if (this.favoritesArr.includes(city.toLowerCase())) {
      this.fms.show(`City: ${city} is allready in you favorites!`,
        {
          cssClass: 'fixed-top mx-auto mt-5 bg-danger w-50 text-white text-center',
          timeout: 4000
        });
      return
    }
    this.store.dispatch(new TutorialActions.AddTutorial({ key: cityKey, name: city, data: weatherData }));
    this.fms.show(`City: ${city} added to favorites!`,
      {
        cssClass: 'fixed-top mx-auto mt-5 bg-success w-50 text-white text-center',
        timeout: 4000
      });
    return
  }

  async getCurrentLocation() {
    if (navigator.geolocation) {
      const location = await this.getLocation();
      const key = await this.getDefLocation(location);
      await this.getDefWeather(key);
    }
    else {
      this.fms.show(`Geolocation is not supported by this browser!`,
        {
          cssClass: 'fixed-top mx-auto mt-5 bg-danger w-50 text-white text-center',
          timeout: 4000
        });
      return
    }
  }

  getLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        this.currLat = position.coords.latitude;
        this.currLng = position.coords.longitude;
        const geo = { lat: this.currLat, len: this.currLng };
        resolve(geo);
      });
    });
  }

  getDefLocation(geo) {
    return new Promise((resolve, reject) => {
      let currLat = geo.lat;
      let currLng = geo.len;
      this.cs.getDefaultLocation(currLat, currLng).subscribe((location) => {
        this.currentLocationKey = location['Key'];
        this.cityName = location['LocalizedName'];
        this.cityNameOutput = this.cityName;
        resolve(location['Key']);
      });
    })
  };

  getDefWeather(key) {
    return new Promise((resolve, reject) => {
      this.cs.getWeatherByCityKey(key).subscribe((weather: any) => {
        this.citySearchWeatherResult = weather;
        resolve(weather);
      });
    })
  }

  getCityKeyByCityName(cityName) {
    return new Promise((resolve, reject) => {
      this.cs.getCityKeyByCityName(cityName).subscribe((data: any) => {
        this.citySearchWeather = data;
        if (this.citySearchWeather[0] !== undefined) {
          this.cityKey = this.citySearchWeather[0].Key;
          resolve(this.citySearchWeather[0].Key);
        } else {
          reject((error) => console.log(error))
        }
      });
    });
  }

  inputTitleCase = input => {
    return input.split(' ').map(word => {
      return word[0].toUpperCase() + word.substr(1);
    }).join(' ');
  }

  findCity(cityName) {
    const ct = this.inputTitleCase(cityName);
    const regExp = new RegExp('^[a-z A-Z]+$');
    if (ct === undefined || ct === '') {
      this.fms.show('Please fill the text input!',
        {
          cssClass: 'fixed-top mx-auto mt-5 bg-danger w-50 text-white text-center',
          timeout: 4000
        });
      return
    } else if (regExp.test(ct)) {
      this.cityNameOutput = ct;
      this.getCityKeyByCityName(ct).then((key) => {
        this.cs.getWeatherByCityKey(key).subscribe((weather: any) => {
          this.citySearchWeatherResult = weather;
        })
      }).catch((e) => {
        this.fms.show(`There is no city named: ${ct} or you have reached serch limit for today!`,
          {
            cssClass: 'fixed-top mx-auto mt-5 bg-danger w-50 text-white text-center',
            timeout: 4000
          });
        return
      });
    } else {
      this.fms.show(`You entered: ${ct}! English letters only allowed!`,
        {
          cssClass: 'fixed-top mx-auto mt-5 bg-danger w-50 text-white text-center',
          timeout: 4000
        });
      return
    }
  }
}


