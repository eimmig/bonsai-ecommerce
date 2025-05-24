/**
 * Controller para a página de checkout/finalização de compra
 */
import { CartUtils } from '../../cart/utils/cart-utils.js';
import { PaymentService } from '../services/payment-service.js';
import { NotificationService } from '../../../core/notifications.js';

export class CheckoutManager {
    /**
     * Inicializa o gerenciador de checkout
     */
    constructor() {
        this.currentStep = 'payment';
        this.selectedPaymentMethod = PaymentService.PAYMENT_METHODS.CREDIT_CARD;
        this.cartUtils = new CartUtils();
        
        this._initializeElements();
        this._setupEventListeners();
        this._loadCartItems();
        
        // Inicialmente esconde o botão voltar na primeira etapa
        this._updateNavigationButtons();
    }
    
    /**
     * Inicializa os elementos do DOM
     * @private
     */
    _initializeElements() {
        // Elementos de navegação
        this.elements = {
            steps: document.querySelectorAll('.checkout-step'),
            formContainers: document.querySelectorAll('.checkout-form-container'),
            nextButton: document.getElementById('next-button'),
            backButton: document.getElementById('back-button'),
            
            // Métodos de pagamento
            paymentMethods: document.querySelectorAll('.payment-method'),
            paymentForms: document.querySelectorAll('.payment-form'),
            
            // Formulários de pagamento
            creditCardForm: {
                cardNumber: document.getElementById('card-number'),
                cardHolder: document.getElementById('card-holder'),
                cardExpiry: document.getElementById('card-expiry'),
                cardCvv: document.getElementById('card-cvv'),
                installments: document.getElementById('card-installments')
            },
            pixForm: {
                customerName: document.getElementById('pix-name')
            },
            bankSlipForm: {
                customerName: document.getElementById('bank-slip-name'),
                documentNumber: document.getElementById('bank-slip-document')
            },
            
            // Revisão do pedido
            orderItemsList: document.getElementById('order-items-list'),
            orderSubtotal: document.getElementById('order-subtotal'),
            orderShipping: document.getElementById('order-shipping'),
            orderDiscount: document.getElementById('order-discount'),
            orderTotal: document.getElementById('order-total'),
            orderPaymentMethod: document.getElementById('order-payment-method'),
            
            // Confirmação
            orderNumber: document.getElementById('order-number'),
            orderDate: document.getElementById('order-date'),
            confirmationTotal: document.getElementById('confirmation-total'),
            backToShopping: document.getElementById('back-to-shopping')
        };
    }
    
    /**
     * Configura os listeners de eventos
     * @private
     */
    _setupEventListeners() {
        // Navegação entre etapas
        this.elements.nextButton.addEventListener('click', () => this._handleNextStep());
        this.elements.backButton.addEventListener('click', () => this._handlePreviousStep());
        
        // Seleção de método de pagamento
        this.elements.paymentMethods.forEach(method => {
            method.addEventListener('click', (e) => this._selectPaymentMethod(e.currentTarget.dataset.paymentMethod));
        });
        
        // Formatação de campos
        if (this.elements.creditCardForm.cardNumber) {
            this.elements.creditCardForm.cardNumber.addEventListener('input', (e) => this._formatCardNumber(e.target));
        }
        
        if (this.elements.creditCardForm.cardExpiry) {
            this.elements.creditCardForm.cardExpiry.addEventListener('input', (e) => this._formatCardExpiry(e.target));
        }
        
        // Botão de voltar às compras na confirmação
        if (this.elements.backToShopping) {
            this.elements.backToShopping.addEventListener('click', () => {
                this.cartUtils.clearCart();
                window.loadComponent('main', 'app/home/home.html', true);
            });
        }
    }
    
    /**
     * Carrega os itens do carrinho
     * @private
     */
    _loadCartItems() {
        this.cartItems = this.cartUtils.getCartItems();
        this.products = this._loadProductsData();
        this.orderSummary = this._calculateOrderSummary();
    }
    
    /**
     * Carrega os produtos do localStorage
     * @private
     * @returns {Array} Array de produtos
     */
    _loadProductsData() {
        try {
            return JSON.parse(localStorage.getItem('products') || '{"produtos":[]}').produtos;
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            return [];
        }
    }
    
