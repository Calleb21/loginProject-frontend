import { Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from "@angular/forms";
import { DefaultLoginLayoutComponent } from "../../components/default-login-layout/default-login-layout.component";
import { PrimaryInputComponent } from "../../components/primary-input/primary-input.component";
import { Router } from "@angular/router";
import { LoginService } from "../../services/login.service";
import { ToastrService } from "ngx-toastr";

interface SignupForm {
  name: FormControl;
  email: FormControl;
  password: FormControl;
  passwordConfirm: FormControl;
}

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent,
  ],
  providers: [LoginService],
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent {
  signupForm!: FormGroup<SignupForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.signupForm = new FormGroup<SignupForm>(
      {
        name: new FormControl("", [
          Validators.required,
          Validators.minLength(3),
        ]),
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [
          Validators.required,
          this.customPasswordValidator(),
        ]),
        passwordConfirm: new FormControl("", [
          Validators.required,
          Validators.minLength(6),
        ]),
      },
      { validators: this.passwordMatchValidator() }
    );
  }

  submit() {
    if (this.signupForm.valid) {
      const { email, password } = this.signupForm.value;
      this.loginService.login(email, password).subscribe({
        next: () => this.toastService.success("Usuário criado com sucesso!"),
        error: () =>
          this.toastService.error(
            "Erro inesperado! Tente novamente mais tarde"
          ),
      });
    } else {
      this.toastService.error("Por favor, corrija os erros no formulário.");
    }
  }

  navigate() {
    this.router.navigate(["login"]);
  }

  private customPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;

      if (password.length < 11 || password.length > 15) {
        return {
          passwordLength: "Password must be between 11 and 15 characters long",
        };
      }
      if (!/[A-Z]/.test(password)) {
        return {
          uppercaseLetter:
            "Password must contain at least one uppercase letter",
        };
      }
      if (!/[0-9]/.test(password)) {
        return { number: "Password must contain at least one number" };
      }
      if (!/[!@#$%^&*]/.test(password)) {
        return {
          specialCharacter:
            "Password must contain at least one special character",
        };
      }
      return null; // Password is valid
    };
  }

  // Validator to check if password and confirm password match
  private passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get("password")?.value;
      const passwordConfirm = formGroup.get("passwordConfirm")?.value;
      return password && passwordConfirm && password !== passwordConfirm
        ? { passwordMismatch: "Passwords must match" }
        : null;
    };
  }
}
