import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import fs from "fs";
import {logger} from "../utils/logger";
import dotenv from 'dotenv';
dotenv.config();

const publickey = fs.readFileSync(process.env.PUBLIC_KEY_PATH as string, 'utf8');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: publickey,
    algorithms: ['RS256' as const],
};

passport.use(new JWTStrategy(opts, async (jwt_payload, done) => {
    try {
        return done(null, jwt_payload);
    } catch (error) {
        logger.error('Passport JWT strategy error:', error);
        return done(error, false);
    }
}));
