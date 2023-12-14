import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import textJson from '../assets/test.json';
interface Label {
  label: String;
  active: boolean;
  color: String;
}
interface Word {
  word:String;
  label:String;
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  implements OnInit{
  texte=''
  texteTab:Word[]=[];
  listOfLabels:Label[]  = [];
  colors = ['btn-primary', 'btn-secondary', 'btn-success', 'btn-danger',  'btn-dark'];
  ngOnInit(): void {
    textJson.document.match(/(?:\W+)|\w+/g)?.forEach((word)=>{
      this.texteTab.push({word:word,label:''});
    });
    console.log(this.texteTab)
    for (const word of this.texteTab) {
      this.texte += `<span>${word.word}</span>`;
    }
  }
   addNewLabel():void{
     const labelsElement = <HTMLInputElement>document.getElementById('labels');
     if (labelsElement && labelsElement.value) {
       const userInput = labelsElement.value; // Now userInput is guaranteed to be defined
       this.listOfLabels.push({ label: userInput, active: false, color: this.colors[Math.floor(Math.random() * this.colors.length)] });
       labelsElement.value = '';
     } else {
      throw new Error('input is empty');    }
     console.log(this.listOfLabels);
   }

  setActiveLabel(label: Label) {
    this.listOfLabels.forEach((label) => {
      label.active = false;
    });
    label.active = true;

  }
  setLabel(){
  const  texte=document.getElementById('document')!;
  texte.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const clickedWord =target.textContent!;
    if (clickedWord) {
      const startIndex = target.textContent!.indexOf(clickedWord);
      const endIndex = startIndex + clickedWord.length;

      console.log(
        `You clicked on the word "${clickedWord}" at positions: ${startIndex}-${endIndex}`
      );
    } else {
      console.log("Click did not land on a word.");
    }

  });
}}
