import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReadComponent } from './components/read/read.component';
import { CreateComponent } from './components/create/create.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';


const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: CreateComponent },
  { path: 'home/:cityName', component: CreateComponent },
  { path: 'favorites', component: ReadComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  exports: [
    RouterModule //created exports! app modue ts imports it!
  ],
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ]
})
export class AppRoutingModule { }
