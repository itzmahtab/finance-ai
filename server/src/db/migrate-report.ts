import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(__dirname, '../../.env') })

const sql = neon(process.env.DATABASE_URL!)

async function migrate() {
  console.log('Migrating AI Context Type enum...')
  try {
    // Postgres 13+ supports ADD VALUE IF NOT EXISTS
    await sql('ALTER TYPE "public"."ai_context_type" ADD VALUE IF NOT EXISTS \'report\'')
    console.log('Successfully added "report" to ai_context_type!')
  } catch (err: any) {
    if (err.message?.includes('already exists')) {
      console.log('"report" already exists in enum.')
    } else {
      console.error('Migration failed:', err.message)
    }
  } finally {
    process.exit(0)
  }
}

migrate()
