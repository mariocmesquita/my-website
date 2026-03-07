import 'server-only';

import { env } from '@my-website/env';
import * as admin from 'firebase-admin';

function getApp(): admin.app.App {
  if (admin.apps.length > 0) return admin.apps[0]!;

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

export async function verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
  return admin.auth(getApp()).verifyIdToken(idToken);
}
