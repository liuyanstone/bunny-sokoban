// Minimum-cost perfect matching (Hungarian algorithm), O(n^3), not n!.
export function assignmentCost(cost){
 const n=cost.length;if(!n)return 0;if(cost.some(r=>r.length!==n))return Infinity;
 const u=Array(n+1).fill(0),v=Array(n+1).fill(0),p=Array(n+1).fill(0),way=Array(n+1).fill(0);
 for(let i=1;i<=n;i++){p[0]=i;let j0=0;const minv=Array(n+1).fill(Infinity),used=Array(n+1).fill(false);
 do{used[j0]=true;const i0=p[j0];let delta=Infinity,j1=0;for(let j=1;j<=n;j++)if(!used[j]){const cur=cost[i0-1][j-1]-u[i0]-v[j];if(cur<minv[j]){minv[j]=cur;way[j]=j0;}if(minv[j]<delta){delta=minv[j];j1=j;}}if(!Number.isFinite(delta))return Infinity;
 for(let j=0;j<=n;j++){if(used[j]){u[p[j]]+=delta;v[j]-=delta;}else minv[j]-=delta;}j0=j1;
 }while(p[j0]!==0);
 do{const j1=way[j0];p[j0]=p[j1];j0=j1;}while(j0!==0);
 }return -v[0];
}
