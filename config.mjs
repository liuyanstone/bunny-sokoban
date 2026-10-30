export const TIERS=['easy','medium','hard','expert','master'];
export const LEVELS_PER_TIER=200;
export const TOTAL_LEVELS=TIERS.length*LEVELS_PER_TIER;
export const SCORE={easy:100,medium:200,hard:350,expert:600,master:1000};
export function restoreProgress(saved){
 const p=saved&&saved.version===1?saved:{version:1,total:0,completed:{},attempts:{},positions:{},tier:'easy'};
 return {...p,completed:p.completed||{},attempts:p.attempts||{},positions:Object.fromEntries(TIERS.map(t=>[t,Number.isInteger(p.positions?.[t])?Math.max(0,Math.min(199,p.positions[t])):0])),tier:TIERS.includes(p.tier)?p.tier:'easy'};
}
