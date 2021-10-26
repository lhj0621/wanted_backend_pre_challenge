import { Sequelize } from "sequelize-typescript";
import { dbConfig as config } from "../config/config";

export const sequelize = new Sequelize("sqlite::memory:");

// console.log(`[__dirname + '/data/*.ts']   :`, [__dirname + '/data/*.ts']);
sequelize.addModels([__dirname + "/data/*.*"]);
