// Máscara de CEP: 99999-999
export function CepMask(input) {
    input.addEventListener('input', (e) => {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
        }
        input.value = value.slice(0, 9);
    });
}
