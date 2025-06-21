import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginResponse } from "../types/login-response.type";
import { LoginRequest } from "../models/login-request.model"; // Importar a nova interface
import { tap } from "rxjs";

@Injectable({
  providedIn: "root",
} )
export class LoginService {
  private apiUrl = 'http://localhost:8080/api/usuarios'; // Base URL do backend

  constructor(private httpClient: HttpClient ) {}

  login(request: LoginRequest, password: any) { // Alterar para receber LoginRequest
    return this.httpClient
      .post<LoginResponse>(`${this.apiUrl}/login`, request ) // Usar a URL completa e o objeto request
      .pipe(
        tap((value) => {
          sessionStorage.setItem("auth-token", value.token);
          sessionStorage.setItem("username", value.name);
        })
      );
  }
}
