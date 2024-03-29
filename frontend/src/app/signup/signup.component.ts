import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import {Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
signupForm: any = UntypedFormGroup;
responseMessage:any;
  constructor( private formBuilder: UntypedFormBuilder,
    private router : Router,
    private userService : UserService,
    private snackBar:SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>,
    private ngxService : NgxUiLoaderService
    ) { }

  ngOnInit(): void {
    this.signupForm = this .formBuilder.group({
      name: [null,[Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null,[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null,[Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      password:[null,[Validators.required]]
    })
  }
handleSubmit(){
  this.ngxService.start();
  var formData = this.signupForm.value
  var data = {
    name: formData.name,
    email: formData.email,
    contactNumber: formData.contactNumber,
    password: formData.password
  }
  this.userService.signUp(data).subscribe((response : any)=>{
    this.ngxService.stop();
    this.dialogRef.close();
    this.responseMessage = response?.message;
    this.snackBar.openSnackBar(this.responseMessage, "");
    this.router.navigate(['/']);
  },(error:any)=>{
    this.ngxService.stop();
    if(error.error?.message){
      this.responseMessage = error.error?.message;
    }
    else{
      this.responseMessage = GlobalConstants.genericError
    }
    this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
  })
}
}
