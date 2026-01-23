import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'game-over-component',
  imports: [],
  templateUrl: './game-over-component.html',
  styleUrl: './game-over-component.css',
})
export class GameOverComponent {
  @Output() startAgainClicked = new EventEmitter<void>();

  startAgain() {
    this.startAgainClicked.emit();
  }
}
