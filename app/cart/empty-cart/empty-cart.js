export class EmptyCartPage {
    constructor() {
        this.startShoppingButton = document.getElementById('startShoppingBtn');
        this.addEventListeners();
    }

    addEventListeners() {
        if (this.startShoppingButton) {
            this.startShoppingButton.addEventListener('click', this.handleStartShopping.bind(this));
        }
    }

    handleStartShopping() {
        console.log("Botão 'Começar a comprar!' clicado!");
        alert("Redirecionando para a página de produtos... (simulação)");
    }
}