    /**
     * Calcula o resumo do pedido
     * @private
     * @returns {Object} Resumo do pedido
     */
    _calculateOrderSummary() {
        let subtotal = 0;
        let totalDiscount = 0;
        const shippingCost = 50.00; // Valor fixo de frete
        
        for (const item of this.cartItems) {
            const productInfo = this._getProductInfo(item.productId);
            if (!productInfo) continue;
            
            const originalPrice = productInfo.valor;
            const discountPercentage = productInfo.porcentagemDesconto || 0;
            const discountedPrice = originalPrice * (1 - discountPercentage / 100);
            
            subtotal += discountedPrice * item.quantity;
            totalDiscount += (originalPrice - discountedPrice) * item.quantity;
        }
        
        return {
            subtotal,
            shipping: shippingCost,
            discount: totalDiscount,
            total: subtotal + shippingCost
        };
    }
    
    /**
     * Obtém informações de um produto pelo ID
     * @private
     * @param {string} productId ID do produto
     * @returns {Object|undefined} Informações do produto ou undefined
     */
    _getProductInfo(productId) {
        return this.products.find(p => p.id.toString() === productId.toString());
    }
    
    /**
     * Formata um valor como moeda
     * @private
     * @param {number} value Valor a formatar
     * @returns {string} Valor formatado como moeda
     */
    _formatCurrency(value) {
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    }
    
    /**
     * Seleciona um método de pagamento
     * @private
     * @param {string} method Método de pagamento
     */
    _selectPaymentMethod(method) {
        if (!Object.values(PaymentService.PAYMENT_METHODS).includes(method)) {
            return;
        }
        
        this.selectedPaymentMethod = method;
        
        // Atualiza a UI para o método selecionado
        this.elements.paymentMethods.forEach(element => {
            element.classList.toggle('active', element.dataset.paymentMethod === method);
        });
        
        this.elements.paymentForms.forEach(form => {
            form.classList.remove('active');
        });
        
        // Ativa o formulário correspondente
        switch (method) {
            case PaymentService.PAYMENT_METHODS.CREDIT_CARD:
                document.getElementById('credit-card-form').classList.add('active');
                break;
            case PaymentService.PAYMENT_METHODS.PIX:
                document.getElementById('pix-form').classList.add('active');
                break;
            case PaymentService.PAYMENT_METHODS.BANK_SLIP:
                document.getElementById('bank-slip-form').classList.add('active');
                break;
        }
    }
    
    /**
     * Formata o número do cartão durante a digitação
     * @private
     * @param {HTMLInputElement} input Campo de entrada
     */
    _formatCardNumber(input) {
        let value = input.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        input.value = value.substring(0, 19); // Limita a 16 dígitos + 3 espaços
    }
    
    /**
     * Formata a data de validade durante a digitação
     * @private
     * @param {HTMLInputElement} input Campo de entrada
     */
    _formatCardExpiry(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        input.value = value;
    }
    
    /**
     * Manipula a transição para o próximo passo
     * @private
     */
    _handleNextStep() {
        if (!this._validateCurrentStep()) {
            return;
        }
        
        switch (this.currentStep) {
            case 'payment':
                this._goToReviewStep();
                break;
            case 'review':
                this._processPayment();
                break;
        }
    }
    
    /**
     * Manipula a transição para o passo anterior
     * @private
     */
    _handlePreviousStep() {
        switch (this.currentStep) {
            case 'review':
                this._changeStep('payment');
                break;
            case 'confirmation':
                this._changeStep('review');
                break;
        }
    }
    
    /**
     * Muda para a etapa de revisão
     * @private
     */
    _goToReviewStep() {
        this._changeStep('review');
        this._renderOrderReview();
    }
    
    /**
     * Renderiza a revisão do pedido
     * @private
     */
    _renderOrderReview() {
        // Renderiza os itens
        this.elements.orderItemsList.innerHTML = '';
        
        this.cartItems.forEach(item => {
            const productInfo = this._getProductInfo(item.productId);
            if (!productInfo) return;
            
            const originalPrice = productInfo.valor;
            const discountPercentage = productInfo.porcentagemDesconto || 0;
            const discountedPrice = originalPrice * (1 - discountPercentage / 100);
            
            const orderItemElement = document.createElement('div');
            orderItemElement.classList.add('order-item');
            
            // Obtém a URL da imagem
            const imageUrl = productInfo.imagem && productInfo.imagem.length > 0 
                ? productInfo.imagem[0].urlImagemDestaque 
                : 'assets/images/products/default.svg';
            
            orderItemElement.innerHTML = `
                <img src="${imageUrl}" class="order-item-image" alt="${productInfo.nome}">
                <div class="order-item-info">
                    <div>${productInfo.nome}</div>
                    <div>Qtd: ${item.quantity} x <span class="price">${this._formatCurrency(discountedPrice)}</span></div>
                </div>
                <div class="order-item-total">${this._formatCurrency(discountedPrice * item.quantity)}</div>
            `;
            
            this.elements.orderItemsList.appendChild(orderItemElement);
        });
        
        // Renderiza os totais
        this.elements.orderSubtotal.textContent = this._formatCurrency(this.orderSummary.subtotal);
        this.elements.orderShipping.textContent = this._formatCurrency(this.orderSummary.shipping);
        this.elements.orderDiscount.textContent = this._formatCurrency(this.orderSummary.discount);
        this.elements.orderTotal.textContent = this._formatCurrency(this.orderSummary.total);
        
        // Renderiza o método de pagamento
        let paymentMethodText = '';
        switch (this.selectedPaymentMethod) {
            case PaymentService.PAYMENT_METHODS.CREDIT_CARD:
                const cardNumber = this.elements.creditCardForm.cardNumber.value;
                const lastDigits = cardNumber.slice(-4).replace(/\D/g, '');
                paymentMethodText = `Cartão de crédito terminado em ${lastDigits}`;
                break;
            case PaymentService.PAYMENT_METHODS.PIX:
                paymentMethodText = 'PIX';
                break;
            case PaymentService.PAYMENT_METHODS.BANK_SLIP:
                paymentMethodText = 'Boleto Bancário';
                break;
        }
        
        this.elements.orderPaymentMethod.textContent = paymentMethodText;
    }
    
