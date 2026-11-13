// verify.mjs — checks a participant's machine is ready for the workshop.
//   npm run verify
// The phone runs in the cloud (GitHub Actions), so you only need these tools
// locally: Node, Git, aider, toklite, and an AI key (Gemini, Groq or Anthropic).

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

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
line(aider?'PASS':'FAIL','aider', aider?'':'install with uv — see README → Troubleshooting');
ready=ready&&aider;

const tok=has('toklite',['--help']);
line(tok?'PASS':'FAIL','toklite', tok?'':'run: npm install -g toklite js-tiktoken');
ready=ready&&tok;

let envFile='';try{envFile=readFileSync('.env','utf8');}catch{}
const key=process.env.GEMINI_API_KEY||process.env.GROQ_API_KEY||process.env.ANTHROPIC_API_KEY||/^(GEMINI|GROQ|ANTHROPIC)_API_KEY=\S+/m.test(envFile);
line(key?'PASS':'WARN','AI key', key?'':'add GEMINI_API_KEY (free: aistudio.google.com/apikey) or GROQ_API_KEY to .env');

console.log();
if(ready && key) console.log(`  ${G}Ready! Run:  npm run ai:gemini${X}\n`);
else if(ready) console.log(`  ${Y}Almost — add an AI key to .env, then: npm run ai:gemini${X}\n`);
else console.log(`  ${R}Some tools are missing above. Fix those (README → Quick start), then re-run npm run verify.${X}\n`);
