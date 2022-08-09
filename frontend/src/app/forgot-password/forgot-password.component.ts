import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
forgotPasswordForm:any = FormGroup;
responseMessage :any;
  constructor(private formBuilder:FormBuilder,
    private userService: UserService,
    private dialogRef : MatDialogRef<ForgotPasswordComponent>,
    private ngxService: NgxUiLoaderService,
    private snackBar : SnackbarService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email:[null,[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]]
    })
  }

handleSubmit(){
  //this first section is getting the data from the form
  this.ngxService.start();
  var formData = this.forgotPasswordForm.value;
  var data = {
    email: formData.email
  }
  this.userService.forgotPassword(data).subscribe((response:any)=>
  {
    //this is the infor section
    this.ngxService.stop();
    this.responseMessage = response?.message;
    this.dialogRef.close();
    this.snackBar.openSnackBar(this.responseMessage,"");
  },(error:any)=>{
    //if there is an error give it to responseMessage
      this.ngxService.stop();
      if(error.error?.message){
          this.responseMessage = error.error?.message;
      }else{
        //if there is no error display the generic error in global constants file
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error)
  })
}

}
