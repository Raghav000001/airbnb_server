// all the basic configurations like port number, database url, secret key for jwt etc will be stored in this file 

import dotenv from "dotenv"

type Config = {
    // we can add more configuration options types here like database url, secret key for jwt etc
    PORT: number,
    REDIS_URL: string,
    REDIS_LOCK_TTL: number,
}


export function loadConfig() {
    dotenv.config()
}

loadConfig()

export const serverConfig : Config = {
   PORT: Number(process.env.PORT) || 3000, 
   REDIS_URL: process.env.REDIS_URL! || "redis://localhost:6379",
   REDIS_LOCK_TTL: Number(process.env.REDIS_LOCK_TTL) * 10 || 60000 * 10,
}



