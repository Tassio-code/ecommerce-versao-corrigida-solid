import express from 'express';
import { OrderController } from './controllers/OrderController';
import { OrderService } from './services/OrderService';
import { NotificationService } from './services/NotificationService';
import { EtherealMailProvider } from './providers/EtherealMailProvider';
import { PrismaOrderRepository } from './repositories/PrismaOrderRepository';
import { PrismaProductRepository } from './repositories/PrismaProductRepository';
import { CreditCardPayment } from './payments/CreditCardPayment';
import { DebitCardPayment } from './payments/DebitCardPayment';
import { PixPayment } from './payments/PixPayment';

const app = express();
app.use(express.json());

const mailProvider = new EtherealMailProvider();
const notificationService = new NotificationService(mailProvider);

const orderService = new OrderService(
  new PrismaProductRepository(),
  new PrismaOrderRepository(),
  {
    credit_card: new CreditCardPayment(),
    debit_card: new DebitCardPayment(),
    pix: new PixPayment(),
  },
  notificationService
);

const orderController = new OrderController(orderService);

app.post('/orders', (req, res) => orderController.processOrder(req, res));

export default app;