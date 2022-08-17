import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { UserService } from '../services/user.service';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private dialog: MatDialog,
    private router:Router,
    private userService : UserService,
    
    ) { }

  ngOnInit(): void {
    /*
    check if token exists in the local storage
    this if statement is if there is no token
    != null means token exists

    */
    if(localStorage.getItem('token') != null){
     this.userService.checkToken().subscribe((response:any)=>{
      this.router.navigate(['/cafe/dashboard'])
     },(error:any)=>{
      console.log(error);
     }) 
    }
  }
  signupAction(){
    //this creates a 550 px box that calls the signup component
const dialogConfig = new MatDialogConfig;
dialogConfig.width= "550px"
this.dialog.open(SignupComponent, dialogConfig);
// opens the signup component and displays the width of the box with dialogConfig

  }
  loginAction(){
const dialogConfig = new MatDialogConfig;
dialogConfig.width = "550px";
this.dialog.open(LoginComponent, dialogConfig)
  }

  forgotPasswordAction(){
const dialogConfig = new MatDialogConfig;
dialogConfig.width = "550px";
this.dialog.open(ForgotPasswordComponent, dialogConfig);
  }

 
}
