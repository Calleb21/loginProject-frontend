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
import { ResetPasswordRequest } from "../../models/resetPassword-request.model"; // Importar a nova interface

interface ResetPasswordForm {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  passwordConfirm: FormControl<string | null>;
}

@Component({
  selector: "app-resetPassword",
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent,
  ],
  providers: [LoginService],
  templateUrl: "./resetPassword.component.html",
  styleUrls: ["./resetPassword.component.scss"],
})
export class ResetPasswordComponent {
  resetPasswordForm!: FormGroup<ResetPasswordForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.resetPasswordForm = new FormGroup<ResetPasswordForm>(
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
    if (this.resetPasswordForm.valid) {
      const request: ResetPasswordRequest = {
        nomeCompleto: this.resetPasswordForm.value.name || "",
        email: this.resetPasswordForm.value.email || "",
        novaSenha: this.resetPasswordForm.value.password || "",
        confirmacaoNovaSenha: this.resetPasswordForm.value.passwordConfirm || "",
      };

      this.loginService.resetPassword(request).subscribe({
        next: () => this.toastService.success("Senha alterada com sucesso!"),
        error: (err) => {
          console.error(err);
          const errorMessage = err.error || "Erro ao alterar senha! Tente novamente mais tarde";
          this.toastService.error(errorMessage);
        },
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
