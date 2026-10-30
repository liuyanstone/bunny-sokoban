import {DIRECTIONS} from './engine.mjs?v=2';
import {assignmentCost} from './assignment.mjs';
const DIR=Object.keys(DIRECTIONS);
const permutations=[];function permute(a=[],left=[0,1,2,3]){if(!left.length)permutations.push(a);else left.forEach((n,i)=>permute([...a,n],left.filter((_,j)=>j!==i)));}permute();
class Heap{a=[];push(x){let i=this.a.length;this.a.push(x);while(i){let p=(i-1)>>1;if(this.a[p].f<=x.f)break;this.a[i]=this.a[p];i=p;}this.a[i]=x;}pop(){const top=this.a[0],last=this.a.pop();if(this.a.length){let i=0;while(2*i+1<this.a.length){let c=2*i+1;if(c+1<this.a.length&&this.a[c+1].f<this.a[c].f)c++;if(this.a[c].f>=last.f)break;this.a[i]=this.a[c];i=c;}this.a[i]=last;}return top;}get length(){return this.a.length;}}
export function solve(board,start,{limit=70000,maxMs=3000}={}){
 // Large classic boards always have a verified replay; bound live search to
 // keep memory predictable. null means "use the original replay", not unsolvable.
 if(start.boxes.length>10||start.boxes.length!==board.goals.length)return null;
 const begin=Date.now(),N=board.width*board.height,walls=new Set(board.walls),goals=new Set(board.goals);
 const neighbor=(p,d)=>{const [dx,dy]=DIRECTIONS[d],x=p%board.width+dx,y=Math.floor(p/board.width)+dy;return x<0||y<0||x>=board.width||y>=board.height?-1:y*board.width+x;};
 const walk=(p,boxes)=>{const blocked=new Set(boxes),prev=new Int16Array(N).fill(-1),dir=Array(N),q=[p];prev[p]=p;let min=p;for(let i=0;i<q.length;i++)for(const d of DIR){const to=neighbor(q[i],d);if(to>=0&&!walls.has(to)&&!blocked.has(to)&&prev[to]<0){prev[to]=q[i];dir[to]=d;q.push(to);min=Math.min(min,to);}}return {prev,dir,min};};
 const dist=board.goals.map(g=>{const a=Array(N).fill(1e6),q=[g];a[g]=0;for(let i=0;i<q.length;i++)for(const d of DIR){const from=neighbor(q[i],d),stand=from<0?-1:neighbor(from,d);if(from>=0&&stand>=0&&!walls.has(from)&&!walls.has(stand)&&a[from]===1e6){a[from]=a[q[i]]+1;q.push(from);}}return a;});
 const estimates=new Map();const h=boxes=>{const key=boxes.join(',');if(estimates.has(key))return estimates.get(key);const value=boxes.length===4?Math.min(...permutations.map(perm=>boxes.reduce((sum,b,i)=>sum+dist[perm[i]][b],0))):assignmentCost(boxes.map(b=>dist.map(d=>d[b])));estimates.set(key,value);return value;};
 const first={...start,boxes:[...start.boxes].sort((a,b)=>a-b),g:0,parent:-1};const nodes=[first],open=new Heap(),best=new Map();
 const key=(n,w)=>w.min+':'+n.boxes.join(',');let w=walk(first.player,first.boxes);best.set(key(first,w),0);const firstH=h(first.boxes);if(firstH>=1e6)return null;open.push({f:firstH,id:0});let expanded=0;
 while(open.length&&expanded<limit){if(expanded%128===0&&Date.now()-begin>maxMs)return null;const item=open.pop(),node=nodes[item.id],reach=walk(node.player,node.boxes);if(best.get(key(node,reach))!==node.g)continue;expanded++;
 if(node.boxes.every(b=>goals.has(b))){let id=item.id,chain=[];while(nodes[id].parent>=0){chain.push(id);id=nodes[id].parent;}chain.reverse();let cur=first,result='';for(const nextId of chain){const next=nodes[nextId],r=walk(cur.player,cur.boxes);let stand=next.stand,path='';while(stand!==cur.player){path=r.dir[stand]+path;stand=r.prev[stand];}result+=path+next.direction;cur=next;}return result;}
 for(let i=0;i<node.boxes.length;i++)for(const direction of DIR){const box=node.boxes[i],to=neighbor(box,direction),opposite={U:'D',D:'U',L:'R',R:'L'}[direction],stand=neighbor(box,opposite);if(to<0||stand<0||walls.has(to)||node.boxes.includes(to)||reach.prev[stand]<0)continue;
 const boxes=[...node.boxes];boxes[i]=to;boxes.sort((a,b)=>a-b);const estimate=h(boxes);if(estimate>=1e6)continue;const next={boxes,player:box,g:node.g+1,parent:item.id,stand,direction},nextWalk=walk(box,boxes),k=key(next,nextWalk);if(best.has(k)&&best.get(k)<=next.g)continue;best.set(k,next.g);nodes.push(next);open.push({f:next.g+estimate,id:nodes.length-1});}
 }return null;
}
