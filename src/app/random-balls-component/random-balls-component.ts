import {
  afterNextRender,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarScoreComponent } from '../star-score-component/star-score-component';
import { GameOverComponent } from '../game-over-component/game-over-component';

@Component({
  selector: 'app-random-balls-component',
  imports: [CommonModule, StarScoreComponent, GameOverComponent],
  templateUrl: './random-balls-component.html',
  styleUrl: './random-balls-component.css',
})
export class RandomBallsComponent implements AfterViewInit {
  @ViewChild('leftSector', { static: false }) leftSector!: ElementRef;
  @ViewChild('rightSector', { static: false }) rightSector!: ElementRef;
  @ViewChild(StarScoreComponent) starScoreComponent!: StarScoreComponent;

  leftBallsCount = 0;
  rightBallsCount = 0;
  lastAttemptResult: 'correct' | 'wrong' | null = null;
  gameCompleted: boolean = false;

  // Константы для конфигурации
  private readonly BALL_SIZE = 20;
  private readonly MARGIN = 20;
  private readonly MIN_DISTANCE_PX = 50;
  private readonly FEEDBACK_DURATION_MS = 500;
  private readonly MAX_BALLS = 10;
  private readonly MIN_BALLS = 1;

  constructor(private cdr: ChangeDetectorRef) {
    afterNextRender(() => {
      this.startNewGame();
    });
  }

  ngAfterViewInit() {
    // startNewGame is already called in afterNextRender
  }

  startNewGame() {
    this.lastAttemptResult = null;
    this.clearSectors();
    this.generateRandomCounts();

    // Use change detection and ensure view is updated
    this.cdr.detectChanges();

    // Wait longer for Angular to re-render the template
    setTimeout(() => {
      if (this.leftSector && this.rightSector) {
        this.createBallsInSector(this.leftSector.nativeElement, this.leftBallsCount, 'green');
        this.createBallsInSector(this.rightSector.nativeElement, this.rightBallsCount, 'blue');
      }
    }, 50); // Increased delay to ensure template is rendered
  }

  handleSectorClick(selectedSide: 'left' | 'right') {
    const isLeftMore = this.leftBallsCount > this.rightBallsCount;
    const isRightMore = this.rightBallsCount > this.leftBallsCount;
    const isCorrect =
      (selectedSide === 'left' && isLeftMore) || (selectedSide === 'right' && isRightMore);

    this.applyFeedback(selectedSide, isCorrect);
  }

  onGameCompleted() {
    this.gameCompleted = true;
  }

  startAgain() {
    if (this.starScoreComponent) {
      this.starScoreComponent.onStartAgain();
    }
    this.gameCompleted = false;
    this.startNewGame();
  }

  private clearSectors() {
    const sectors = [this.leftSector?.nativeElement, this.rightSector?.nativeElement];

    sectors.forEach((sector) => {
      if (sector) {
        sector.innerHTML = '';
        sector.classList.remove('correct', 'incorrect');
      }
    });
  }

  private generateRandomCounts() {
    this.leftBallsCount = this.generateRandomCount();

    do {
      this.rightBallsCount = this.generateRandomCount();
    } while (this.rightBallsCount === this.leftBallsCount);
  }

  private generateRandomCount(): number {
    return Math.floor(Math.random() * (this.MAX_BALLS - this.MIN_BALLS + 1)) + this.MIN_BALLS;
  }

  private createBallsInSector(sectorElement: HTMLElement, count: number, color: 'green' | 'blue') {
    const sectorWidth = sectorElement.offsetWidth;
    const sectorHeight = sectorElement.offsetHeight;

    // Corrected: Ensure balls have margin on all sides by accounting for ball size + margin
    const maxX = sectorWidth - this.BALL_SIZE - this.MARGIN * 2;
    const maxY = sectorHeight - this.BALL_SIZE - this.MARGIN * 2;

    for (let i = 0; i < count; i++) {
      const ball = document.createElement('div');
      ball.className = `ball ball-${color}`;

      const { x, y } = this.findValidPosition(sectorElement, maxX, maxY);

      ball.style.position = 'absolute';
      ball.style.left = `${x}px`;
      ball.style.top = `${y}px`;

      sectorElement.appendChild(ball);
    }
  }

  private findValidPosition(
    container: HTMLElement,
    maxX: number,
    maxY: number,
  ): { x: number; y: number } {
    let x, y;
    let attempts = 0;
    const maxAttempts = 100;
    let validPosition = false;

    do {
      x = Math.random() * maxX + this.MARGIN;
      y = Math.random() * maxY + this.MARGIN;

      validPosition = this.isPositionValid(container, x, y);
      attempts++;
    } while (!validPosition && attempts < maxAttempts);

    return { x, y };
  }

  private isPositionValid(container: HTMLElement, x: number, y: number): boolean {
    const existingBalls = container.querySelectorAll('.ball');

    for (const ball of existingBalls) {
      const ballElement = ball as HTMLElement;
      const ballX = parseFloat(ballElement.style.left) || 0;
      const ballY = parseFloat(ballElement.style.top) || 0;

      const distance = Math.sqrt(Math.pow(x - ballX, 2) + Math.pow(y - ballY, 2));

      if (distance < this.MIN_DISTANCE_PX) {
        return false;
      }
    }

    return true;
  }

  private applyFeedback(side: 'left' | 'right', isCorrect: boolean) {
    const targetElement =
      side === 'left' ? this.leftSector?.nativeElement : this.rightSector?.nativeElement;

    if (!targetElement) return;

    const className = isCorrect ? 'correct' : 'incorrect';
    this.lastAttemptResult = isCorrect ? 'correct' : 'wrong';
    targetElement.classList.add(className);

    // Запускаем перезапуск только ПОСЛЕ того, как закончится таймер показа результата
    setTimeout(() => {
      targetElement.classList.remove(className);
      this.startNewGame();
    }, this.FEEDBACK_DURATION_MS);
  }

  // Оставим для совместимости с шаблоном, если используется кнопка
  restartGame() {
    this.startNewGame();
  }

  regenerateBalls() {
    this.startNewGame();
  }
}
