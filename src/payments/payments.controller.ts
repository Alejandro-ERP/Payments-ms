import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { type Request, type Response } from 'express';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create-payment-session')
  async createPayment(@Body() processPaymentDto: ProcessPaymentDto) {
    return await this.paymentsService.processPayment(processPaymentDto);
  }

  @Get('successful')
  getApprovedPayments() {
    return this.paymentsService.approvedPayments();
  }

  @Get('canceled')
  getCanceledPayments() {
    return this.paymentsService.canceledPayments();
  }

  @Post('webhook')
  webhookCreated(@Req() req: Request, @Res() res: Response) {
    this.paymentsService.webhookStatus(req, res);
  }
}
