import { Sequelize } from "sequelize-typescript";

export const sequelize = new Sequelize("sqlite::memory:");

sequelize.addModels([__dirname + "/data/*.*"]);
