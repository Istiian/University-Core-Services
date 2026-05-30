import passport from "passport";
import {Strategy as JWTStrategy, ExtractJwt} from "passport-jwt";
import {persons} from "./src/db/Person";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { db } from "./src/db/client";
import fs from "fs";

const publickey = fs.readFileSync(process.env.PUBLIC_KEY_PATH as string, 'utf8');
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: publickey
};

passport.use(new JWTStrategy(opts, async (jwt_payload, done) => {
    try{
       const person = await db.select({
        where: eq(persons.personId, jwt_payload.tokenCredentials.personId)}).from(persons);

        if(person.length === 0){
            return done(null, false);
        }
        return done(null, person[0]);
    }catch(error){
        return done(error, false);
    }
}));
