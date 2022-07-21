import { Component, OnInit, EventEmitter, Injectable} from '@angular/core';
import{MAT_DIALOG_DATA} from '@angialar/material/dialog'

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {


onEmitStatusChange = new EventEmitter()
details : any = {}
  constructor(@Injectable(MAT_DIALOG_DATA) public dialogData: any) { }

  ngOnInit(): void {
    if(this.dialogData){
      this.details = this.dialogData;
    }

  }

handleChangeAction(){
  this.onEmitStatusChange.emit();
}


}
