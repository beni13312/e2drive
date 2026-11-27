const Config = {
    SESSION_EXPIRES: 24 * 60 * 60 * 1000, // 24h
    DATA_STORAGE: "./test/storage"
} as const;

export default Config;