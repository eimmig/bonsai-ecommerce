/**
 * Classe responsável pela página de carrinho vazio
 * Gerencia a interação com o botão de iniciar compras
 */
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
            startShoppingButton: document.getElementById('startShoppingBtn')
        };
    }

    /**
     * Configura os ouvintes de eventos
     * @private
     */
    _setupEventListeners() {
        const { startShoppingButton } = this.elements;
        
        if (startShoppingButton) {
            startShoppingButton.addEventListener(
                'click', 
                this._handleStartShopping.bind(this)
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
}