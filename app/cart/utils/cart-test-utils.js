import { CartUtils } from './cart-utils.js';
import { NotificationService } from '../../../core/notifications.js';

export class CartTestUtils {
    /**
     * Adiciona um item de teste ao carrinho para fins de demonstração
     */
    static addTestItem() {
        try {
            // Verifica se há produtos disponíveis no localStorage
            const productsJson = localStorage.getItem('products');
            if (!productsJson) {
                NotificationService.showToast('Erro', 'Não foi possível carregar os produtos', 'error');
                return false;
            }
            
            const products = JSON.parse(productsJson);
            if (!products.produtos || !products.produtos.length) {
                NotificationService.showToast('Erro', 'Não há produtos disponíveis', 'error');
                return false;
            }
            
            // Seleciona o primeiro produto disponível
            const firstProduct = products.produtos[0];
            const cartUtils = new CartUtils();
            
            // Adiciona ao carrinho
            const result = cartUtils.addToCart(firstProduct.id, 1);
            
            if (result) {
                NotificationService.showToast(
                    'Item de teste adicionado', 
                    `${firstProduct.nome} foi adicionado ao carrinho para teste`,
                    'success'
                );
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Erro ao adicionar item de teste:', error);
            NotificationService.showToast('Erro', 'Falha ao adicionar item de teste', 'error');
            return false;
        }
    }
}
