import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { SignupComponent } from "./pages/singup/singup.component";
import { ResetPasswordComponent } from "./pages/resetPassword/resetPassword.component";

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "signup",
    component: SignupComponent,
  },
  {
    path: "resetPassword",
    component: ResetPasswordComponent,
  },
];
