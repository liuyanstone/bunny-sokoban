"""Curate 600 distinct Boxoban puzzles and retain their verified solutions.
Run after solve.cpp has produced <tier>-solutions.tsv beside downloaded source files.
"""
import os,json,sys
src=sys.argv[1] if len(sys.argv)>1 else '../boxoban-source'

def crop(rows):
 p=next((x,y) for y,row in enumerate(rows) for x,c in enumerate(row) if c=='@')
 seen={p};q=[p]
 for x,y in q:
  for dx,dy in [(0,-1),(0,1),(-1,0),(1,0)]:
   v=(x+dx,y+dy)
   if 0<=v[0]<10 and 0<=v[1]<10 and rows[v[1]][v[0]]!='#' and v not in seen:seen.add(v);q.append(v)
 loX=min(x for x,y in seen)-1;hiX=max(x for x,y in seen)+1;loY=min(y for x,y in seen)-1;hiY=max(y for x,y in seen)+1
 return [''.join(rows[y][x] if (x,y) in seen else '#' for x in range(loX,hiX+1)) for y in range(loY,hiY+1)]

def canonical(rows):
 variants=[]
 for flip in [False,True]:
  a=[r[::-1] for r in rows] if flip else rows
  for turn in range(4):
   variants.append('\n'.join(a));a=[''.join(r) for r in zip(*a[::-1])]
 return min(variants)

used=set();result={}
for tier in ['easy','medium','hard']:
 raw=open(os.path.join(src,tier+'.txt')).read().split(';')[1:]
 maps={int(x.splitlines()[0].strip()):x.splitlines()[1:11] for x in raw}
 solved=[]
 for line in open(os.path.join(src,tier+'-solutions.tsv')):
  ident,pushes,expanded,solution=line.strip().split('\t');ident=int(ident)
  solved.append(dict(sourceId=ident,pushes=int(pushes),expanded=int(expanded),solution=solution,rows=crop(maps[ident])))
 solved.sort(key=lambda x:(x['pushes'],len(x['solution']),x['sourceId']))
 # Separate bands make the progression concrete: easy 4–9 pushes,
 # medium 14–18 pushes, hard 22+ pushes for these source files.
 if tier=='medium':solved=solved[400:]+solved[:400]
 if tier=='hard':solved=solved[800:]+solved[:800]
 chosen=[]
 for item in solved:
  k=canonical(item['rows'])
  if k in used:continue
  used.add(k);item.pop('expanded');item['id']=tier+'-'+str(len(chosen)+1).zfill(3);item['source']='unfiltered/train/000.txt' if tier=='easy' else 'medium/train/000.txt' if tier=='medium' else 'hard/000.txt';chosen.append(item)
  if len(chosen)==200:break
 assert len(chosen)==200
 result[tier]=chosen
 print(tier,len(chosen),'pushes',min(x['pushes'] for x in chosen),max(x['pushes'] for x in chosen))
open('levels.json','w').write(json.dumps(result,separators=(',',':'))+'\n')
