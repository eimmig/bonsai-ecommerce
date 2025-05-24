import { I18n } from './core/i18n.js';
import { Header } from './app/header/header.js';
import { initLogin } from './app/login/login.js';
import { initCart } from './app/cart/cart.js';
import { initPayment } from './app/payment/payment.js';

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
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
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

async function loadComponent(id, path, translateAfterLoad = true) {
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

  if (path === "app/cart/cart.html") {
    initCart();
  }

  if (path === "app/payment/checkout/checkout.html") {
    initPayment();
  }
  
  return data;
}

async function loadProductsData() {
  try {
    const response = await fetch('./data/products.json');
    if (!response.ok) {
      throw new Error(`Erro ao carregar produtos: ${response.status}`);
    }
    
    const productsData = await response.json();
    localStorage.setItem('products', JSON.stringify(productsData));
    console.log('Dados de produtos carregados com sucesso!');
  } catch (error) {
    console.error('Falha ao carregar dados de produtos:', error);
  }
}