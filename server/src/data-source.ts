import * as dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";

dotenv.config();
export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "store",
    logging: false,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
})