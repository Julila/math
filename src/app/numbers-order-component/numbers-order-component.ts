import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarScoreComponent } from '../star-score-component/star-score-component';
import { GameOverComponent } from '../game-over-component/game-over-component';

@Component({
  selector: 'app-numbers-order-component',
  imports: [CommonModule, StarScoreComponent, GameOverComponent],
  templateUrl: './numbers-order-component.html',
  styleUrl: './numbers-order-component.css',
})
export class NumbersOrderComponent implements OnInit {
  private readonly GAME_SIZE = 5;
  private readonly MIN_NUMBER = 1;
  private readonly MAX_NUMBER = 20;

  randomNumbers: number[] = [];
  userOrder: number[] = [];
  sortedNumbers: number[] = [];
  isGameComplete: boolean = false;
  isCorrect: boolean | null = null;
  wrongSelection: number | null = null;
  hasIncorrectAttempt: boolean = false;
  lastAttemptResult: 'correct' | 'wrong' | null = null;
  gameCompleted: boolean = false;
  showGameOver: boolean = false;

  @ViewChild(StarScoreComponent) starScoreComponent!: StarScoreComponent;

  ngOnInit() {
    this.generateNewGame();
  }

  /**
   * Generates a new game with random numbers and resets game state
   */
  generateNewGame(): void {
    this.randomNumbers = this.generateRandomNumbers();
    this.sortedNumbers = [...this.randomNumbers].sort((a, b) => a - b);
    this.resetGameState();
  }

  /**
   * Generates 5 unique random numbers between MIN_NUMBER and MAX_NUMBER
   */
  private generateRandomNumbers(): number[] {
    const numbers = new Set<number>();
    while (numbers.size < this.GAME_SIZE) {
      numbers.add(
        Math.floor(Math.random() * (this.MAX_NUMBER - this.MIN_NUMBER + 1)) + this.MIN_NUMBER,
      );
    }
    return Array.from(numbers);
  }

  /**
   * Resets all game state variables to initial values
   */
  private resetGameState(): void {
    this.userOrder = [];
    this.isGameComplete = false;
    this.isCorrect = null;
    this.wrongSelection = null;
    this.hasIncorrectAttempt = false;
    this.lastAttemptResult = null;
    this.gameCompleted = false;
    this.showGameOver = false;
  }

  /**
   * Handles number selection by the player
   * @param number The number selected by the player
   */
  selectNumber(number: number): void {
    if (this.isInvalidSelection(number)) return;

    const expectedNumber = this.sortedNumbers[this.userOrder.length];

    if (number === expectedNumber) {
      this.handleCorrectSelection(number);
    } else {
      this.handleWrongSelection(number);
    }
  }

  /**
   * Checks if the selection is invalid (already selected, game complete, etc.)
   */
  private isInvalidSelection(number: number): boolean {
    return this.userOrder.includes(number) || this.isGameComplete;
  }

  /**
   * Handles logic for correct number selection
   */
  private handleCorrectSelection(number: number): void {
    this.userOrder.push(number);
    this.wrongSelection = null;

    // Check if game is complete
    if (this.userOrder.length === this.GAME_SIZE) {
      this.completeGame(true);
    }
  }

  /**
   * Handles logic for wrong number selection
   */
  private handleWrongSelection(number: number): void {
    this.hasIncorrectAttempt = true;
    this.wrongSelection = number;

    // Clear wrong selection indicator after delay
    setTimeout(() => {
      this.wrongSelection = null;
    }, 1000);
  }

  /**
   * Completes the game and determines result
   * @param success Whether the final selection was correct
   */
  private completeGame(success: boolean): void {
    this.isCorrect = success && !this.hasIncorrectAttempt;

    if (success && !this.hasIncorrectAttempt) {
      this.lastAttemptResult = 'correct';
    } else {
      this.lastAttemptResult = 'wrong';
    }

    // Show result for 1.5 seconds, then handle next action
    setTimeout(() => {
      // Check if all stars are collected
      if (this.areAllStarsCollected()) {
        this.isGameComplete = true;
        this.showGameOver = true;
      } else {
        // Otherwise automatically start new game
        this.generateNewGame();
      }
    }, 1500);

    this.onGameCompleted();
  }

  /**
   * Checks if all stars are collected
   */
  private areAllStarsCollected(): boolean {
    return this.starScoreComponent?.allStarsCollected() || false;
  }

  /**
   * Checks if a number has been selected by the user
   * @param number The number to check
   * @returns True if the number is selected
   */
  isNumberSelected(number: number): boolean {
    return this.userOrder.includes(number);
  }

  /**
   * Gets the position of a selected number in the user's order
   * @param number The number to get position for
   * @returns The 1-based position of the number, or 0 if not selected
   */
  getNumberPosition(number: number): number {
    return this.userOrder.indexOf(number) + 1;
  }

  /**
   * Checks if a number is currently marked as wrong selection
   * @param number The number to check
   * @returns True if the number is marked as wrong
   */
  isWrongSelection(number: number): boolean {
    return this.wrongSelection === number;
  }

  /**
   * Callback when game is completed
   */
  onGameCompleted(): void {
    this.gameCompleted = true;
  }

  /**
   * Starts the game again from the beginning
   */
  startAgain(): void {
    if (this.starScoreComponent) {
      this.starScoreComponent.onStartAgain();
    }
    this.generateNewGame();
  }

  /**
   * Handles restart from game-over component
   */
  onGameOverRestart(): void {
    this.startAgain();
  }
}
