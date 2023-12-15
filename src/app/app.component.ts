import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import textJson from '../assets/test.json';
import {ToastrService} from "ngx-toastr";

interface Label {
  label: String;
  active: boolean;
  color: String;
}

interface Word {
  word: String;
  label: String;
  start?: number;
  end?: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  texte = ''
  texteTab: Word[] = [];
  listOfLabels: Label[] = [];
  labeledText: Word[] = [];
  colors = ['primary', 'secondary', 'success', 'danger', 'dark'];

  constructor(private toastr: ToastrService) {
  }

  ngOnInit(): void {
    textJson.document.match(/(?:\W+)|\w+/g)?.forEach((word) => {
      this.texteTab.push({word: word, label: ''});
    });
    for (const word of this.texteTab) {
      this.texte += `<span>${word.word} </span>`;
    }
  }

  addNewLabel(): void {
    const labelsElement = <HTMLInputElement>document.getElementById('labels');
    if (labelsElement && labelsElement.value) {
      const userInput = labelsElement.value; // Now userInput is guaranteed to be defined
      this.listOfLabels.push({
        label: userInput,
        active: false,
        color: this.colors[Math.floor(Math.random() * this.colors.length)]
      });
      labelsElement.value = '';
    } else {
      throw new Error('input is empty');
    }
  }

  setActiveLabel(label: Label) {
    this.listOfLabels.forEach((label) => {
      label.active = false;
    });
    label.active = true;

  }

  setLabel() {
    const texte = document.getElementById('document')!;
    texte.addEventListener('click', (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      const selectedLabel = this.listOfLabels.find((label) => label.active);
      const target = e.target as HTMLElement;
      const targetParent = target.parentElement as HTMLElement;
      const clickedWord = target.innerHTML;
      if(this.labeledText.find((word) =>{return  word.word === clickedWord && word.label == selectedLabel!.label})){
        return ;
      }
     if( this.labeledText.find((word) =>{return  word.word === clickedWord && word.label != selectedLabel!.label})){
         this.labeledText.splice(this.labeledText.findIndex((word) =>{return  word.word === clickedWord && word.label != selectedLabel!.label}),1
       )     }
      if (!this.labeledText.find((word) => word.word === clickedWord && word.label == selectedLabel!.label)) {
        const startIndex = textJson.document.indexOf(clickedWord);
        const endIndex = startIndex + clickedWord.length;
        const postWord = this.labeledText.find((word) => {
          return ((textJson.document.substring(endIndex, word.start).match(/\W+/g)?.length==1) && word.label == selectedLabel!.label)
        });
        const preWord = this.labeledText.find((word) => {
          return ((textJson.document.substring(<number>word.end, startIndex).match(/\W+/g)?.length==1) && word.label == selectedLabel!.label)
        });
        const color = selectedLabel!.color;
        console.log(preWord, postWord, startIndex, endIndex, clickedWord)
        if (preWord) {
          console.log("pre")
          preWord.end = endIndex;
          preWord.word = textJson.document.substring(preWord.start!, preWord.end!);
          target.className = `badge text-bg-${color}`;

        }
        if (postWord) {
          console.log("post")
          postWord.start = startIndex;
          postWord.word = textJson.document.substring(postWord.start!, postWord.end!);
          target.className = `badge text-bg-${color}`;

        }
        if (preWord == undefined && postWord == undefined) {
          console.log(clickedWord.match(/\w+/g)![0])
          const selectedWord = this.texteTab.find((word) => word.word === clickedWord.match(/\w+/g)![0]);
          console.log("zedt")
          selectedWord!.start = startIndex;
          selectedWord!.end = endIndex;
          selectedWord!.label = selectedLabel!.label;
          target.className = `badge text-bg-${color}`;
          this.labeledText.push(selectedWord!);
        }
        console.log(this.labeledText)
      } else {
        this.toastr.warning("you haven't clicked on a word", '', {
          timeOut: 1000,
          toastClass:
            'h-20  w-56 absolute top-0 right-0.5 transform -translate-x-10 text-gray-500 p-3 rounded-md  bg-yellow-200',
        });
      }

    });
  }

  //todo: add a function to update annotations
  updateAnnotation() {

  }

}
