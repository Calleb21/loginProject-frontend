import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginResponse } from "../types/login-response.type";
import { LoginRequest } from "../models/login-request.model";
import { ResetPasswordRequest } from "../models/resetPassword-request.model";
import { Observable, throwError } from "rxjs";
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private apiUrl = "http://localhost:8080/api/usuarios"; 

  constructor(private httpClient: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.httpClient
      .post(`${this.apiUrl}/login`, request, { responseType: 'text' })
      .pipe(
        map((response: string) => {
          try {
            const jsonResponse = JSON.parse(response);
            if (jsonResponse && jsonResponse.token && jsonResponse.name) {
              return jsonResponse as LoginResponse;
            }
            throw new Error('Formato de resposta de login inesperado.');
          } catch (e: unknown) {
            let errorMessage = 'Erro ao parsear resposta de login.';
            if (e instanceof Error) {
              errorMessage += ': ' + e.message;
            }
            throw new Error(errorMessage);
          }
        }),
        tap((value) => {
          sessionStorage.setItem("auth-token", value.token);
          sessionStorage.setItem("username", value.name);
        }),
        catchError(this.handleError)
      );
  }

  signup(data: {
    nomeCompleto: string;
    email: string;
    senha: string;
    confirmacaoSenha: string;
  }): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/signup`, data, { responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
  }

  resetPassword(request: ResetPasswordRequest): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/resetPassword`, request).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro desconhecido!';

    if (error.status === 0) {
      errorMessage = 'Não foi possível conectar ao servidor. Verifique sua rede.';
    } else if (error.error) {
      if (error.error.erros && Array.isArray(error.error.erros)) {
        errorMessage = error.error.erros.join('\n');
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      }
    }

    console.error("Erro na API:", errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
