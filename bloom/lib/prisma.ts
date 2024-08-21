export const runtime = 'experimental-edge'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client';
//import ws from 'ws'

//if (!isBrowser) {
//  neonConfig.webSocketConstructor = ws;
//} else {
  neonConfig.webSocketConstructor = WebSocket;
//}

const connectionString = process.env.POSTGRES_PRISMA_URL!

const pool = new Pool({ connectionString })
const adapter = new PrismaNeon(pool)
const prisma = new PrismaClient({ adapter });

export default prisma;
