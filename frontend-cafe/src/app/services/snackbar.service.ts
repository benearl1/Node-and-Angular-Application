import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackbar : MatSnackBar) { }
  openSnackBar(message : string, action:string){
    if(action === 'error'){
      this.snackbar.open(message, '',{
        horizontalPosition : 'center',
        veritcalPosition : 'top',
        duration : 2000,
        panelClass : ['black-snackbar']
      });
    }
    else {
      this.snackbar.open(message, '',{
        horizontalPosition : 'center',
        veritcalPosition : 'top',
        duration : 2000,
        panelClass : ['green-snackbar']
      });
    }
  }
}
