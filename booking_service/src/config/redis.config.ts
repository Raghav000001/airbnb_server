import {Redis} from "ioredis"
import { serverConfig } from "./index.ts"
import Redlock from "redlock";


const redisClient = new Redis(serverConfig.REDIS_URL)

const redLock = new Redlock([redisClient],{
    retryCount: 0,
    retryDelay: 200,
    driftFactor: 0.01,
    retryJitter: 200,
    
})

export {
    redisClient,
    redLock
}