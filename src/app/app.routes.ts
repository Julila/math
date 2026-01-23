import { Routes } from '@angular/router';
import { FindNumberComponent } from './find-number-component/find-number-component';
import { RandomBallsComponent } from './random-balls-component/random-balls-component';
import { NumbersOrderComponent } from './numbers-order-component/numbers-order-component';
import { ReadingGameComponent } from './reading-game-component/reading-game-component';
import { SumNumbersComponent } from './sum-numbers-component/sum-numbers-component';

export const routes: Routes = [
  { path: 'find-number', component: FindNumberComponent },
  { path: 'random-balls', component: RandomBallsComponent },
  { path: 'number-order', component: NumbersOrderComponent },
  { path: 'reading-game', component: ReadingGameComponent },
  { path: 'sum-game', component: SumNumbersComponent },
  { path: '', redirectTo: '/find-number', pathMatch: 'full' },
];
