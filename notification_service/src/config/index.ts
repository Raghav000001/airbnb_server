// all the basic configurations like port number, database url, secret key for jwt etc will be stored in this file 

import dotenv from "dotenv"

type Config = {
    // we can add more configuration options types here like database url, secret key for jwt etc
    PORT: number,
    REDIS_HOST: string,
    REDIS_PORT: number,
}


export function loadConfig() {
    dotenv.config()
}

loadConfig()

export const serverConfig : Config = {
   PORT: Number(process.env.PORT) || 3000,
   REDIS_HOST: process.env.REDIS_HOST || "localhost",
   REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
}



