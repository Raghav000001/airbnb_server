import {Redis} from "ioredis"
import { serverConfig } from "./index.ts"
import Redlock from "redlock";

let connection:Redis

 function getRedisConnection() {
   return ()=> {
       if (!connection) {
          connection = new Redis(serverConfig.REDIS_URL)
          return connection
       }
       return connection
   } 
}

const redisClient = getRedisConnection()

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