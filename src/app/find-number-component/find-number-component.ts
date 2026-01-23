import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarScoreComponent } from '../star-score-component/star-score-component';
import { GameOverComponent } from '../game-over-component/game-over-component';

@Component({
  selector: 'app-find-number-component',
  imports: [CommonModule, StarScoreComponent, GameOverComponent],
  templateUrl: './find-number-component.html',
  styleUrl: './find-number-component.css',
})
export class FindNumberComponent implements OnInit {
  targetNumber: number = 0;
  circles: number[] = [];
  answerOptions: number[] = [];
  selectedAnswer: number | null = null;
  isCorrect: boolean | null = null;

  gameCompleted: boolean = false;

  lastAttemptResult: 'correct' | 'wrong' | null = null;
  @ViewChild(StarScoreComponent) starScoreComponent!: StarScoreComponent;

  ngOnInit() {
    this.generateNewGame();
  }

  generateNewGame() {
    this.targetNumber = Math.floor(Math.random() * 20) + 1;
    this.circles = Array(this.targetNumber).fill(0);
    this.generateAnswerOptions();

    this.selectedAnswer = null;
    this.isCorrect = null;
    // Важно: сбрасываем результат после генерации нового раунда,
    // чтобы дочерний компонент не сработал дважды
    this.lastAttemptResult = null;
  }

  generateAnswerOptions() {
    const options = new Set<number>();
    options.add(this.targetNumber);

    while (options.size < 3) {
      const randomNum = Math.floor(Math.random() * 15) + 1;
      if (randomNum !== this.targetNumber) {
        options.add(randomNum);
      }
    }

    this.answerOptions = Array.from(options).sort(() => Math.random() - 0.5);
  }

  selectAnswer(answer: number) {
    if (this.selectedAnswer !== null) return;

    this.selectedAnswer = answer;
    this.isCorrect = answer === this.targetNumber;

    // Передаем результат в компонент звезд
    this.lastAttemptResult = this.isCorrect ? 'correct' : 'wrong';

    // Добавляем задержку перед следующим вопросом
    setTimeout(() => {
      // Проверяем флаг gameCompleted.
      // StarScoreComponent установит его в true, если это была 7-я попытка.
      if (!this.gameCompleted) {
        this.generateNewGame();
      }
    }, 1000); // Задержка 1 секунда
  }

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

  getRowsOfCircles() {
    const rows = [];
    for (let i = 0; i < this.circles.length; i += 5) {
      rows.push(this.circles.slice(i, i + 5));
    }
    return rows;
  }
}
