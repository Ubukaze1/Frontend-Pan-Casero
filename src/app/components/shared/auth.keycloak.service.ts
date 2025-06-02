import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
    providedIn: 'root'
})
export class KeycloakService {
    keycloak: Keycloak;

    constructor() {
        this.keycloak = new Keycloak({
            url: 'http://localhost:8080/',
            realm: 'nestjs-realm',
            clientId: 'nestjs-api',
        });
    }

    init(): Promise<boolean> {
        return this.keycloak.init({
            onLoad: 'check-sso', // ← verifica si hay sesión activa pero NO redirige
            checkLoginIframe: true,
        });
    }

    async getToken(): Promise<string | undefined> {
        if (this.keycloak?.token) {
            await this.keycloak.updateToken(30); // opcional: refresca token si va a expirar
            return this.keycloak.token;
        }
        return undefined;
    }


    isLoggedIn(): boolean {
        return !!this.keycloak.token;
    }

    getUsername(): string {
        return this.keycloak.profile?.username || '';
    }

    getRoles(): string[] {
        return this.keycloak.realmAccess?.roles || [];
    }

    logout(): void {
        this.keycloak.logout({
            redirectUri: 'http://localhost:4200/',
        });
    }

    login(): void {
        this.keycloak.login({
            redirectUri: 'http://localhost:4200/',
        });
    }
}
