import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private rotuer: Router, 
    ) { }

public isAuthenticated(): boolean{
  const token = localStorage.getItem('token')
  if(!token){
    this.rotuer.navigate(["/"])
    return false
  }
  else{
    return true
  }
}

  }
