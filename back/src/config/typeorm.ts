/* eslint-disable prettier/prettier */
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/src/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  autoloadEntities: true,
  logging: ['error'],
  migrationsRun: true,
  synchronize: true,
  //dropSchema: true,
};
export default registerAs('typeorm', () => config);
export const connectDataSource = () =>
  new DataSource(config as DataSourceOptions);