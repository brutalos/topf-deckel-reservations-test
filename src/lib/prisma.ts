import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaInstance: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaInstance ?? prismaClientSingleton()

export { prisma }

if (process.env.NODE_ENV !== 'production') globalThis.prismaInstance = prisma
