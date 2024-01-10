import { DB } from '@/main/config/env'
import { DataSourceOptions, DataSource } from 'typeorm'

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: DB.host,
  port: DB.port,
  username: DB.username,
  password: DB.password,
  database: DB.database,
  entities: [
    'dist/infrastructure/postgres/entities/**/*{.ts,.js}'
  ],
  synchronize: true
}
export const PostgresDataSource = new DataSource(dataSourceOptions)
