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

/**
 * Formata um valor numérico para o formato de moeda brasileira (BRL)
 * @param {number|string} value - Valor a ser formatado
 * @returns {string} Valor formatado como moeda brasileira
 */
export function formatCurrencyBRL(value) {
    if (typeof value !== 'number') value = Number(value) || 0;
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Carrega a lista de produtos do localStorage
 * @param {string} storageKey - Chave para buscar os produtos no localStorage
 * @returns {Array} Array de produtos
 */
export function loadProductsFromStorage(storageKey = 'products') {
    const data = getFromStorage(storageKey, { produtos: [] });
    return data.produtos || [];
}
