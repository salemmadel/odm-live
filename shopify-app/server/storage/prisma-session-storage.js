import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PrismaSessionStorage {
  async storeSession(session) {
    await prisma.session.upsert({
      where: { id: session.id },
      update: {
        shop: session.shop,
        state: session.state,
        isOnline: session.isOnline,
        scope: session.scope || '',
        accessToken: session.accessToken || '',
        expires: session.expires,
        onlineAccessInfo: session.onlineAccessInfo ? JSON.stringify(session.onlineAccessInfo) : null,
      },
      create: {
        id: session.id,
        shop: session.shop,
        state: session.state,
        isOnline: session.isOnline,
        scope: session.scope || '',
        accessToken: session.accessToken || '',
        expires: session.expires,
        onlineAccessInfo: session.onlineAccessInfo ? JSON.stringify(session.onlineAccessInfo) : null,
      },
    });
    return true;
  }

  async loadSession(id) {
    const sessionData = await prisma.session.findUnique({
      where: { id },
    });

    if (!sessionData) return undefined;

    return {
      id: sessionData.id,
      shop: sessionData.shop,
      state: sessionData.state,
      isOnline: sessionData.isOnline,
      scope: sessionData.scope,
      accessToken: sessionData.accessToken,
      expires: sessionData.expires,
      onlineAccessInfo: sessionData.onlineAccessInfo ? JSON.parse(sessionData.onlineAccessInfo) : undefined,
    };
  }

  async deleteSession(id) {
    try {
      await prisma.session.delete({
        where: { id },
      });
    } catch (error) {
      // Ignore if session doesn't exist
    }
    return true;
  }

  async deleteSessions(ids) {
    await prisma.session.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return true;
  }

  async findSessionsByShop(shop) {
    const sessions = await prisma.session.findMany({
      where: { shop },
    });

    return sessions.map((sessionData) => ({
      id: sessionData.id,
      shop: sessionData.shop,
      state: sessionData.state,
      isOnline: sessionData.isOnline,
      scope: sessionData.scope,
      accessToken: sessionData.accessToken,
      expires: sessionData.expires,
      onlineAccessInfo: sessionData.onlineAccessInfo ? JSON.parse(sessionData.onlineAccessInfo) : undefined,
    }));
  }
}
