import { NotificationService } from '../../../core/notifications.js';
import { setToStorage, getFromStorage, formatCurrencyBRL } from '../../../core/functionUtils.js';

export class PaymentService {
    static PAYMENT_METHODS = {
        CREDIT_CARD: 'credit-card',
        PIX: 'pix',
        BANK_SLIP: 'bank-slip'
    };

    static PAYMENT_STATUS = {
        PENDING: 'pending',
        PROCESSING: 'processing',
        COMPLETED: 'completed',
        FAILED: 'failed',
        CANCELLED: 'cancelled'
    };

    /**
     * Processa um pagamento
     * @param {Object} paymentData Dados do pagamento
     */
    static async processPayment(paymentData) {
        return new Promise((resolve, reject) => {
            if (!this._validatePaymentData(paymentData)) {
                NotificationService.showToast(
                    window.i18n ? window.i18n.translate('payment_error') : 'Erro de pagamento',
                    window.i18n ? window.i18n.translate('payment_invalid_data') : 'Dados de pagamento incompletos ou inválidos',
                    'error'
                );
                reject(new Error(window.i18n ? window.i18n.translate('payment_invalid_data') : 'Dados de pagamento inválidos'));
                return;
            }

            setTimeout(() => {
                const isSuccess = Math.random() < 0.8;

                if (isSuccess) {
                    const result = {
                        status: this.PAYMENT_STATUS.COMPLETED,
                        transactionId: this._generateTransactionId(),
                        timestamp: new Date().toISOString(),
                        method: paymentData.method,
                        amount: paymentData.amount
                    };
                    
                    this._saveTransaction(result);
                    
                    NotificationService.showToast(
                        window.i18n ? window.i18n.translate('payment_approved') : 'Pagamento aprovado',
                        window.i18n ? window.i18n.translate('payment_approved_message', { amount: formatCurrencyBRL(paymentData.amount) }) : `Seu pagamento de ${formatCurrencyBRL(paymentData.amount)} foi aprovado`,
                        'success'
                    );
                    
                    resolve(result);
                } else {
                    const errorResult = {
                        status: this.PAYMENT_STATUS.FAILED,
                        error: window.i18n ? window.i18n.translate('payment_refused_message') : 'Pagamento recusado pela operadora',
                        timestamp: new Date().toISOString(),
                        method: paymentData.method
                    };
                    
                    NotificationService.showToast(
                        window.i18n ? window.i18n.translate('payment_refused') : 'Pagamento recusado',
                        window.i18n ? window.i18n.translate('payment_refused_message') : 'O pagamento foi recusado. Por favor, tente novamente ou use outro método de pagamento.',
                        'error'
                    );
                    
                    reject(errorResult);
                }
            }, 2000);
        });
    }

    /**
     * Valida os dados de pagamento
     * @private
     */
    static _validatePaymentData(paymentData) {
        if (!paymentData) return false;
        
        const isValidMethod = Object.values(this.PAYMENT_METHODS).includes(paymentData.method);
        const isValidAmount = typeof paymentData.amount === 'number' && paymentData.amount > 0;
        let hasValidDetails = false;
        
        switch (paymentData.method) {
            case this.PAYMENT_METHODS.CREDIT_CARD:
                hasValidDetails = this._validateCreditCardDetails(paymentData.paymentDetails);
                break;
                
            case this.PAYMENT_METHODS.PIX:
                hasValidDetails = !!paymentData.paymentDetails?.customerName;
                break;
                
            case this.PAYMENT_METHODS.BANK_SLIP:
                hasValidDetails = !!paymentData.paymentDetails?.customerName && 
                                 !!paymentData.paymentDetails?.documentNumber;
                break;
                
            default:
        }
        
        return isValidMethod && isValidAmount && hasValidDetails;
    }
    
    /**
     * Valida os detalhes de cartão de crédito
     * @private
     */
    static _validateCreditCardDetails(cardDetails) {
        if (!cardDetails) return false;
        
        const requiredFields = ['cardNumber', 'holderName', 'expirationDate', 'cvv'];
        return requiredFields.every(field => !!cardDetails[field]);
    }
    
    /**
     * Gera um ID de transação único
     * @private
     */
    static _generateTransactionId() {
        return 'TRX' + Date.now().toString(36).toUpperCase() + 
               Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    
    /**
     * Salva uma transação no histórico
     * @private
     */
    static _saveTransaction(transaction) {
        const STORAGE_KEY = 'paymentTransactions';
        try {
            const transactions = getFromStorage(STORAGE_KEY, []);
            transactions.push(transaction);
            setToStorage(STORAGE_KEY, transactions);
        } catch (error) {
            console.error('Erro ao salvar transação:', error);
        }
    }
}
