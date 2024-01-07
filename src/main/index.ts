import './config/module-alias'
import { portServer } from '@/main/config/env'

import 'reflect-metadata'

import { app } from '@/main/config'

app.listen(portServer, () => console.log(`🚀Server running at http://localhost:${portServer}`))
