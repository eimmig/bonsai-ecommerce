export class AuthService {
    static USERS_STORAGE_KEY = 'registeredUsers';
    static CURRENT_USER_KEY = 'currentUser';

    static _loadUsers() {
        try {
            const usersJson = localStorage.getItem(AuthService.USERS_STORAGE_KEY);
            return usersJson ? JSON.parse(usersJson) : [];
        } catch {
            return [];
        }
    }

    static _saveUsers(users) {
        try {
            localStorage.setItem(AuthService.USERS_STORAGE_KEY, JSON.stringify(users));
            return true;
        } catch {
            return false;
        }
    }

    static getCurrentUser() {
        try {
            const userData = localStorage.getItem(AuthService.CURRENT_USER_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch {
            return null;
        }
    }

    static logout() {
        try {
            localStorage.removeItem(AuthService.CURRENT_USER_KEY);
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
                    localStorage.setItem(AuthService.CURRENT_USER_KEY, JSON.stringify(userData));
                    
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
