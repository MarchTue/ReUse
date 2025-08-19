import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';


@Injectable()
export class ConfigService {
  get(key: string): string | undefined {
    return process.env[key];
  }
  getNumber(key: string, fallback = 0): number {
    const v = process.env[key];
    return v ? Number(v) : fallback;
  }
}
