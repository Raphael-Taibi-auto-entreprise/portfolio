import { defineConfig } from '@prisma/config'

export default defineConfig({
  schema: './schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'postgres://08e4fc33bef43d326b432813a18eb7e58faa1287190b911476ea7169721b0db2:sk_5KKCbae1St2hBE8Lg25U0@db.prisma.io:5432/postgres?sslmode=require',
  },
})
