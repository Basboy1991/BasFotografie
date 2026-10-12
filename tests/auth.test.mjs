import test from 'node:test';
import assert from 'node:assert/strict';
import {hashPassword,verifyPassword} from '../lib/password.mjs';
import {sealData,unsealData} from 'iron-session';
test('password hashing uses fresh salts and rejects incorrect/malformed credentials',async()=>{
 const password='local-test-password-only';const first=await hashPassword(password),second=await hashPassword(password);
 assert.notEqual(first,second);assert.equal(await verifyPassword(password,first),true);assert.equal(await verifyPassword('wrong-password',first),false);assert.equal(await verifyPassword(password,'scrypt:not-a-hash'),false);
 await assert.rejects(hashPassword('short'));
});
test('encrypted session rejects tampering and expires',async()=>{
 const password='test-secret-never-used-in-production-1234567890';
 const sealed=await sealData({userId:'bas-owner',version:'current'},{password,ttl:60});
 assert.equal((await unsealData(sealed,{password,ttl:60})).userId,'bas-owner');
 assert.deepEqual(await unsealData(sealed.slice(0,25)+(sealed[25]==='a'?'b':'a')+sealed.slice(26),{password,ttl:60}),{});
 const originalNow=Date.now;try{Date.now=()=>originalNow()+600_000;assert.deepEqual(await unsealData(sealed,{password,ttl:60}),{});}finally{Date.now=originalNow;}
 assert.deepEqual(await unsealData(sealed,{password:'a-different-test-secret-with-at-least-32-characters',ttl:60}),{});
});
