import {hashPassword} from '../lib/password.mjs';
if(!process.stdin.isTTY)throw new Error('Voer dit uit in een interactieve terminal.');
process.stdout.write('Nieuw beheerwachtwoord (minimaal 12 tekens): ');
process.stdin.setRawMode(true);process.stdin.setEncoding('utf8');let password='';
process.stdin.on('data',async chunk=>{for(const c of chunk){if(c==='\u0003')process.exit(130);if(c==='\r'||c==='\n'){process.stdin.setRawMode(false);process.stdin.pause();process.stdout.write('\n');try{console.log('ADMIN_PASSWORD_HASH='+await hashPassword(password));}catch(error){console.error(error.message);process.exitCode=1;}password='';return;}if(c==='\u007f'||c==='\b')password=password.slice(0,-1);else if(c>=' ')password+=c;}});
