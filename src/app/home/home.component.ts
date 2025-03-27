import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class HomeComponent {
  textInput: string = '';
  sentimentResult: string = 'Neutral Sentiment';

  positiveWords = ['good', 'happy', 'great', 'excellent', 'fantastic', 'positive', 'joy'];
  negativeWords = ['bad', 'sad', 'terrible', 'awful', 'negative', 'worst', 'angry'];

  // Handle file upload
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.textInput = e.target?.result as string;
      };
      reader.readAsText(file);
    }
  }

  // Sentiment analysis logic
  analyzeSentiment(): void {
    if (!this.textInput) {
      alert('Please enter or upload text!');
      return;
    }

    let score = 0;
    const words = this.textInput.toLowerCase().split(/\s+/);

    words.forEach(word => {
      if (this.positiveWords.includes(word)) score++;
      if (this.negativeWords.includes(word)) score--;
    });

    if (score > 0) {
      this.sentimentResult = 'Positive Sentiment 😊';
    } else if (score < 0) {
      this.sentimentResult = 'Negative Sentiment 😞';
    } else {
      this.sentimentResult = 'Neutral Sentiment 😐';
    }
  }
}
