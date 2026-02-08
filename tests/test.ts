import { describe, expect, test } from '@jest/globals';
import { eq } from 'drizzle-orm';
import { db } from '@src/server/db';
import { type InsertClub } from '@src/server/db/models';
import { club } from '@src/server/db/schema';

/* NOTE: Example test file. Had to comment out due to runtime errors. Code was just copied from Jupiter I believe.
describe('This should create a club on supabase', () => {
  test('Should create a new club', async () => {
    const newCLub: InsertClub = {
      description: 'Computer science club at UTD',
      name: 'TEST ORG',
    };

    const returned = await db.insert(club).values(newCLub).returning();
    expect(returned.length === 1);
    const first = returned[0];
    expect(first?.name).toEqual('TEST ORG');
  });
});
*/
