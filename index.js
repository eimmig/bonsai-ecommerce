import { I18n } from './core/i18n.js';
import { setToStorage } from './core/functionUtils.js';
import { initHeader } from './app/header/header.js';
import { initLogin } from './app/login/login.js';
import { initHome } from "./app/home/home.js";
import { initAbout } from "./app/about/about.js";
import { initCart } from './app/cart/cart.js';
import { initBonsaiProductsPage } from "./app/bonsai-products/bonsai-products.js";
import {initProductDetail} from "./app/product-detail/product-detail.js";
import { renderLoadingComponent, removeLoadingComponent } from './core/loading.js';
import { AuthService } from './app/login/services/AuthService.js';
import { initPayment } from './app/payment/payment.js';


const translateService = new I18n();

window.setLanguage = (lang) => translateService.setLanguage(lang);
window.i18nInstance = translateService;
window.loadComponent = loadComponent;

document.addEventListener('DOMContentLoaded', () => {
    loadProductsData();
    if (AuthService.isLoggedIn()) {
        document.body.classList.add('is-logged-in');
    } else {
        document.body.classList.remove('is-logged-in');
    }
});

/**
 * Carrega os componentes principais da aplicação (header, footer e main) 
 * e inicializa o serviço de tradução e o componente de cabeçalho
 */
Promise.all([
    loadComponent("header", "app/header/header.html", false),
    loadComponent("footer", "app/footer/footer.html", false),
    loadComponent("main", "app/home/home.html", false),
]).then(() => {
    translateService.translatePage(translateService.currentLang);
    initHeader();
});

/**
 * Carrega um componente HTML dinamicamente e inicializa seu JavaScript
 * @param {string} id - ID do elemento onde o conteúdo será inserido
 * @param {string} path - Caminho do arquivo HTML a ser carregado
 * @param {boolean} translateAfterLoad - Se verdadeiro, traduz o componente após carregar
 * @param {*} parameters - Parâmetros adicionais a serem passados para o inicializador do componente
 * @returns {Promise<string>} - Conteúdo HTML carregado
 */
async function loadComponent(id, path, translateAfterLoad = true, parameters = null) {
    debugger;
    renderLoadingComponent(id, 'Carregando...');
    const res = await fetch(path);
    const data = await res.text();
    document.getElementById(id).innerHTML = data;

    if (translateAfterLoad) {
        const element = document.getElementById(id);
        translateService.translateElement(element, translateService.currentLang);
    }

    if (path === "app/login/login.html") {
        initLogin();
    }

    if (path === "app/home/home.html") {
        initHome();
    }

    if (path === "app/about/about.html") {
        initAbout();
    }

    if (path === "app/cart/cart.html") {
        initCart();
    }

    if (path === "app/product-detail/product-detail.html") {
        initProductDetail(parameters)
    }

    if (path === "app/bonsai-products/bonsai-products.html") {
        initBonsaiProductsPage();
    }

    if (path === "app/payment/checkout/checkout.html") {
        initPayment();
    }
    
    removeLoadingComponent(id);
    
    return data;
}

/**
 * Carrega os dados de produtos a partir do arquivo JSON e armazena no localStorage
 * Esta função é executada na inicialização da aplicação
 */
async function loadProductsData() {
    try {
        const response = await fetch('./data/products.json');
        if (!response.ok) {
            throw new Error(`Erro ao carregar produtos: ${response.status}`);
        }
        
        const productsData = await response.json();
        setToStorage('products', productsData);
        console.log('Dados de produtos carregados com sucesso!');
    } catch (error) {
        console.error('Falha ao carregar dados de produtos:', error);
    }
}