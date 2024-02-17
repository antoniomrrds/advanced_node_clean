import './config/module-alias'
import 'reflect-metadata'

import { PgConnection } from '@/infrastructure/repositories/postgres'
import { portServer } from '@/main/config/env'
import { app } from '@/main/config'

PgConnection.getInstance().connect()
  .then(_ =>
    app.listen(portServer, () => console.log(`🚀Server running at http://localhost:${portServer}`))
  ).catch(console.error)
