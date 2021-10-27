import "dotenv/config";

const app: any = {
  env: process.env.NODE_ENV || "development",
};

const dbConfig: any = {
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || "db_name",
  password: process.env.DB_PASS || "1111",
  username: process.env.DB_USER || "root",
  host: process.env.DB_HOST || "localhost",
  dialect: "mysql",
};

const jwtConfing: any = {
  secretKey: "wanted",
};

export { app, dbConfig, jwtConfing };
