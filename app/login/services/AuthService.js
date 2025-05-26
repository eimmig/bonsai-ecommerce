import { getFromStorage, setToStorage, removeFromStorage } from '../../../core/functionUtils.js';

export class AuthService {
    static USERS_STORAGE_KEY = 'registeredUsers';
    static CURRENT_USER_KEY = 'currentUser';

    static _loadUsers() {
        try {
            return getFromStorage(AuthService.USERS_STORAGE_KEY, []);
        } catch {
            return [];
        }
    }

    static _saveUsers(users) {
        try {
            setToStorage(AuthService.USERS_STORAGE_KEY, users);
            return true;
        } catch {
            return false;
        }
    }

    static getCurrentUser() {
        try {
            return getFromStorage(AuthService.CURRENT_USER_KEY, null);
        } catch {
            return null;
        }
    }

    static logout() {
        try {
            removeFromStorage(AuthService.CURRENT_USER_KEY);
            document.body.classList.remove('is-logged-in');
            document.dispatchEvent(new CustomEvent('user-logged-out'));
            return true;
        } catch {
            return false;
        }
    }

    static async login(formData) {
        const users = AuthService._loadUsers();
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = users.find(
                    u => u.email === formData.email && u.senha === formData.senha
                );

                if (user) {
                    const userData = { email: user.email, nome: user.nome };
                    setToStorage(AuthService.CURRENT_USER_KEY, userData);
                    document.body.classList.add('is-logged-in');
                    resolve({ message: 'Login bem-sucedido!', user: userData });
                } else {
                    reject(new Error('Credenciais inválidas.'));
                }
            }, 500);
        });
    }

    static async signup(formData) {
        const users = AuthService._loadUsers();

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!formData.email || !formData.senha || !formData.nome) {
                    return reject(new Error('Dados de cadastro incompletos.'));
                }

                if (users.some(u => u.email === formData.email)) {
                    return reject(new Error('E-mail já cadastrado.'));
                }

                const newUser = {
                    nome: formData.nome,
                    cpf_cnpj: formData.cpf_cnpj,
                    telefone: formData.telefone,
                    email: formData.email,
                    senha: formData.senha,
                };

                users.push(newUser);
                if (AuthService._saveUsers(users)) {
                    resolve({ message: 'Cadastro bem-sucedido!' });
                } else {
                    reject(new Error('Erro ao salvar dados de cadastro.'));
                }
            }, 500);
        });
    }
}
