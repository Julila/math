import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarScoreComponent } from '../star-score-component/star-score-component';
import { GameOverComponent } from '../game-over-component/game-over-component';
@Component({
  selector: 'app-sum-numbers-component',
  imports: [CommonModule, StarScoreComponent, GameOverComponent],
  templateUrl: './sum-numbers-component.html',
  styleUrl: './sum-numbers-component.css',
})
export class SumNumbersComponent implements OnInit {
  leftGridNumber: number = 0;
  rightGridNumber: number = 0;
  correctSum: number = 0;
  leftCircles: number[] = [];
  rightCircles: number[] = [];
  answerOptions: number[] = [];
  selectedAnswer: number | null = null;
  isCorrect: boolean | null = null;

  gameCompleted: boolean = false;

  // Переменная для передачи результата в StarScoreComponent
  lastAttemptResult: 'correct' | 'wrong' | null = null;
  @ViewChild(StarScoreComponent) starScoreComponent!: StarScoreComponent;

  ngOnInit() {
    this.generateNewGame();
  }

  generateNewGame() {
    // Генерируем два случайных числа от 1 до 5
    this.leftGridNumber = Math.floor(Math.random() * 5) + 1;
    this.rightGridNumber = Math.floor(Math.random() * 5) + 1;
    if (this.rightGridNumber > this.leftGridNumber) {
      const temp = this.rightGridNumber;
      this.rightGridNumber = this.leftGridNumber;
      this.leftGridNumber = temp;
    }

    this.correctSum = this.leftGridNumber + this.rightGridNumber;

    // Создаем массивы кружков для каждой сетки
    this.leftCircles = Array(this.leftGridNumber).fill(0);
    this.rightCircles = Array(this.rightGridNumber).fill(0);

    this.generateAnswerOptions();

    this.selectedAnswer = null;
    this.isCorrect = null;
    // Важно: сбрасываем результат после генерации нового раунда,
    // чтобы дочерний компонент не сработал дважды
    this.lastAttemptResult = null;
  }

  generateAnswerOptions() {
    const options = new Set<number>();
    options.add(this.correctSum);

    while (options.size < 3) {
      // Генерируем варианты ответов в разумном диапазоне
      const randomNum = Math.floor(Math.random() * 8) + 2; // от 2 до 10
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

  // Этот метод срабатывает, когда StarScoreComponent сообщает, что попытки кончились
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

  getRowsOfCircles(circles: number[]) {
    const rows = [];
    for (let i = 0; i < circles.length; i += 5) {
      rows.push(circles.slice(i, i + 5));
    }
    return rows;
  }

  // Новый метод для левой сетки с двумя рядами
  getLeftGridRows() {
    const filledCircles = Array(this.leftGridNumber).fill(1); // 1 означает заполненный кружок
    const emptySpaces = Array(10 - this.leftGridNumber).fill(0); // 0 означает пустое место
    const allPositions = [...filledCircles, ...emptySpaces];

    const rows = [];
    for (let i = 0; i < 10; i += 5) {
      rows.push(allPositions.slice(i, i + 5));
    }
    return rows;
  }
}
