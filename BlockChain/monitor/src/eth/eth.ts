import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers, WebSocketProvider } from 'ethers';

@Injectable()
export class Eth implements OnModuleInit, OnModuleDestroy {
  private provider!: WebSocketProvider;
  private readonly logger = new Logger(Eth.name);

  constructor(private config: ConfigService) { };


  get wsProvider(): WebSocketProvider {
    if (!this.provider) throw new Error('Provider not initialized');
    return this.provider;
  }


  async onModuleInit() {
    const url = this.config.get<string>("WS_RPC_URL") ?? ' ws://127.0.0.1:8545';
    this.logger.log(`Connecting to WebSocketProvider at ${url}`);

    this.provider = new ethers.WebSocketProvider(url);

    const ws = this.provider.websocket;

    ws.onopen = async () => {
      this.logger.log('Websocket connected');
      const network = await this.provider.getNetwork();
      this.logger.log(' Connected');
    };
  }

  async onModuleDestroy() {
    this.logger.log('Closing WebSocketProvider...');
    try {
      this.provider?.websocket?.close();
    } catch { }
  }
}
