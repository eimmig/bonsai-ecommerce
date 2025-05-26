// Componente de loading reutilizável
export function renderLoadingComponent(containerId, message = 'Carregando...') {
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;
    container.innerHTML = `
        <div class="loading-indicator" id="loading-component">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;
}

export function removeLoadingComponent(containerId) {
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;
    const loading = container.querySelector('#loading-component');
    if (loading) loading.remove();
}
