import { IOrderRepository } from "../repositories/IOrderRepository";
import { IProductRepository } from "../repositories/IProductRepository";
import { IPaymentMethod } from "../payments/IPaymentMethod";
import { ProductFactory } from "../domain/ProductFactory";
import{NotificationService} from "../services/NotificationService";
import { OrderValidationError } from "./OrderValidationError";
import logger from '../lib/logger';

export class OrderService {
    constructor(
         private productRepository: IProductRepository,
    private orderRepository: IOrderRepository,
    private paymentMethods: Record<string, IPaymentMethod>,
    private notificationService: NotificationService
  ) {}

  async processOrder(input:{
    customer: string;
    items: any[];
    paymentMethod: string;
    paymentDetails: any;
  }) {
    const { customer, items, paymentMethod, paymentDetails } = input;

    if (!items || items.length === 0) {
        logger.error('Erro: Nenhum item no pedido');
        throw new OrderValidationError('Carrinho Vazioo');
    }

    let totalAmount = 0;
    const productsDetails: any[] = [];

    for (const item of items) {
        const data = await this.productRepository.findById(item.productId);

        if (!data) {
            throw new OrderValidationError(`Produto com ID ${item.productId} não encontrado`);
        }

        const product = ProductFactory.createProduct(data);
        totalAmount += product.price * item.quantity;
        totalAmount += product.calculateFreight();

        productsDetails.push({ ...data, quantity: item.quantity });
    }

    const payment = this.paymentMethods[paymentMethod];

    if (!payment) {
        throw new OrderValidationError(`Método de pagamento ${paymentMethod} não suportado`);
    }
    payment.process(totalAmount, paymentDetails);

    const order = await this.orderRepository.create({
        customer,
        items: productsDetails,
        total: totalAmount
    });

    const emailPreview = await this.notificationService.sendOrderConfirmation(
        customer,
        order.id,
        totalAmount,
        productsDetails.map(p => p.name)
    );

    return { orderId: order.id, emailPreview };
}
}