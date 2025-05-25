// Utilitário para formatação de valores monetários (Real)
export function formatCurrencyBRL(value) {
    if (typeof value !== 'number') value = Number(value) || 0;
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Utilitário para carregar produtos do localStorage
export function loadProductsFromStorage(storageKey = 'products') {
    try {
        return JSON.parse(localStorage.getItem(storageKey) || '{"produtos":[]}').produtos;
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        return [];
    }
}
