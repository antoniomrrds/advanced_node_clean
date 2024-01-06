import './config/module-alias'
import 'reflect-metadata'

import { app } from '@/main/config'

const portServer = 3000
app.listen(3000, () => console.log(`🚀Server running at http://localhost:${portServer}`))
