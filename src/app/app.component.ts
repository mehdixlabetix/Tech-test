import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import textJson from '../assets/test.json';
import {ToastrService} from "ngx-toastr";
import {HttpClient} from '@angular/common/http';

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

  constructor(private toastr: ToastrService,private http: HttpClient) {
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
      const userInput = labelsElement.value;
      if (this.listOfLabels.find((label) => label.label === userInput)) {
        this.toastr.warning("label already exists", 'warning', {
          timeOut: 1000,        });
      labelsElement.value = '';
      throw new Error('label already exists');}
      this.listOfLabels.push({
        label: userInput,
        active: false,
        color: this.colors[Math.floor(Math.random() * this.colors.length)]
      });
      labelsElement.value = '';
    } else {
      this.toastr.error("Input is empty", 'error', {
        timeOut: 1000,

      });
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
      const clickedWord = target.innerHTML.match(/\w+/g)![0];
      if(this.labeledText.find((word) =>{return  word.word === clickedWord && word.label == selectedLabel!.label})){
        return ;
      }
     if( this.labeledText.find((word) =>{return  word.word === clickedWord && word.label != selectedLabel!.label})){
         this.labeledText.splice(this.labeledText.findIndex((word) =>{return  word.word === clickedWord && word.label != selectedLabel!.label}),1
       )     }
      if (!this.labeledText.find((word) => word.word === clickedWord && word.label == selectedLabel!.label)) {
        const startIndex = textJson.document.indexOf(clickedWord);
        const endIndex = startIndex + clickedWord.length;
        const color = selectedLabel!.color;
          const selectedWord = this.texteTab.find((word) => word.word === clickedWord);
          selectedWord!.start = startIndex;
          selectedWord!.end = endIndex;
          selectedWord!.label = selectedLabel!.label;
          target.className = `badge text-bg-${color}`;
          target.innerHTML= `${clickedWord} <span class="badge text-bg-light "> ${selectedLabel!.label}</span>`;
          this.labeledText.push(selectedWord!);
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
   save(){
    this.http.post('https://localhost:3000/api/annotations',this.labeledText)
      .subscribe(data => {
        console.log(data)
        this.updateAnnotation();
        this.toastr.success('saved', '', {
          timeOut: 1000,
          toastClass:
            'h-20  w-56 absolute top-0 right-0.5 transform -translate-x-10 text-gray-500 p-3 rounded-md  bg-green-200',
        });
      });
   }
  updateAnnotation() {
    this.http.get('https://localhost:3000/api/annotations')
      .subscribe(data => {

        console.log(data)      });
  }

}
