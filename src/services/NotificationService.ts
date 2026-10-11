import { ImailProvider } from '../providers/IMailProvider';

export class NotificationService {
    constructor(private mailProvider: ImailProvider) {}

    async sendOrderConfirmation(
        customer: string,
        orderId: number,
        total: number,
        productNames: string[]
    ) {
        const subject = 'Confirmação de Pedido';
        const text = `Olá ${customer}, seu pedido #${orderId} foi confirmado. Total: R$${total}. Produtos: ${productNames.join(', ')}`;
        const html = `
      <h1>Pedido Confirmado!</h1>
      <p>Olá, seu pedido <b>#${orderId}</b> foi processado com sucesso.</p>
      <p>Total: <strong>R$ ${total}</strong></p>
      <ul>
        ${productNames.map(name => `<li>${name}</li>`).join('')}
      </ul>
    `;

    return await this.mailProvider.sendMail(customer, subject, text, html);
    }
}
