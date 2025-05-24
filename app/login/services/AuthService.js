export class AuthService {
    static USERS_STORAGE_KEY = 'registeredUsers';

    /**
     * Carrega a lista de usuários do localStorage
     * @returns {Array} Lista de usuários ou array vazio se não houver dados
     */
    static _loadUsers() {
        try {
            const usersJson = localStorage.getItem(AuthService.USERS_STORAGE_KEY);
            return usersJson ? JSON.parse(usersJson) : [];
        } catch {
            return [];
        }
    }

    /**
     * Salva a lista de usuários no localStorage
     * @param {Array} users Lista de usuários para salvar
     * @returns {boolean} true se salvou com sucesso, false caso contrário
     */
    static _saveUsers(users) {
        try {
            localStorage.setItem(AuthService.USERS_STORAGE_KEY, JSON.stringify(users));
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Realiza o login do usuário
     * @param {Object} formData Dados do formulário de login
     * @returns {Promise} Promise com o resultado do login
     */
    static async login(formData) {
        const users = AuthService._loadUsers();
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = users.find(
                    u => u.email === formData.email && u.senha === formData.senha
                );

                if (user) {
                    const userData = { email: user.email, nome: user.nome };
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    resolve({ message: 'Login bem-sucedido!', user: userData });
                } else {
                    reject(new Error('Credenciais inválidas.'));
                }
            }, 500);
        });
    }

    /**
     * Realiza o cadastro de um novo usuário
     * @param {Object} formData Dados do formulário de cadastro
     * @returns {Promise} Promise com o resultado do cadastro
     */
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
