import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import {NgxUiLoaderService} from 'ngx-ui-loader'
import { GlobalConstants } from '../shared/global-constants';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
signupForm : any = FormGroup;
responseMessage : any;

  constructor(private formBuilder : FormBuilder,
    private router: Router,
    private userService : UserService,
    private snackbar : SnackbarService,
    private dialogRef : MatDialogRef<SignupComponent>,
    private ngxService : NgxUiLoaderService) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactRegex)]],
      password: [null, [Validators.required, Validators.pattern(GlobalConstants.passwordRegex)]],

    })
  }

  handlesSubmit(){
    this.ngxService.start();
    var formData = this.signupForm.value;
    var data = {
      name : formData.name,
      email: formData.email,
      contactNumber: formData.contactNUmber,
      password : formData.password
  
    }
    this.userService.signUp(data).subscribe((response: any) => {
      this.ngxService.stop();
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.snackbar = openSnackBar(this.responseMessage, "");
      this.router.navigate(['/']);
    }, (error) =>{
  this.ngxService.stop();
  if(error.error?.message){
    this.responseMessage = error.error?.message;
  
  }
  else{
    this.responseMessage = GlobalConstants.genericError
  
  }
  this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }
}

//time 4:22:01