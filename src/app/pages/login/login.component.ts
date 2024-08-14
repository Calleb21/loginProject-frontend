import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,  
  ValidationErrors, 
} from '@angular/forms';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';


interface LoginForm {
  email: FormControl;
  password: FormControl;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent,
  ],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup<LoginForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        this.customPasswordValidator(),
      ]),
    });
  }

  submit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.loginService
        .login(email, password)
        .subscribe({
          next: () => this.toastService.success('Login feito com sucesso!'),
          error: () =>
            this.toastService.error(
              'Erro inesperado! Tente novamente mais tarde'
            ),
        });
    }
  }

  navigate() {
    this.router.navigate(['signup']);
  }

  // Custom password validator function
  private customPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      if (password.length !== 11) {
        return { passwordLength: 'Password must be exactly 11 characters long' };
      }

      if (!/[A-Z]/.test(password)) {
        return { uppercaseLetter: 'Password must contain at least one uppercase letter' };
      }

      if (!/[0-9]/.test(password)) {
        return { number: 'Password must contain at least one number' };
      }

      if (!/[!@#$%^&*]/.test(password)) {
        return { specialCharacter: 'Password must contain at least one special character' };
      }

      return null;  // Password is valid
    };
  }
}

type ValidatorFn = (control: AbstractControl) => ValidationErrors | null;