    /**
     * Processa o pagamento
     * @private
     */
    _processPayment() {
        // Cria overlay de carregamento
        this._showLoadingOverlay('Processando pagamento...');
        
        // Prepara os dados do pagamento
        const paymentData = {
            method: this.selectedPaymentMethod,
            amount: this.orderSummary.total,
            paymentDetails: this._getPaymentDetails()
        };
        
        // Processa o pagamento
        PaymentService.processPayment(paymentData)
            .then(result => {
                this._hideLoadingOverlay();
                this._showConfirmation(result);
            })
            .catch(error => {
                this._hideLoadingOverlay();
                console.error('Erro ao processar pagamento:', error);
                NotificationService.showToast(
                    'Erro no pagamento', 
                    error.error || 'Não foi possível processar seu pagamento. Por favor, tente novamente.',
                    'error'
                );
            });
    }
    
    /**
     * Obtém os detalhes do pagamento com base no método selecionado
     * @private
     * @returns {Object} Detalhes do pagamento
     */
    _getPaymentDetails() {
        switch (this.selectedPaymentMethod) {
            case PaymentService.PAYMENT_METHODS.CREDIT_CARD:
                return {
                    cardNumber: this.elements.creditCardForm.cardNumber.value,
                    holderName: this.elements.creditCardForm.cardHolder.value,
                    expirationDate: this.elements.creditCardForm.cardExpiry.value,
                    cvv: this.elements.creditCardForm.cardCvv.value,
                    installments: this.elements.creditCardForm.installments.value
                };
                
            case PaymentService.PAYMENT_METHODS.PIX:
                return {
                    customerName: this.elements.pixForm.customerName.value
                };
                
            case PaymentService.PAYMENT_METHODS.BANK_SLIP:
                return {
                    customerName: this.elements.bankSlipForm.customerName.value,
                    documentNumber: this.elements.bankSlipForm.documentNumber.value
                };
                
            default:
                return {};
        }
    }
    
    /**
     * Mostra a tela de confirmação
     * @private
     * @param {Object} paymentResult Resultado do pagamento
     */
    _showConfirmation(paymentResult) {
        this._changeStep('confirmation');
        
        const orderNumber = paymentResult.transactionId;
        const orderDate = new Date().toLocaleDateString('pt-BR');
        
        this.elements.orderNumber.textContent = orderNumber;
        this.elements.orderDate.textContent = orderDate;
        this.elements.confirmationTotal.textContent = this._formatCurrency(this.orderSummary.total);
    }
    
    /**
     * Valida a etapa atual antes de prosseguir
     * @private
     * @returns {boolean} True se a validação passar
     */
    _validateCurrentStep() {
        switch (this.currentStep) {
            case 'payment':
                return this._validatePaymentForm();
            case 'review':
                return true;
            case 'confirmation':
                return true;
            default:
                return false;
        }
    }
    
    /**
     * Valida o formulário de pagamento
     * @private
     * @returns {boolean} True se o formulário for válido
     */
    _validatePaymentForm() {
        switch (this.selectedPaymentMethod) {
            case PaymentService.PAYMENT_METHODS.CREDIT_CARD:
                return this._validateCreditCardForm();
            case PaymentService.PAYMENT_METHODS.PIX:
                return this._validatePixForm();
            case PaymentService.PAYMENT_METHODS.BANK_SLIP:
                return this._validateBankSlipForm();
            default:
                return false;
        }
    }
    
