import { Routes } from '@angular/router';
import { FindNumberComponent } from './find-number-component/find-number-component';
import { RandomBallsComponent } from './random-balls-component/random-balls-component';
import { NumbersOrderComponent } from './numbers-order-component/numbers-order-component';
import { ReadingGameComponent } from './reading-game-component/reading-game-component';
import { BallSumComponent } from './sum-numbers-component/balls-sum-component';
import { NumbersSumComponent } from './numbers-sum-component/numbers-sum-component';

export const routes: Routes = [
  { path: 'find-number', component: FindNumberComponent },
  { path: 'random-balls', component: RandomBallsComponent },
  { path: 'number-order', component: NumbersOrderComponent },
  { path: 'reading-game', component: ReadingGameComponent },
  { path: 'sum-game', component: BallSumComponent },
  { path: 'num-sum-game', component: NumbersSumComponent },
  { path: '', redirectTo: '/find-number', pathMatch: 'full' },
];
