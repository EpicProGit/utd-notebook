import { drizzle } from 'drizzle-orm/neon-http';
import { env } from '@src/env.mjs';

import * as user from './schema/user';
import * as file from './schema/file';
import * as section from './schema/section';
const schema = {
  ...file,
  ...section,
  ...user,
};

export const db = drizzle(env.DATABASE_URL, {
  schema,
});
