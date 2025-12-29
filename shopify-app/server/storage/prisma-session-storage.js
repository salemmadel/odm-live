import { PrismaClient } from '@prisma/client';
import { Session } from '@shopify/shopify-api';

const prisma = new PrismaClient();

export class PrismaSessionStorage {
  async storeSession(session) {
    await prisma.session.upsert({
      where: { id: session.id },
      update: {
        shop: session.shop,
        state: session.state,
        isOnline: session.isOnline,
        scope: session.scope,
        accessToken: session.accessToken,
        expires: session.expires,
        onlineAccessInfo: session.onlineAccessInfo ? JSON.stringify(session.onlineAccessInfo) : null,
      },
      create: {
        id: session.id,
        shop: session.shop,
        state: session.state,
        isOnline: session.isOnline,
        scope: session.scope,
        accessToken: session.accessToken,
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

    const session = new Session({
      id: sessionData.id,
      shop: sessionData.shop,
      state: sessionData.state,
      isOnline: sessionData.isOnline,
    });

    if (sessionData.scope) session.scope = sessionData.scope;
    if (sessionData.accessToken) session.accessToken = sessionData.accessToken;
    if (sessionData.expires) session.expires = sessionData.expires;
    if (sessionData.onlineAccessInfo) {
      session.onlineAccessInfo = JSON.parse(sessionData.onlineAccessInfo);
    }

    return session;
  }

  async deleteSession(id) {
    await prisma.session.delete({
      where: { id },
    });
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

    return sessions.map((sessionData) => {
      const session = new Session({
        id: sessionData.id,
        shop: sessionData.shop,
        state: sessionData.state,
        isOnline: sessionData.isOnline,
      });

      if (sessionData.scope) session.scope = sessionData.scope;
      if (sessionData.accessToken) session.accessToken = sessionData.accessToken;
      if (sessionData.expires) session.expires = sessionData.expires;
      if (sessionData.onlineAccessInfo) {
        session.onlineAccessInfo = JSON.parse(sessionData.onlineAccessInfo);
      }

      return session;
    });
  }
}
