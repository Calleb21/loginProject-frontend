export interface ResetPasswordRequest {
  nomeCompleto: string;
  email: string;
  novaSenha: string;
  confirmacaoNovaSenha: string;
}