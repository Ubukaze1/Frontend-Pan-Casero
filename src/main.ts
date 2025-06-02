import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { KeycloakService } from './app/components/shared/auth.keycloak.service';

const keycloakService = new KeycloakService();

keycloakService.init().then(() => {
  // Inyectar el servicio manualmente en appConfig si es necesario
  bootstrapApplication(AppComponent, {
    ...appConfig,
    providers: [
      ...(appConfig.providers || []),
      { provide: KeycloakService, useValue: keycloakService },
    ],
  }).catch((err) => console.error(err));
}).catch(err => {
  console.error('Keycloak initialization failed', err);
});
