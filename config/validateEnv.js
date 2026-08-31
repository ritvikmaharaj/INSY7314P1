const requiredEnvVars = ["JWT_SECRET", "MONGO_URI"];

const validateEnv = () => {
    const missing = requiredEnvVars.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        console.error(
            `Missing required environment variables: ${missing.join(", ")}`
        );
        process.exit(1);
    }

    if (process.env.JWT_SECRET.length < 32) {
        console.error(
            "JWT_SECRET is too short/weak. Use at least 32 random characters."
        );
        process.exit(1);
    }
};

module.exports = validateEnv;