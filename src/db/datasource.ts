import { DataSource, DataSourceOptions } from 'typeorm';
// import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

// config();

const config = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: config.getOrThrow<string>('DB_HOST'),
  port: config.getOrThrow<number>('DB_PORT'),
  username: config.getOrThrow<string>('DB_USER'),
  password: config.getOrThrow<string>('DB_PASSWORD'),
  database: config.getOrThrow<string>('DB_NAME'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: ['src/db/migrations/*.ts'],
  migrationsTableName: 'migrations',
  migrationsRun: false,
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
