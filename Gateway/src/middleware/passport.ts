import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import fs from "fs";
import {logger} from "../utils/logger";
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.PUBLIC_KEY_PATH) {
    logger.error('PUBLIC_KEY_PATH environment variable is not set');
    process.exit(1);
}

let publickey: string;
try {
    publickey = fs.readFileSync(process.env.PUBLIC_KEY_PATH, 'utf8');
} catch (err) {
    logger.error(`Failed to read public key from "${process.env.PUBLIC_KEY_PATH}": ${err}`);
    process.exit(1);
}

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
