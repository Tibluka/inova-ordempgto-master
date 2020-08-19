import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service'
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  returnUrl: string = ''

  user = {
    email: '',
    senha: ''
  }

  userForm: FormGroup = null;
  isSubmitted  =  false;
  loading:boolean = false;

  constructor(
    private _snackBar: MatSnackBar,
    private loginService: LoginService,
    public router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) {

      this.route.queryParams.subscribe(params => {
        this.returnUrl = params['returnUrl'];
      }); 

    }

  ngOnInit(): void {
    localStorage.removeItem('logged-user')

    this.userForm = this.formBuilder.group({
      email: ['', Validators.required],
      senha: ['', Validators.required]
    })
  }

  get formControls() { return this.userForm.controls; }

  login() {
    this.isSubmitted = true;
    
    if(this.userForm.invalid){
      this._snackBar.open('Por favor, preencha os campos', 'Ok', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
      return;
    }
    this.loading = true;
    this.loginService.logar(this.userForm.value)
    .then((data:any) => {
        if(data.codigo === 1) {
          let userData = {
            email: this.userForm.controls.email.value,
            nome: data.user.nome,
            timestamp: new Date()
          }
          localStorage.setItem('logged-user', JSON.stringify(userData))
          this.router.navigate([this.returnUrl ? this.returnUrl : 'ordens-pagamento'])
        } else {
          this.loading = false;
          this._snackBar.open('Os valores informados estão incorretos', 'Ok', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
    })
    .catch(err => {
        this.loading = false;
        if(err.status == 401) {
          this._snackBar.open('Os valores informados estão incorretos', 'Ok', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        } else {
          this._snackBar.open('Ocorreu um erro, por favor tente mais tarde', 'Ok', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
    })
  }
}
