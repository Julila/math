import { Component, OnInit, ViewChild } from '@angular/core';
import { StarScoreComponent } from '../star-score-component/star-score-component';
import { GameOverComponent } from '../game-over-component/game-over-component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-numbers-sum-component',
  imports: [StarScoreComponent, GameOverComponent, CommonModule],
  templateUrl: './numbers-sum-component.html',
  styleUrl: './numbers-sum-component.css',
})
export class NumbersSumComponent implements OnInit {
  leftNumber: number = 0;
  rightNumber: number = 0;
  correctSum: number = 0;
  answerOptions: number[] = [];
  selectedAnswer: number | null = null;
  isCorrect: boolean | null = null;

  gameCompleted: boolean = false;

  // Variable for passing result to StarScoreComponent
  lastAttemptResult: 'correct' | 'wrong' | null = null;
  @ViewChild(StarScoreComponent) starScoreComponent!: StarScoreComponent;

  ngOnInit() {
    this.generateNewGame();
  }

  generateNewGame() {
    // Generate two random numbers from 1 to 10
    this.leftNumber = Math.floor(Math.random() * 10) + 1;
    this.rightNumber = Math.floor(Math.random() * 10) + 1;

    this.correctSum = this.leftNumber + this.rightNumber;

    this.generateAnswerOptions();

    this.selectedAnswer = null;
    this.isCorrect = null;
    // Important: reset result after generating new round,
    // so child component doesn't trigger twice
    this.lastAttemptResult = null;
  }

  generateAnswerOptions() {
    const options = new Set<number>();
    options.add(this.correctSum);

    while (options.size < 3) {
      // Generate answer options in reasonable range
      const randomNum = Math.floor(Math.random() * 15) + 2; // from 2 to 16
      if (randomNum !== this.correctSum) {
        options.add(randomNum);
      }
    }

    this.answerOptions = Array.from(options).sort(() => Math.random() - 0.5);
  }

  selectAnswer(answer: number) {
    if (this.selectedAnswer !== null) return;

    this.selectedAnswer = answer;
    this.isCorrect = answer === this.correctSum;

    // Pass result to star component
    this.lastAttemptResult = this.isCorrect ? 'correct' : 'wrong';

    // Add delay before next question
    setTimeout(() => {
      // Check gameCompleted flag.
      // StarScoreComponent will set it to true if this was the 7th attempt.
      if (!this.gameCompleted) {
        this.generateNewGame();
      }
    }, 1000); // 1 second delay
  }

  // This method triggers when StarScoreComponent reports that attempts are over
  onGameCompleted() {
    this.gameCompleted = true;
  }

  startAgain() {
    this.gameCompleted = false;
    if (this.starScoreComponent) {
      this.starScoreComponent.onStartAgain();
    }
    this.generateNewGame();
  }
}
