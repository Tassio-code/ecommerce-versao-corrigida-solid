import {IPaymentMethod} from "./IPaymentMethod";
import logger from '../lib/logger';

export class PixPayment implements IPaymentMethod {
  process(amount: number, details: any): void {
    logger.info('Processando pagamento via Pix...');
    // Lógica de pagamento via Pix
  }
}