import {
  BadRequestException,
  Body,
  Controller,
  MessageEvent,
  Logger,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AhamoveService } from './ahamove.service';
import { Get } from '@nestjs/common';
import { Response } from 'express';
import { Subject } from 'rxjs';
import { WebOrderService } from 'src/domain/web-customer/service/web.order.service';
@Controller('ahamove')
export class AhamoveController {
  private readonly logger = new Logger(AhamoveController.name);
  connectedClients = new Map<
    string,
    { close: () => void; subject: Subject<MessageEvent> }
  >();
  constructor(
    private readonly ahamoveService: AhamoveService,
    private readonly orderService: WebOrderService,
  ) {}

  // @Get('connect')
  // async createOrderSseConnection(
  //   @Query('id') orderId: string,
  //   @Res() response: Response,
  // ) {
  //   //Check if token data is mapping with requested data
  //   if (!orderId) {
  //     throw new BadRequestException('Cannot access other user info');
  //   }

  //   // Create a subject for this client in which we'll push our data
  //   const subject = new Subject<MessageEvent>();

  //   // Create an observer that will take the data pushed to the subject and
  //   // write it to our connection stream in the right format
  //   const observer = {
  //     next: (msg: MessageEvent) => {
  //       // Called when data is pushed to the subject using subject.next()
  //       response.write(`data: ${JSON.stringify(msg.data)}\n\n`);
  //     },
  //     complete: () => {
  //       console.log(`observer.complete`);
  //     },
  //     error: (err: any) => {
  //       console.log(`observer.error: ${err}`);
  //     },
  //   };

  //   // Attach the observer to the subject
  //   subject.subscribe(observer);
  //   const order = await this.orderService.getOrderById(orderId);
  //   // Add the client to our client list
  //   if (order) {
  //     this.logger.log('Establist connection with client ' + orderId);
  //     this.connectedClients.set(orderId, {
  //       close: () => {
  //         response.end();
  //       }, // Will allow us to close the connection if needed
  //       subject, // Subject related to this client
  //     });
  //     // Handle connection closed
  //     response.on('close', () => {
  //       console.log(`Closing connection for client ${orderId}`);
  //       subject.complete(); // End the observable stream
  //       this.connectedClients.delete(orderId); // Remove client from the list
  //       response.end(); // Close connection (unsure if this is really requried, to release the resources)
  //     });
  //   } else {
  //     throw new BadRequestException('Tracking order not found');
  //   }

  //   // Send headers to establish SSE connection
  //   response.set({
  //     'Cache-Control':
  //       'private, no-cache, no-store, must-revalidate, max-age=0, no-transform',
  //     Connection: 'keep-alive',
  //     'Content-Type': 'text/event-stream',
  //   });

  //   response.flushHeaders();
  // }

  /** Handle request from Ahamove Webhook */
  @Post('webhook')
  async handleAhamoveWebhook(@Body() payload: any) {
    this.logger.log('Incoming data: ' + JSON.stringify(payload));
    const deliveryOrderId = String(payload._id).split('-')[0];

    if (!deliveryOrderId) {
      throw new BadRequestException('Tracking number not found');
    }
    try {
      //TODO: authen
      await this.ahamoveService.saveAhamoveTrackingWebhook(payload);
      await this.orderService.updateOrderStatusByWebhook(
        deliveryOrderId,
        payload,
      );
      // this.sendOrderDataToClient(updatedOrder);
    } catch (error) {
      this.logger.error(
        `failed to save tracking data ${deliveryOrderId} with ${error}`,
      );
    }
    return;
  }

  // /** Send a SSE message to the specified client */
  // @Post('push-message')
  // async sendOrderDataToClient(@Body() payload: any) {
  //   // this.logger.log('Incoming data: ' + JSON.stringify(payload));
  //   // if (!payload.order_id) {
  //   //   throw new BadRequestException('Tracking number not found');
  //   // }
  //   // let message: MessageEvent = {
  //   //   data: payload,
  //   // };
  //   // if (this.connectedClients.get(payload.order_id)) {
  //   //   return this.connectedClients.get(payload.order_id)?.subject.next(message);
  //   // } else {
  //   //   this.logger.error('None existed client with id ' + payload.order_id);
  //   // }
  // }
}
