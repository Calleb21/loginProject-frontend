import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";
import { Router } from "@angular/router";

bootstrapApplication(AppComponent, appConfig)
  .then((appRef) => {
    const router = appRef.injector.get(Router);
    router.events.subscribe(() => {
      const body = document.body;
      if (router.url === "/login") {
        body.classList.add("no-scroll");
      } else {
        body.classList.remove("no-scroll");
      }
    });
  })
  .catch((err) => console.error(err));
