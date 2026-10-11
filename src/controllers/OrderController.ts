import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { OrderValidationError } from '../services/OrderValidationError';
import logger from '../lib/logger';

export class OrderController {
  constructor(private orderService: OrderService) {}

  async processOrder(req: Request, res: Response) {
    try {
      const result = await this.orderService.processOrder(req.body);

      return res.json({
        message: 'Pedido processado com sucesso',
        orderId: result.orderId,
        emailPreview: result.emailPreview
      });
    } catch (error: any) {
      if (error instanceof OrderValidationError) {
        return res.status(400).json({ error: error.message });
      }
      logger.error(`Erro ao processar pedido: ${error.message}`);
      return res.status(500).json({ error: 'Erro interno' });
    }
  }
}