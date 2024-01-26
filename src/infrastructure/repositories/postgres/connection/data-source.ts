import { DB } from '@/main/config/env'
import { DataSourceOptions, DataSource } from 'typeorm'

const pgDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: DB.host,
  port: DB.port,
  username: DB.username,
  password: DB.password,
  database: DB.database
}
const dataSourceOptions: DataSourceOptions = {
  ...pgDataSourceOptions,
  entities: [
      `${process.env.TS_NODE_DEV === undefined ? 'src' : 'dist'}/infrastructure/repositories/postgres/entities/**/*{.ts,.js}`
  ],
  synchronize: true
}
export const PostgresDataSource = new DataSource(dataSourceOptions)
