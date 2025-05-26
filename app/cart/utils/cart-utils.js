/**
 * Utilitário para gerenciar o carrinho de compras
 */
import { NotificationService } from '../../../core/notifications.js';
import { getFromStorage, setToStorage } from '../../../core/functionUtils.js';

export class CartUtils {
    constructor() {
        this.STORAGE_KEY_CARTS = 'cartsByUser';
        this.currentUserIdentifier = this._getCurrentUserIdentifier();
    }

    /**
     * Obtém o identificador do usuário atual (email ou 'guest')
     * @private
     */
    _getCurrentUserIdentifier() {
        const currentUser = getFromStorage('currentUser');
        if (!currentUser) {
            return 'guest';
        }
        try {
            return currentUser.email || 'guest';
        } catch (error) {
            console.error("Erro ao parsear usuário do localStorage:", error);
            return 'guest';
        }
    }    
    
    /**
     * Carrega todos os carrinhos do localStorage
     * @private
     */
    _loadCarts() {
        try {
            return getFromStorage(this.STORAGE_KEY_CARTS, {});
        } catch (error) {
            console.error("Erro ao carregar carrinhos do localStorage:", error);
            return {};
        }
    }

    /**
     * Salva todos os carrinhos no localStorage
     * @private
     */
    _saveCarts(carts) {
        try {
            setToStorage(this.STORAGE_KEY_CARTS, carts);
        } catch (error) {
            console.error("Erro ao salvar carrinhos no localStorage:", error);
        }
    }
    
    /**
     * Notifica a aplicação que o carrinho foi alterado
     * @private
     */
    _notifyCartUpdated() {
        document.dispatchEvent(new CustomEvent('cart-updated'));
    }    
    
    /**
     * Adiciona um item ao carrinho
     */
    addToCart(productId, quantity = 1) {
        if (!productId) {
            console.error('Necessário informar um ID de produto válido');
            return false;
        }
        
        if (quantity <= 0) {
            console.error('Quantidade deve ser maior que zero');
            return false;
        }
        
        const carts = this._loadCarts();
        this._ensureUserCartExists(carts);
        
        const productIdStr = productId.toString();
        const userCart = carts[this.currentUserIdentifier];
        const existingItem = this._findCartItemById(userCart, productIdStr);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            NotificationService.showToast('Carrinho atualizado', `Quantidade atualizada no carrinho`, 'success');
        } else {
            userCart.push({
                productId: productIdStr,
                quantity: quantity
            });
            NotificationService.showToast('Item adicionado', `Item adicionado ao carrinho`, 'success');
        }
        
        this._saveCarts(carts);
        this._notifyCartUpdated();
        
        return true;
    }
    
    /**
     * Garante que o carrinho do usuário atual existe
     * @private
     */
    _ensureUserCartExists(carts) {
        if (!carts[this.currentUserIdentifier]) {
            carts[this.currentUserIdentifier] = [];
        }
    }
    
    /**
     * Encontra um item no carrinho pelo ID do produto
     * @private
     */
    _findCartItemById(cartItems, productId) {
        return cartItems.find(item => item.productId === productId);
    }   
    
    /**
     * Remove um item do carrinho
     */
    removeFromCart(productId) {
        if (!productId) {
            return false;
        }
        
        const carts = this._loadCarts();
        const userCart = carts[this.currentUserIdentifier];
        
        if (!userCart || userCart.length === 0) {
            return false;
        }
        
        const productIdStr = productId.toString();
        const initialLength = userCart.length;
        
        carts[this.currentUserIdentifier] = userCart.filter(
            item => item.productId.toString() !== productIdStr
        );
        
        // Se nenhum item foi removido, retorna falso
        if (carts[this.currentUserIdentifier].length === initialLength) {
            return false;
        }
        
        this._saveCarts(carts);
        this._notifyCartUpdated();
        
        NotificationService.showToast('Item removido', 'Item removido do carrinho', 'info');
        return true;
    }

    /**
     * Atualiza a quantidade de um item no carrinho
     */
    updateQuantity(productId, quantity) {
        if (!productId) {
            return false;
        }
        
        // Se quantidade for zero ou negativa, remova o item
        if (quantity <= 0) {
            return this.removeFromCart(productId);
        }
        
        const carts = this._loadCarts();
        const userCart = carts[this.currentUserIdentifier];
        
        if (!userCart) {
            return false;
        }
        
        const productIdStr = productId.toString();
        const cartItem = this._findCartItemById(userCart, productIdStr);
        
        if (!cartItem) {
            return false;
        }
        
        // Atualiza a quantidade
        cartItem.quantity = quantity;
        this._saveCarts(carts);
        this._notifyCartUpdated();
        
        NotificationService.showToast('Quantidade atualizada', `Quantidade atualizada para ${quantity}`, 'info');
        return true;
    }

    /**
     * Limpa o carrinho do usuário atual
     */
    clearCart() {
        const carts = this._loadCarts();
        
        // Define um array vazio para o usuário atual
        carts[this.currentUserIdentifier] = [];
        
        this._saveCarts(carts);
        this._notifyCartUpdated();
        
        NotificationService.showToast('Carrinho limpo', 'Todos os itens foram removidos do carrinho', 'info');
        return true;
    }

    /**
     * Obtém os itens do carrinho do usuário atual
     */
    getCartItems() {
        const carts = this._loadCarts();
        return carts[this.currentUserIdentifier] || [];
    }

    /**
     * Verifica se o carrinho está vazio
     */
    isCartEmpty() {
        return this.getCartItems().length === 0;
    }

    /**
     * Obtém o total de itens no carrinho
     */
    getCartItemCount() {
        return this.getCartItems().reduce((total, item) => total + item.quantity, 0);
    }
}
