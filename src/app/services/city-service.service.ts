import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CityServiceService {

  constructor(private http: HttpClient) { }

  getDefaultLocation(lat, lon) {
    return this.http.get(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=bQ45spNGkGXvHEYnK5C5UTA5oIgTD3VW&q=${lat}%2C${lon}`);
  }

  getCityKeyByCityName(cityName) {
    return this.http.get(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=%09bQ45spNGkGXvHEYnK5C5UTA5oIgTD3VW&q=${cityName}`)
  }

  getWeatherByCityKey(cityKey, flag) {
    if (flag) {
      return this.http.get(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=bQ45spNGkGXvHEYnK5C5UTA5oIgTD3VW`);
    }
    return this.http.get(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=bQ45spNGkGXvHEYnK5C5UTA5oIgTD3VW&metric=true`);
  }
}


