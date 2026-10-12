import {randomBytes,scrypt as callback,timingSafeEqual} from 'node:crypto';
import {promisify} from 'node:util';
const scrypt=promisify(callback);
export async function hashPassword(password){if(password.length<12||password.length>256)throw new Error('Gebruik een wachtwoord van 12 tot 256 tekens.');const salt=randomBytes(16).toString('hex');const derived=await scrypt(password,salt,64);return `scrypt:${salt}:${derived.toString('hex')}`;}
export async function verifyPassword(password,stored){if(typeof password!=='string'||password.length>256||!/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(stored||''))return false;const [,salt,hash]=stored.split(':');const derived=await scrypt(password,salt,64);return timingSafeEqual(derived,Buffer.from(hash,'hex'));}
