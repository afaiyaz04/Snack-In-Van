const redis = require("redis");

var redisClient;
if (process.env.NODE_ENV === "production") {
	redisClient = redis.createClient(process.env.REDIS_URL, {
		enable_offline_queue: false,
	});
} else {
	redisClient = redis.createClient({
		enable_offline_queue: false,
	});
}

module.exports = redisClient;
