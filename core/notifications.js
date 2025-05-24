/**
 * Classe utilitária para gerenciar notificações toast do Bootstrap
 */
export class NotificationService {
    /**
     * Exibe uma notificação toast
     * @param {string} title Título da notificação
     * @param {string} message Mensagem da notificação
     * @param {string} type Tipo da notificação (success, error, warning, info)
     */
    static showToast(title, message, type = 'success') {
        const toast = document.getElementById('appToast');
        const toastTitle = document.getElementById('toastTitle');
        const toastMessage = document.getElementById('toastMessage');
        
        // Remove classes existentes
        toast.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'text-white');
        
        // Adiciona classes baseadas no tipo
        switch (type) {
            case 'error':
                toast.classList.add('bg-danger', 'text-white');
                break;
            case 'warning':
                toast.classList.add('bg-warning');
                break;
            case 'info':
                toast.classList.add('bg-info', 'text-white');
                break;
            default:
                toast.classList.add('bg-success', 'text-white');
        }

        toastTitle.textContent = title;
        toastMessage.textContent = message;
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }
}
