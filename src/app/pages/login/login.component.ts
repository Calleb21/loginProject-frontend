import { Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { DefaultLoginLayoutComponent } from "../../components/default-login-layout/default-login-layout.component";
import { PrimaryInputComponent } from "../../components/primary-input/primary-input.component";
import { Router } from "@angular/router";
import { LoginService } from "../../services/login.service";
import { ToastrService } from "ngx-toastr";
import { LoginRequest } from "../../models/login-request.model"; // Importar a nova interface

interface LoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent,
  ],
  providers: [LoginService],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  loginForm!: FormGroup<LoginForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        // Remover a validação customizada de senha aqui, pois ela será feita no backend
      ]),
    });
  }

  submit() {
    if (this.loginForm.valid) {
      const request: LoginRequest = { // Criar um objeto LoginRequest
        email: this.loginForm.value.email || '',
        senha: this.loginForm.value.password || ''
      };

      // AQUI ESTÁ A CORREÇÃO: Passando apenas 'request' para o método login
      this.loginService.login(request).subscribe({
        next: () => this.toastService.success("Login feito com sucesso!"),
        error: (err: Error) => { // Tipar 'err' como Error
          console.error(err);
          const errorMessage = err.message || "Erro inesperado! Tente novamente mais tarde";
          this.toastService.error(errorMessage);
        },
      });
    }
  }

  navigate() {
    this.router.navigate(["signup"]);
  }

  // O método customPasswordValidator pode ser removido se não for mais usado em outro lugar
  // private customPasswordValidator(): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const password = control.value;
  //     // ... lógica de validação ...
  //     return null; // Password is valid
  //   };
  // }
}
