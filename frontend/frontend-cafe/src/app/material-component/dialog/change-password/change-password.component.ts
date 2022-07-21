import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { MatDialogRef} from '@angualr/amterial/dialog'
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
changePasswordForm: any  = FormGroup

responseMesage : any;
  constructor( private formBuilder: FormBuilder,
    private userService : UserService,
    public dialogRef : MatDialogRef<ChangePasswordComponent> , 
    private ngxService : NgxUiLoaderService,
    private snackBar : SnackbarService) { }

  ngOnInit(): void {
  this.changePasswordForm = this.formBuilder.group({
    oldPassword : [null, [Validators.required]],
    newPassword: [null, [Validators.required]],
    confrimPassword :  [null, [Validators.required]],
  })
  
  }

validateSubmit(){
  if(this.changePasswordForm.contorls['newPassword'].value != this.changePasswordForm.controls['confirmPassword'].value){
    return true
  }
  else{
    return false
  }
}
handleChangePasswordSubmite(){
  this.ngxService.start();
  var formData = this.changePasswordForm.value
  var data = {
    oldPassword: formData.oldPassword,
    newPassword:  formData.newPassword,
    confirmPassword:  formData.confirmPassword,
  }
  this.userService.changePassword(data).subscribe((response:any)=>{
    this.ngxService.stop()
    this.responseMesage = response?.message
    this.dialogRef.close()
    this.snackBar.openSnackBar(this.responseMesage, "success")
  },(error)=>{
    console.log(error)
    this.ngxService.stop()
    if(error.erro?.message){
this.responseMesage = error.error?.message;

    }
    else{
      this.responseMesage = GlobalConstants.genericError
    }
  this.snackBar.openSnackBar(this.responseMesage, GlobalConstants.error)
  
  })
}
}
