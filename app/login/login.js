import { AuthenticationPageManager } from './controllers/AuthenticationPageManager.js';

/**
 * Função de inicialização do módulo de login
 * @returns {AuthenticationPageManager} Instância do gerenciador de autenticação
 */
export function initLogin() {
    return new AuthenticationPageManager();
}