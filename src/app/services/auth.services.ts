import { NgZone } from '@angular/core';

import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';

import { map } from 'rxjs/operators';

import {

  FormBuilder,
  FormGroup,
  FormControl,
  Validators } from '@angular/forms';

import { FlashMessagesService } from 'angular2-flash-messages';

import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from 
       '@angular/router';

import { AngularFireAuth } from "@angular/fire/auth"; 

import * as firebase from "firebase"; 

import { NgxSpinnerService } from 'ngx-spinner';

declare var Auth0Lock;

@Injectable()

export class AuthService {
	
  constructor(
    private http: Http, 
    private ngZone: NgZone, 
    private router: Router, 
    private flash: FlashMessagesService,
    private afAuth: AngularFireAuth,
    private spinner: NgxSpinnerService,
  ) {}

  flag : boolean = false;

  getAuth() { 
    return this.afAuth.auth; 
  } 
  /** 
   * Initiate the password reset process for this user 
   * @param email email of the user 
   */ 
  resetPasswordInit(email: string) { 
  
    return this.afAuth.auth.sendPasswordResetEmail(
      email); 
  } 



  login(key: FormGroup) {
    
    var headers = new Headers();
    headers.append('content-Type','application/json');
    console.log("From Login() function.............");
    console.log(key.value.email);

    return this.http.post('https://angular7-shopping-cart.herokuapp.com/api/login', 
    // return this.http.post('http://localhost:3000/api/login', 
        key.value, {
          headers:headers
      }).pipe(map(res => res.json()))


  }

  logout() {

    this.spinner.show();
    
    var email = localStorage.getItem('email');

    let body=JSON.stringify({ 
      email: email
    });

    var headers = new Headers();
    headers.append('content-Type','application/json');

    return this.http.post('https://angular7-shopping-cart.herokuapp.com/api/logout', 
    // return this.http.post('http://localhost:3000/api/logout', 
      body, {
        headers:headers
    }).pipe(map(res => res.json()))
    .subscribe(
      data => {            
      
        console.log(data);

        if(data.message == 'success'){

          localStorage.removeItem('email');
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          this.flag = false;
          this.spinner.hide();
          this.loggedIn();
          this.flash.show('LoggedOut successfully', { timeout: 3000,cssClass: 'alert-success' });
          this.router.navigate(['/']);

        }else{
          
          this.flash.show('Some problem with logout', { timeout: 3000,cssClass: 'alert-success' });
        }
    });
  }

  loggedIn() {

    if(localStorage.getItem('email')) {

      return true;
    }

    return false;
  }

  role(){

    // console.log(localStorage.getItem('role'));
    var userrole : string;
    userrole = localStorage.getItem('role'); 
    
    if(userrole == "1") {

      return true;
    }else{

      return false;  
    }  
  }

  create(key: any) {

    // console.log(key.value.profile.name);

    const formData = new FormData(); 

    formData.append('profile', key.value.profile, key.value.profile.name);
    // formData.append("profile", 
    //   {uri: key.value.profile, name: 'image.jpg', type: 'multipart/form-data'});
    formData.append('email', key.value.email);
    formData.append('username', key.value.username);
    formData.append('password', key.value.password);

    console.log(formData.get("username"));
    console.log(formData.get("email"));

    let headers = new Headers();
    // headers.append('Content-Type', 'multipart/form-data');
    headers.append('x-token', '5');
    // headers.append('Accept', 'application/json');

    // return this.http.post('http://localhost:3000/api/register1', 
    return this.http.post('https://angular7-shopping-cart.herokuapp.com/api/register1',   
      formData,
      {headers}
    ).pipe(map(res => res.json()));
  }

  resetPasswordMongo(email, password){

    let body=JSON.stringify({ 
        email: email,
        password: password
    });

    var headers = new Headers();
    headers.append('content-Type','application/json');
    // return this.http.post('http://localhost:3000/api/reset-password', 
    return this.http.post('https://angular7-shopping-cart.herokuapp.com/api/reset-password',   
      body, 
      {
        headers:headers
      }).pipe(map(res => res.json()));  
  }

  getAllUsers(){

    let headers = new Headers();
    // headers.append('Content-Type', 'multipart/form-data');
    headers.append('x-token', '5');

    return this.http.get(
      // 'http://localhost:3000/api/all-users',
      'https://angular7-shopping-cart.herokuapp.com/api/all-users',
      {
        headers: headers
      }).pipe(map(res => res.json()));  
  }

  getAllLoggedIn(){

    let headers = new Headers();
    // headers.append('Content-Type', 'multipart/form-data');
    headers.append('x-token', '5');

    return this.http.get(
      // 'http://localhost:3000/api/all-loggedin',
      'https://angular7-shopping-cart.herokuapp.com/api/all-loggedin',
      {
        headers: headers
      }).pipe(map(res => res.json()));  
  }

  deleteLoggedIn(data:any) {

    console.log(data);
    let headers = new Headers();
    // headers.append('Content-Type', 'multipart/form-data');
    headers.append('x-token', '5');

    return this.http.delete(
      // 'http://localhost:3000/api/delete-loggedin/'+data._id,
      'https://angular7-shopping-cart.herokuapp.com/api/delete-loggedin/'+data._id,
      {
        headers: headers
    }).pipe(map(res => res.json()));   
  }

  deleteUser(data:any) {

    console.log(data);
    let headers = new Headers();
    // headers.append('Content-Type', 'multipart/form-data');
    headers.append('x-token', '5');

    return this.http.delete(
      // 'http://localhost:3000/api/delete-user/'+data._id,
      'https://angular7-shopping-cart.herokuapp.com/api/delete-user/'+data._id,
      {
        headers: headers
    }).pipe(map(res => res.json()));   
  }

  updateLoggedIn(data:any) {

    console.log(data);
    let headers = new Headers();
    // headers.append('Content-Type', 'multipart/form-data');
    headers.append('x-token', '5');

    return this.http.put(
      // 'http://localhost:3000/api/update-loggedin',
      'https://angular7-shopping-cart.herokuapp.com/api/update-loggedin',
      data,
      {
        headers: headers
    }).pipe(map(res => res.json()));   
  }

  updateUser(data:any) {

    console.log(data);
    let headers = new Headers();
    // headers.append('Content-Type', 'multipart/form-data');
    headers.append('x-token', '5');

    return this.http.put(
      // 'http://localhost:3000/api/update-user',
      'https://angular7-shopping-cart.herokuapp.com/api/update-user',
      data,
      {
        headers: headers
    }).pipe(map(res => res.json()));   
  }
}