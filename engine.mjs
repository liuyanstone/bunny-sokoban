export const DIRECTIONS={U:[0,-1],D:[0,1],L:[-1,0],R:[1,0]};
export function parse(rows){
 const width=rows[0].length,height=rows.length,walls=[],goals=[],boxes=[];let player=-1;
 rows.forEach((r,y)=>[...r].forEach((c,x)=>{const p=y*width+x;if(c==='#')walls.push(p);if('.+*'.includes(c))goals.push(p);if('$*'.includes(c))boxes.push(p);if('@+'.includes(c))player=p;}));
 return {width,height,walls,goals,player,boxes:boxes.sort((a,b)=>a-b),moves:0,pushes:0};
}
export function advance(board,state,direction){
 const delta=DIRECTIONS[direction];if(!delta)return null;
 const [dx,dy]=delta;const x=state.player%board.width+dx,y=Math.floor(state.player/board.width)+dy;
 if(x<0||x>=board.width||y<0||y>=board.height)return null;
 const target=y*board.width+x;if(board.walls.includes(target))return null;
 const boxes=[...state.boxes],i=boxes.indexOf(target);let pushed=false;
 if(i>=0){const bx=x+dx,by=y+dy;if(bx<0||bx>=board.width||by<0||by>=board.height)return null;const to=by*board.width+bx;if(board.walls.includes(to)||boxes.includes(to))return null;boxes[i]=to;boxes.sort((a,b)=>a-b);pushed=true;}
 return {player:target,boxes,moves:(state.moves||0)+1,pushes:(state.pushes||0)+(pushed?1:0)};
}
export function won(board,state){return state.boxes.length===board.goals.length&&state.boxes.every(p=>board.goals.includes(p));}
export function stateKey(state){return state.player+':'+[...state.boxes].sort((a,b)=>a-b).join(',');}
export function replay(board,state,solution){let s=state;for(const d of solution){s=advance(board,s,d);if(!s)return null;}return won(board,s)?s:null;}
export function knownSuffix(board,start,solution,current){let s=start;for(let i=0;i<=solution.length;i++){if(stateKey(s)===stateKey(current))return solution.slice(i);if(i<solution.length){s=advance(board,s,solution[i]);if(!s)return null;}}return null;}
export const SCORE={easy:100,medium:200,hard:350};
export function award(progress,id,tier,sessionWon){if(sessionWon)return progress;return {...progress,total:(progress.total||0)+SCORE[tier],completed:{...progress.completed,[id]:(progress.completed?.[id]||0)+1}};}
