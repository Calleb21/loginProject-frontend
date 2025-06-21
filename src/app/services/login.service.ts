import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginResponse } from "../types/login-response.type";
import { LoginRequest } from "../models/login-request.model";
import { SignupRequest } from "../models/signup-request.model";
import { tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private apiUrl = "http://localhost:8080/api/usuarios"; // Base URL do backend

  constructor(private httpClient: HttpClient) {}

  login(request: LoginRequest, password: any) {
    return this.httpClient
      .post<LoginResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap((value) => {
          sessionStorage.setItem("auth-token", value.token);
          sessionStorage.setItem("username", value.name);
        })
      );
  }

  signup(data: {
    nomeCompleto: string;
    email: string;
    senha: string;
    confirmacaoSenha: string;
  }) {
    return this.httpClient.post(`${this.apiUrl}/signup`, data);
  }
}
