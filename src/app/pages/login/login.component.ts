import { Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DefaultLoginLayoutComponent } from "../../components/default-login-layout/default-login-layout.component";
import { PrimaryInputComponent } from "../../components/primary-input/primary-input.component";
import { Router } from "@angular/router";
import { LoginService } from "../../services/login.service";
import { ToastrService } from "ngx-toastr";
import { LoginRequest } from "../../models/login-request.model";

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
      password: new FormControl("", [Validators.required]),
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      this.toastService.error("Por favor, preencha e-mail e senha.");
      return;
    }

    const request: LoginRequest = {
      email: this.loginForm.value.email || '',
      senha: this.loginForm.value.password || ''
    };

    this.loginService.login(request).subscribe({
      next: () => {
        this.toastService.success("Login feito com sucesso!");
        window.location.href = "https://github.com";
      },
      error: (err: Error) => {
        this.toastService.error(err.message);
      },
    });
  }

  navigate() {
    window.location.href = "https://github.com/signup";
  }
}