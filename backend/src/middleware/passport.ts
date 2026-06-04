import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { persons } from "../db/Person";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { db } from "../db/client";
import fs from "fs";
import logger from "../../logger";

const publickey = fs.readFileSync(process.env.PUBLIC_KEY_PATH as string, 'utf8');
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: publickey,
    algorithms: ['RS256' as const],
};

passport.use(new JWTStrategy(opts, async (jwt_payload, done) => {
    try {
        const person = await db.select().from(persons)
            .where(eq(persons.personId, jwt_payload.tokenCredentials.personId))
            .limit(1);

        if (person.length === 0) {
            logger.warn('JWT valid but person not found', { personId: jwt_payload.tokenCredentials.personId });
            return done(null, false);
        }
        return done(null, person[0]);
    } catch (error) {
        logger.error('Passport JWT strategy error:', error);
        return done(error, false);
    }
}));
