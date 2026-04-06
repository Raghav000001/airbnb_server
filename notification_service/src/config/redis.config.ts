import logger from "./logger.config.ts";
import { Redis } from "ioredis";
import { serverConfig } from "./index.ts";

let connection: Redis;

const redisConfig = {
    host: serverConfig.REDIS_HOST,
    port: serverConfig.REDIS_PORT,
    maxRetriesPerRequest: null,
};

const getRedisConnection = () => {
    try {
        if (!connection) {
            connection = new Redis(redisConfig);
        }
        return connection;
    } catch (error) {
        logger.error("Error connecting to redis", error);
        throw error;
    }
};

export default getRedisConnection;
