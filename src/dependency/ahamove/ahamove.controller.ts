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
import { MessagePattern } from '@nestjs/microservices';
import { any } from 'flagsmith-nodejs/build/flagsmith-engine/segments/models';
import { Subject, connect } from 'rxjs';
@Controller('ahamove')
export class AhamoveController {
  private readonly logger = new Logger(AhamoveController.name);
  connectedClients = new Map<
    string,
    { close: () => void; subject: Subject<MessageEvent> }
  >();
  constructor(private readonly ahamoveService: AhamoveService) {}

  @Get('connect')
  async getCustomerProfile(
    @Query('id') orderId: string,
    @Res() response: Response,
  ) {
    //Check if token data is mapping with requested data
    if (!orderId) {
      throw new BadRequestException('Cannot access other user info');
    }

    // Create a subject for this client in which we'll push our data
    const subject = new Subject<MessageEvent>();

    // Create an observer that will take the data pushed to the subject and
    // write it to our connection stream in the right format
    const observer = {
      next: (msg: MessageEvent) => {
        // Called when data is pushed to the subject using subject.next()
        response.write(`data: ${JSON.stringify(msg.data)}\n\n`);
      },
      complete: () => {
        console.log(`observer.complete`);
      },
      error: (err: any) => {
        console.log(`observer.error: ${err}`);
      },
    };

    // Attach the observer to the subject
    subject.subscribe(observer);
    const order = await this.ahamoveService.getAhamoveOrderByOrderId(orderId);
    // Add the client to our client list
    if (order) {
      this.logger.log('Establist connection with client ' + orderId);
      this.connectedClients.set(orderId, {
        close: () => {
          response.end();
        }, // Will allow us to close the connection if needed
        subject, // Subject related to this client
      });
      // Handle connection closed
      response.on('close', () => {
        console.log(`Closing connection for client ${orderId}`);
        subject.complete(); // End the observable stream
        this.connectedClients.delete(orderId); // Remove client from the list
        response.end(); // Close connection (unsure if this is really requried, to release the resources)
      });
    } else {
      throw new BadRequestException('Tracking order not found');
    }

    // Send headers to establish SSE connection
    response.set({
      'Cache-Control':
        'private, no-cache, no-store, must-revalidate, max-age=0, no-transform',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
    });

    response.flushHeaders();
  }

  /** Send a SSE message to the specified client */
  @Post('webhook')
  async sendDataToClient(@Body() payload: any) {
    if (!payload._id) {
      throw new BadRequestException('Tracking number not found');
    }
    try {
      await this.ahamoveService.saveAhamoveTrackingWebhook(payload);
    } catch (error) {
      this.logger.error('failed to save tracking data ', payload._id, error);
    }
    let message: MessageEvent = {
      data: payload,
    };
    if (this.connectedClients.get(payload._id)) {
      return this.connectedClients.get(payload._id)?.subject.next(message);
    } else {
      this.logger.error('None existed client with id ' + payload._id);
    }
  }

  @Post('estimate')
  getEstimateFee(@Body() coordinates) {
    return this.ahamoveService.estimatePrice(coordinates);
  }

  @Post('order')
  @MessagePattern({ cmd: 'create_ahamove_order' })
  postAhamoveOrder(@Body() order) {
    return this.ahamoveService.postAhamoveOrder(order);
  }
}
