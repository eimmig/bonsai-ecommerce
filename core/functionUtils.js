// Utilitários centralizados para acesso ao localStorage e formatação

/**
 * Obtém um valor do localStorage e faz o parse para JSON, se possível.
 * @param {string} key
 * @param {*} defaultValue
 * @returns {*}
 */
export function getFromStorage(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        if (value === null || value === undefined) return defaultValue;
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    } catch {
        return defaultValue;
    }
}

/**
 * Salva um valor no localStorage, convertendo para JSON se necessário.
 * @param {string} key
 * @param {*} value
 */
export function setToStorage(key, value) {
    try {
        const toStore = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, toStore);
        return true;
    } catch {
        return false;
    }
}

/**
 * Remove um valor do localStorage.
 * @param {string} key
 */
export function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch {
        return false;
    }
}

// Utilitário para formatação de valores monetários (Real)
export function formatCurrencyBRL(value) {
    if (typeof value !== 'number') value = Number(value) || 0;
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Utilitário para carregar produtos do localStorage
export function loadProductsFromStorage(storageKey = 'products') {
    const data = getFromStorage(storageKey, { produtos: [] });
    return data.produtos || [];
}
