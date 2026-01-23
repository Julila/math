import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-score-component',
  imports: [CommonModule],
  templateUrl: './star-score-component.html',
  styleUrl: './star-score-component.css',
})
export class StarScoreComponent implements OnChanges {
  @Input() attemptResult: 'correct' | 'wrong' | null = null;

  @Output() gameCompleted = new EventEmitter<void>();
  @Output() startedAgain = new EventEmitter<void>();

  // Prepare stars
  defaultStars: ('empty' | 'correct' | 'wrong')[] = ['empty', 'empty', 'empty', 'empty', 'empty'];
  protected stars: ('empty' | 'correct' | 'wrong')[] = this.defaultStars;
  protected readonly maxAttempts: number = this.defaultStars.length;

  protected currentAttempt: number = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['attemptResult'] && this.attemptResult) {
      this.updateScore(this.attemptResult);
    }
  }

  allStarsCollected(): boolean {
    return this.stars.every((star) => star !== 'empty');
  }

  getStarImageSrc(star: 'empty' | 'correct' | 'wrong'): string {
    switch (star) {
      case 'correct':
        return '../img/star-yellow.svg';
      case 'wrong':
        return 'img/star-red.svg';
      case 'empty':
      default:
        return 'img/star-grey.svg';
    }
  }

  updateScore(result: 'correct' | 'wrong') {
    if (this.currentAttempt >= this.maxAttempts) {
      return;
    }

    // Create a new array instead of mutating the existing one
    this.stars = this.stars.map((star, index) => (index === this.currentAttempt ? result : star));

    this.currentAttempt++;

    if (this.currentAttempt >= this.maxAttempts) {
      this.gameCompleted.emit();
    }
  }

  onStartAgain() {
    this.stars = [...this.defaultStars];
    this.currentAttempt = 0;
    this.attemptResult = null;

    // Explicitly trigger change detection
  }
}
