import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { Validators } from '@angular/forms';
import { GlobalConstants } from '../shared/global-constants';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
loginForms : any = FormGroup;
responseMessage:any;
  constructor(private formBuilder:FormBuilder,
    private userService: UserService,
    private dialogRef : MatDialogRef<LoginComponent>,
    private ngxService: NgxUiLoaderService,
    private snackBar : SnackbarService,
    private router: Router) { }

  ngOnInit(): void {
    this.loginForms = this.formBuilder.group({
      email:[null,[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password: [null,[Validators.required]]
    })
  }

  handleSubmit(){
    this.ngxService.start();
    var formData = this.loginForms.value//giving values from the form to the formdata form
    var data={
      email: formData.email,
      password: formData.password
    }
    this.userService.login(data).subscribe((response:any)=>{
      this.ngxService.stop()

this.dialogRef.close();
localStorage.setItem('token', response.token);
this.router.navigate(['cafe/dashboard'])

    },(error)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }

}
