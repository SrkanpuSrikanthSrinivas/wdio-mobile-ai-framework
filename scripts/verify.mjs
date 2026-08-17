// verify.mjs — checks a participant's machine is ready for the workshop.
//   npm run verify
// The phone runs in the cloud (GitHub Actions), so you only need these tools
// locally: Node, Git, aider, toklite, and a Groq (or Anthropic) key.

import { execFileSync } from 'node:child_process';

const G='\x1b[92m', Y='\x1b[93m', R='\x1b[91m', X='\x1b[0m';
const line=(s,l,d='')=>console.log(`  ${{PASS:G,WARN:Y,FAIL:R}[s]}${s.padEnd(4)}${X}  ${l}${d?' — '+d:''}`);
function has(cmd,args=['--version']){try{execFileSync(cmd,args,{stdio:'pipe'});return true;}catch{return false;}}

console.log('\nWorkshop readiness check\n');
let ready=true;

const node=process.versions.node.split('.').map(Number);
const nodeOk=node[0]>=18;
line(nodeOk?'PASS':'FAIL','Node 18+',process.versions.node);
ready=ready&&nodeOk;

const gitOk=has('git'); line(gitOk?'PASS':'FAIL','Git'); ready=ready&&gitOk;

let aider=has('aider');
if(!aider) aider=has('python',['-m','aider','--version'])||has('python3',['-m','aider','--version']);
line(aider?'PASS':'FAIL','aider', aider?'':'install with uv — see README step 1a');
ready=ready&&aider;

const tok=has('toklite',['--help']);
line(tok?'PASS':'FAIL','toklite', tok?'':'run: npm install -g toklite js-tiktoken');
ready=ready&&tok;

const key=process.env.GROQ_API_KEY||process.env.ANTHROPIC_API_KEY;
line(key?'PASS':'WARN','AI key', key?'':'export GROQ_API_KEY=gsk_... (free: console.groq.com/keys)');

console.log();
if(ready && key) console.log(`  ${G}Ready! Run:  npm run ai:groq${X}\n`);
else if(ready) console.log(`  ${Y}Almost — set your GROQ_API_KEY, then: npm run ai:groq${X}\n`);
else console.log(`  ${R}Some tools are missing above. Fix those (README step 1), then re-run npm run verify.${X}\n`);
