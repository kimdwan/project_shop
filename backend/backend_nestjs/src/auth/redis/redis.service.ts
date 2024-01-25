import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";

@Injectable()
export class RedisService extends Redis {
  constructor (config:ConfigService) {
    super ({
      host : config.get("REDIS_HOST"),
      port : config.get("REDIS_PORT")
    })
  }
}