import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reading-game-component',
  imports: [CommonModule],
  templateUrl: './reading-game-component.html',
  styleUrl: './reading-game-component.css',
})
export class ReadingGameComponent {
  level1vowels: string[] = ['А', 'О', 'И', 'У', 'Ы'];
  consonantsLevel1: string[] = ['Н', 'С', 'К', 'Т', 'Л', 'Р', 'В', 'П', 'М', 'З', 'Б', 'Д', 'Г'];
  level2vowels: string[] = ['Е', 'Я', 'Ь', 'Э'];
  consonantsLevel2: string[] = ['Ч', 'Ж', 'Ш'];

  russianAlphabet: string[] = [
    'А',
    'Б',
    'В',
    'Г',
    'Д',
    'Е',
    'Ё',
    'Ж',
    'З',
    'И',
    'Й',
    'К',
    'Л',
    'М',
    'Н',
    'О',
    'П',
    'Р',
    'С',
    'Т',
    'У',
    'Ф',
    'Х',
    'Ц',
    'Ч',
    'Ш',
    'Щ',
    'Ъ',
    'Ы',
    'Ь',
    'Э',
    'Ю',
    'Я',
  ];

  words: string[] = [
    'НИНА',
    'НОННА',
    'АННА',
    'СОН',
    'НОС',
    'СЫН',
    'ОСА',
    'УСЫ',
    'ЛУК',
    'КЛОУН',
    'КОТ',
    'КРАСОТА',
    'КАК ДЕЛА',
    'ТРАТАТА',
    'КИТ',
    'КОТ',
    'КРАН',
    'РЕКА',
    'РУКА',
    'РОМА',
    'РИТА',
    'РАКЕТА',
    'ВОВА',
    'ВИКА',
  ];

  currentLevel: number = 1;
  currentPair: string = '';
  availableLetters: string[] = [];
  consonantsAddedFromLevel1: number = 0;
  consonantsAddedFromLevel2: number = 0;

  // Новое состояние для управления логикой тренировки
  private trainingState: 'consonant_vowel' | 'vowel_consonant' | 'words' = 'consonant_vowel';
  private currentConsonant: string | null = null;
  private trainingIndex: number = 0;
  private showWordsCounter: number = 0;
  private readonly SHOW_WORDS_FREQUENCY: number = 3;

  constructor() {
    this.initializeLevel();
    this.generateNewPair();
  }

  initializeLevel(): void {
    // Начинаем с гласных
    this.availableLetters = [...this.level1vowels];

    // Добавляем согласные из уровня 1
    for (let i = 0; i < this.consonantsAddedFromLevel1; i++) {
      if (i < this.consonantsLevel1.length) {
        this.availableLetters.push(this.consonantsLevel1[i]);
      }
    }

    // Добавляем буквы из уровня 2
    const level2Letters = [...this.level2vowels, ...this.consonantsLevel2];
    for (let i = 0; i < this.consonantsAddedFromLevel2; i++) {
      if (i < level2Letters.length) {
        this.availableLetters.push(level2Letters[i]);
      }
    }
  }

  isLetterActive(letter: string): boolean {
    return this.availableLetters.includes(letter);
  }

  getAvailableWords(): string[] {
    return this.words.filter((word) => {
      const wordLetters = Array.from(word);
      return wordLetters.every((char) => {
        // Пропускаем пробелы
        if (char === ' ') return true;
        // Проверяем, доступна ли буква
        return this.availableLetters.includes(char);
      });
    });
  }

  private resetTrainingSequence(): void {
    // При добавлении новой согласной сбрасываем последовательность
    this.trainingState = 'consonant_vowel';
    this.trainingIndex = 0;
    this.showWordsCounter = 0;
  }

  private getNextTrainingItem(): string {
    // Если это первое добавление согласной, начинаем с неё
    if (this.currentConsonant === null && this.consonantsAddedFromLevel1 > 0) {
      this.currentConsonant = this.consonantsLevel1[this.consonantsAddedFromLevel1 - 1];
      this.resetTrainingSequence();
    }

    // Если нет активной согласной, возвращаем обычную пару
    if (this.currentConsonant === null) {
      return this.generateRandomPair();
    }

    // Логика последовательной тренировки
    switch (this.trainingState) {
      case 'consonant_vowel':
        // Согласная + гласная
        const vowel = this.level1vowels[this.trainingIndex % this.level1vowels.length];
        this.trainingIndex++;

        // После прохождения всех гласных переходим к следующему режиму
        if (this.trainingIndex >= this.level1vowels.length) {
          this.trainingState = 'vowel_consonant';
          this.trainingIndex = 0;
        }

        return this.currentConsonant + vowel;

      case 'vowel_consonant':
        // Гласная + согласная
        const vowel2 = this.level1vowels[this.trainingIndex % this.level1vowels.length];
        this.trainingIndex++;

        // После прохождения всех гласных переходим к словам
        if (this.trainingIndex >= this.level1vowels.length) {
          this.trainingState = 'words';
          this.trainingIndex = 0;
        }

        return vowel2 + this.currentConsonant;

      case 'words':
        // Чередование слов и пар
        this.showWordsCounter++;

        // Каждые SHOW_WORDS_FREQUENCY раз показываем слово
        if (this.showWordsCounter % this.SHOW_WORDS_FREQUENCY === 0) {
          const availableWords = this.getAvailableWords();
          if (availableWords.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableWords.length);
            return availableWords[randomIndex];
          }
        }

        // Иначе возвращаем случайную пару
        return this.generateRandomPair();
    }
  }

  private generateRandomPair(): string {
    if (this.availableLetters.length < 2) {
      return this.availableLetters[0] || '';
    }

    const randomIndex1 = Math.floor(Math.random() * this.availableLetters.length);
    let randomIndex2 = Math.floor(Math.random() * this.availableLetters.length);

    // Обеспечиваем разные индексы
    while (randomIndex2 === randomIndex1) {
      randomIndex2 = Math.floor(Math.random() * this.availableLetters.length);
    }

    return this.availableLetters[randomIndex1] + this.availableLetters[randomIndex2];
  }

  generateNewPair(): void {
    this.currentPair = this.getNextTrainingItem();
  }

  onNext(): void {
    this.generateNewPair();
  }

  onNextLevel(): void {
    // Сохраняем предыдущее количество согласных
    const previousConsonantsCount = this.consonantsAddedFromLevel1;

    // Сначала добавляем согласные из уровня 1
    if (this.consonantsAddedFromLevel1 < this.consonantsLevel1.length) {
      this.consonantsAddedFromLevel1++;
    }
    // Затем добавляем буквы из уровня 2
    else if (
      this.consonantsAddedFromLevel2 <
      this.level2vowels.length + this.consonantsLevel2.length
    ) {
      this.consonantsAddedFromLevel2++;
    }

    this.currentLevel++;
    this.initializeLevel();

    // Если добавили новую согласную из уровня 1, сбрасываем последовательность
    if (this.consonantsAddedFromLevel1 > previousConsonantsCount) {
      this.currentConsonant = this.consonantsLevel1[this.consonantsAddedFromLevel1 - 1];
      this.resetTrainingSequence();
    }

    this.generateNewPair();
  }

  canAdvanceLevel(): boolean {
    return (
      this.consonantsAddedFromLevel1 < this.consonantsLevel1.length ||
      this.consonantsAddedFromLevel2 < this.level2vowels.length + this.consonantsLevel2.length
    );
  }
}
