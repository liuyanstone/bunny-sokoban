import {readFile,writeFile} from 'node:fs/promises';
import {parse,replay} from '../engine.mjs';
const file=new URL('../collections/Skinner.sok',import.meta.url);
const text=(await readFile(file,'utf8')).replace(/\r\n?/g,'\n'),candidates=[];
for(const section of text.split(/(?=^David W\. Skinner, )/m)){
 const title=section.split('\n')[0].trim();if(!title.startsWith('David W. Skinner, Sasquatch'))continue;
 const lines=section.split('\n');let rows=[],found=false;
 for(const line of lines.slice(1)){if(/^ *[#.$@+* _-]+$/.test(line)&&line.includes('#')){rows.push(line.trimEnd().replace(/[_-]/g,' '));found=true;}else if(found)break;}
 if(!rows.length)continue;const width=Math.max(...rows.map(r=>r.length));rows=rows.map(r=>r.padEnd(width,' '));const board=parse(rows);let best=null;
 for(const part of section.split(/^Solution[^\n]*\n/gm).slice(1)){
  let solution='';for(const line of part.split('\n')){if(/^[UDLRudlr]+$/.test(line.trim()))solution+=line.trim().toUpperCase();else if(solution)break;else if(line.trim())break;}
  if(!solution)continue;const end=replay(board,board,solution);if(end&&(!best||solution.length<best.solution.length))best={solution,pushes:end.pushes};
 }
 if(best)candidates.push({source:title.replace('David W. Skinner, ',''),sourceId:0,author:'David W. Skinner',email:'sasquatch98930@yahoo.com',sourceUrl:'https://github.com/acmepjz/puzzleboy/blob/master/mfccourse/YASC/Skinner.sok',rows,boxes:board.boxes.length,...best});
}
console.log('Valid source levels:',candidates.length);
for(const minPush of [40,45,50,60,80,100])console.log('At least',minPush,'pushes, 5+ crates:',candidates.filter(l=>l.boxes>=5&&l.pushes>=minPush).length);
// Keep the original 600 entries byte-for-byte equivalent as parsed JSON.
const target=new URL('../levels.json',import.meta.url),levels=JSON.parse(await readFile(target));
function canonical(rows){const forms=[];for(const flip of [false,true]){let a=flip?rows.map(r=>[...r].reverse().join('')):rows;for(let i=0;i<4;i++){forms.push(a.join('\n'));a=a[0].split('').map((_,x)=>a.map(r=>r[x]).reverse().join(''));}}return forms.sort()[0];}
const seen=new Set(Object.values(levels).flat().filter(l=>!/^expert-|^master-/.test(l.id)).map(l=>canonical(l.rows)));
const pool=candidates.filter(l=>l.boxes>=5&&l.boxes<=60&&l.pushes>=30).sort((a,b)=>a.pushes-b.pushes||a.boxes-b.boxes||a.solution.length-b.solution.length).filter(l=>{const k=canonical(l.rows);if(seen.has(k))return false;seen.add(k);return true;});
if(pool.length<400)throw Error('Not enough distinct verified classic levels');
const selected=pool.slice(-400);
for(const [tier,offset] of [['expert',0],['master',200]]){levels[tier]=selected.slice(offset,offset+200).map((l,i)=>({...l,id:`${tier}-${String(i+1).padStart(3,'0')}`}));console.log(tier,levels[tier].length,'push range',levels[tier][0].pushes,levels[tier].at(-1).pushes);}
await writeFile(target,JSON.stringify(levels)+'\n');
