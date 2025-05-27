import { I18n } from './core/i18n.js';
import { getFromStorage, setToStorage } from './core/functionUtils.js';
import { Header } from './app/header/header.js';
import { initLogin } from './app/login/login.js';
import { initHome } from "./app/home/home.js";
import { initAbout } from "./app/about/about.js";
import { initCart } from './app/cart/cart.js';
import { initBonsaiProductsPage } from "./app/bonsai-products/bonsai-products.js";
import {initProductDetail} from "./app/product-detail/product-detail.js";
import { renderLoadingComponent, removeLoadingComponent } from './core/loading.js';

const translateService = new I18n();
let headerComponent;

window.setLanguage = (lang) => translateService.setLanguage(lang);
window.i18nInstance = translateService;
window.loadComponent = loadComponent;

document.addEventListener('DOMContentLoaded', () => {
  loadProductsData();
  checkUserSession();
});

function checkUserSession() {
  try {
    const currentUser = getFromStorage('currentUser');
    if (currentUser) {
      const userData = currentUser;
      console.log('Usuário já autenticado:', userData.nome);
      document.body.classList.add('is-logged-in');
    }
  } catch (error) {
    console.error('Erro ao verificar sessão do usuário:', error);
  }
}

Promise.all([
  loadComponent("header", "app/header/header.html", false),
  loadComponent("footer", "app/footer/footer.html", false),
  loadComponent("main", "app/home/home.html", false),
]).then(() => {
  translateService.translatePage(translateService.currentLang);
  headerComponent = new Header();
});

async function loadComponent(id, path, translateAfterLoad = true, parameters = null) {
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
  
  removeLoadingComponent(id);
  
  return data;
}

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