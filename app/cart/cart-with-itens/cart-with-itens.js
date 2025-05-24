export class Cart {
    constructor() {
        this.cartProductsList = document.getElementById('cart-products-list');
        this.summarySubtotal = document.getElementById('summary-subtotal');
        this.summaryShipping = document.getElementById('summary-shipping');
        this.summaryDiscount = document.getElementById('summary-discount');
        this.summaryTotal = document.getElementById('summary-total');
        this.continueShoppingBtn = document.getElementById('continue-shopping-btn');
        this.checkoutBtn = document.getElementById('checkout-btn');

        this.CARTS_STORAGE_KEY = 'cartsByUser';
        this.SHIPPING_COST = 50.00;
        this.DISCOUNT_AMOUNT = 0.00;

        this.currentUserIdentifier = this._getCurrentUserIdentifier();
        this.allCarts = this._loadCarts();
        this.cartItems = this.allCarts[this.currentUserIdentifier] || [];

        this.init();
    }

    init() {
        this._bindEventListeners();
        this.renderCartItems();
    }

    _getCurrentUserIdentifier() {
        debugger;   
        const currentUserString = localStorage.getItem('currentUser');
        if (currentUserString) {
            try {
                const currentUser = JSON.parse(currentUserString);
                return currentUser.email || 'guest';
            } catch (e) {
                console.error("Erro ao parsear 'currentUser' do localStorage:", e);
            }
        }
        return 'guest';
    }

    _loadCarts() {
        try {
            const storedCarts = localStorage.getItem(this.CARTS_STORAGE_KEY);
            return storedCarts ? JSON.parse(storedCarts) : {};
        } catch (e) {
            console.error("Erro ao carregar carrinhos do localStorage:", e);
            return {};
        }
    }

    _saveCarts() {
        this.allCarts[this.currentUserIdentifier] = this.cartItems;
        try {
            localStorage.setItem(this.CARTS_STORAGE_KEY, JSON.stringify(this.allCarts));
        } catch (e) {
            console.error("Erro ao salvar carrinhos no localStorage:", e);
        }
    }

    _formatCurrency(value) {
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
    }

    _calculateSummary() {
        let subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let total = subtotal + this.SHIPPING_COST - this.DISCOUNT_AMOUNT;

        this.summarySubtotal.textContent = this._formatCurrency(subtotal);
        this.summaryShipping.textContent = this._formatCurrency(this.SHIPPING_COST);
        this.summaryDiscount.textContent = this._formatCurrency(this.DISCOUNT_AMOUNT);
        this.summaryTotal.textContent = this._formatCurrency(total);
    }

    _handleQuantityChange(event) {
        const productId = parseInt(event.target.dataset.id);
        const item = this.cartItems.find(i => i.id === productId);

        if (!item) return;

        if (event.target.classList.contains('quantity-minus')) {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                this.cartItems = this.cartItems.filter(i => i.id !== productId);
            }
        } else if (event.target.classList.contains('quantity-plus')) {
            item.quantity++;
        }
        this.renderCartItems();
    }

    _bindEventListeners() {
        this.continueShoppingBtn.addEventListener('click', () => {
            alert('Redirecionando para a página de compras...');
        });

        this.checkoutBtn.addEventListener('click', () => {
            alert('Redirecionando para o pagamento...');
        });

        this.cartProductsList.addEventListener('click', (event) => {
            if (event.target.classList.contains('quantity-minus') ||
                event.target.classList.contains('quantity-plus')) {
                this._handleQuantityChange(event);
            }
        });
    }

    renderCartItems() {
        this.cartProductsList.innerHTML = '';

        if (this.cartItems.length === 0) {
            this.cartProductsList.innerHTML = '<p style="text-align: center; padding: 20px; color: #555;">Seu carrinho está vazio.</p>';
            this.checkoutBtn.disabled = true;
        } else {
            this.checkoutBtn.disabled = false;
            this.cartItems.forEach(item => {
                const productItemDiv = document.createElement('div');
                productItemDiv.classList.add('cart-product-item');
                productItemDiv.setAttribute('data-product-id', item.id);

                productItemDiv.innerHTML = `
                    <div class="product-image-wrapper">
                        <img src="${item.image}" alt="${item.name}" class="product-image">
                    </div>
                    <span class="product-name">${item.name}</span>
                    <span class="product-price">${this._formatCurrency(item.price)}</span>
                    <div class="quantity-control">
                        <button class="quantity-minus" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}" readonly>
                        <button class="quantity-plus" data-id="${item.id}">+</button>
                    </div>
                `;
                this.cartProductsList.appendChild(productItemDiv);
            });
        }
        this._calculateSummary();
        this._saveCarts();
    }
}

/**
 * Função de inicialização do módulo de carrinho
 * @returns {Cart} Instância do carrinho
 */
export function initCart() {
    return new Cart();
}