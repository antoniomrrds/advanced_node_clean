import './config/module-alias'
import 'reflect-metadata'

import { PostgresDataSource } from '@/infrastructure/postgres/connection'
import { portServer } from '@/main/config/env'
import { app } from '@/main/config'

PostgresDataSource.initialize()
  .then(_ =>
    app.listen(portServer, () => console.log(`🚀Server running at http://localhost:${portServer}`))
  ).catch(console.error)