    /**
     * Valida o formulário de cartão de crédito
     * @private
     * @returns {boolean} True se o formulário for válido
     */
    _validateCreditCardForm() {
        const cardNumber = this.elements.creditCardForm.cardNumber.value.replace(/\D/g, '');
        const cardHolder = this.elements.creditCardForm.cardHolder.value.trim();
        const cardExpiry = this.elements.creditCardForm.cardExpiry.value.trim();
        const cardCvv = this.elements.creditCardForm.cardCvv.value.trim();
        
        if (cardNumber.length < 16) {
            NotificationService.showToast('Validação', 'Número de cartão inválido', 'error');
            return false;
        }
        
        if (cardHolder.length < 5) {
            NotificationService.showToast('Validação', 'Nome do titular inválido', 'error');
            return false;
        }
        
        if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) {
            NotificationService.showToast('Validação', 'Data de validade inválida (MM/AA)', 'error');
            return false;
        }
        
        if (cardCvv.length < 3) {
            NotificationService.showToast('Validação', 'Código de segurança inválido', 'error');
            return false;
        }
        
        return true;
    }
    
    /**
     * Valida o formulário de PIX
     * @private
     * @returns {boolean} True se o formulário for válido
     */
    _validatePixForm() {
        const customerName = this.elements.pixForm.customerName.value.trim();
        
        if (customerName.length < 5) {
            NotificationService.showToast('Validação', 'Nome completo é obrigatório', 'error');
            return false;
        }
        
        return true;
    }
    
    /**
     * Valida o formulário de boleto
     * @private
     * @returns {boolean} True se o formulário for válido
     */
    _validateBankSlipForm() {
        const customerName = this.elements.bankSlipForm.customerName.value.trim();
        const documentNumber = this.elements.bankSlipForm.documentNumber.value.replace(/\D/g, '');
        
        if (customerName.length < 5) {
            NotificationService.showToast('Validação', 'Nome completo é obrigatório', 'error');
            return false;
        }
        
        if (documentNumber.length < 11) {
            NotificationService.showToast('Validação', 'CPF/CNPJ inválido', 'error');
            return false;
        }
        
        return true;
    }
    
    /**
     * Altera o passo atual
     * @private
     * @param {string} step Novo passo
     */
    _changeStep(step) {
        if (!['payment', 'review', 'confirmation'].includes(step)) {
            return;
        }
        
        this.currentStep = step;
        
        // Atualiza a visualização dos passos
        this.elements.steps.forEach(stepElement => {
            const stepName = stepElement.dataset.step;
            
            stepElement.classList.remove('active', 'completed');
            
            if (stepName === step) {
                stepElement.classList.add('active');
            } else if (this._isStepBeforeCurrent(stepName)) {
                stepElement.classList.add('completed');
            }
        });
        
        // Atualiza a visualização dos formulários
        this.elements.formContainers.forEach(container => {
            container.classList.toggle('active', container.id === `${step}-form-container` || 
                                                container.id === `${step}-container`);
        });
        
        // Atualiza os botões de navegação
        this._updateNavigationButtons();
    }
    
    /**
     * Verifica se um passo vem antes do atual
     * @private
     * @param {string} step Passo a verificar
     * @returns {boolean} True se o passo vier antes do atual
     */
    _isStepBeforeCurrent(step) {
        const steps = ['payment', 'review', 'confirmation'];
        return steps.indexOf(step) < steps.indexOf(this.currentStep);
    }
    
    /**
     * Atualiza os botões de navegação
     * @private
     */
    _updateNavigationButtons() {
        // Configura o botão voltar
        if (this.currentStep === 'payment') {
            this.elements.backButton.style.visibility = 'hidden';
        } else {
            this.elements.backButton.style.visibility = 'visible';
        }
        
        // Configura o botão avançar
        if (this.currentStep === 'confirmation') {
            this.elements.nextButton.style.display = 'none';
        } else {
            this.elements.nextButton.style.display = 'block';
            
            if (this.currentStep === 'review') {
                this.elements.nextButton.textContent = 'Finalizar Compra';
            } else {
                this.elements.nextButton.textContent = 'Avançar';
            }
        }
    }
    
    /**
     * Exibe um overlay de carregamento
     * @private
     * @param {string} message Mensagem a exibir
     */
    _showLoadingOverlay(message = 'Carregando...') {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.id = 'loadingOverlay';
        
        overlay.innerHTML = `
            <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
            <p class="loading-text">${message}</p>
        `;
        
        document.body.appendChild(overlay);
    }
    
    /**
     * Oculta o overlay de carregamento
     * @private
     */
    _hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            document.body.removeChild(overlay);
        }
    }
}

/**
 * Inicializa o módulo de checkout
 */
export function initCheckout() {
    return new CheckoutManager();
}
