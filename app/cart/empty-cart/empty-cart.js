/**
 * Classe responsável pela página de carrinho vazio
 * Gerencia a interação com o botão de iniciar compras
 */
import { CartTestUtils } from '../utils/cart-test-utils.js';

export class EmptyCartPage {
    /**
     * Inicializa a página de carrinho vazio
     */
    constructor() {
        this._initializeElements();
        this._setupEventListeners();
    }

    /**
     * Inicializa os elementos do DOM
     * @private
     */
    _initializeElements() {
        this.elements = {
            startShoppingButton: document.getElementById('startShoppingBtn'),
            testCartButton: document.getElementById('testCartBtn')
        };
    }

    /**
     * Configura os ouvintes de eventos
     * @private
     */
    _setupEventListeners() {
        const { startShoppingButton, testCartButton } = this.elements;
        
        if (startShoppingButton) {
            startShoppingButton.addEventListener(
                'click', 
                this._handleStartShopping.bind(this)
            );
        }
        
        if (testCartButton) {
            testCartButton.addEventListener(
                'click',
                this._handleTestCart.bind(this)
            );
        }
    }

    /**
     * Manipula o clique no botão de iniciar compras
     * @private
     */
    _handleStartShopping() {
        this._navigateToHomePage();
    }
      /**
     * Navega para a página inicial de produtos
     * @private
     */
    _navigateToHomePage() {
        window.loadComponent('main', 'app/home/home.html', true);
    }
    
    /**
     * Manipula o clique no botão de testar carrinho
     * @private
     */
    _handleTestCart() {
        const success = CartTestUtils.addTestItem();
        
        if (success) {
            // Redireciona para a página de carrinho com itens
            window.loadComponent('main', 'app/cart/cart-with-itens/cart-with-itens.html', true);
        }
    }
}