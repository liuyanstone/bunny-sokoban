// Offline push-state A* solver. Outputs a legal complete walking solution.
#include <algorithm>
#include <array>
#include <fstream>
#include <iostream>
#include <queue>
#include <string>
#include <unordered_map>
#include <vector>
using namespace std;
const int INF=1000000,D[4]={-10,10,-1,1};const char C[4]={'U','D','L','R'};
struct Node{array<int,4>b;int p,g,parent,box,dir;};
struct Item{int f,n;bool operator<(const Item&o)const{return f>o.f;}};
bool floorCell[100],goal[100];int distGoal[4][100];vector<int> goals;
void flood(int p,const array<int,4>&b,array<int,100>&prev,array<int,100>&dir){prev.fill(-1);dir.fill(-1);bool blocked[100]={};for(int x:b)blocked[x]=true;int q[100],l=0,r=0;q[r++]=p;prev[p]=p;while(l<r){int x=q[l++];for(int d=0;d<4;d++){int y=x+D[d];if(y>=0&&y<100&&floorCell[y]&&!blocked[y]&&prev[y]<0){prev[y]=x;dir[y]=d;q[r++]=y;}}}}
uint64_t key(const Node&n,const array<int,100>&prev){int p=0;while(p<100&&prev[p]<0)p++;uint64_t k=p;for(int b:n.b)k=(k<<7)|b;return k;}
int heuristic(const array<int,4>&b){array<int,4>perm={0,1,2,3};int ans=INF;do{int h=0;for(int i=0;i<4;i++)h+=distGoal[perm[i]][b[i]];ans=min(ans,h);}while(next_permutation(perm.begin(),perm.end()));return ans;}
bool dead2(const array<int,4>&b,int pos){bool block[100]={};for(int x:b)block[x]=true;for(int off:{-11,-10,-1,0}){int top=pos+off;if(top<0||top+11>=100)continue;bool full=true,bad=false;for(int o:{0,1,10,11}){int x=top+o;if(floorCell[x]&&!block[x])full=false;if(block[x]&&!goal[x])bad=true;}if(full&&bad)return true;}return false;}
string solve(vector<string> rows,int cap,int&expanded,int&pushes){
 fill(floorCell,floorCell+100,false);fill(goal,goal+100,false);goals.clear();Node start;int bi=0;start.g=0;start.parent=-1;
 for(int y=0;y<10;y++)for(int x=0;x<10;x++){char c=rows[y][x];int p=y*10+x;floorCell[p]=c!='#';if(c=='@'||c=='+')start.p=p;if(c=='$'||c=='*')start.b[bi++]=p;if(c=='.'||c=='+'||c=='*'){goals.push_back(p);goal[p]=true;}}
 if(bi!=4||goals.size()!=4)return "";sort(start.b.begin(),start.b.end());
 for(int i=0;i<4;i++){fill(distGoal[i],distGoal[i]+100,INF);queue<int>q;q.push(goals[i]);distGoal[i][goals[i]]=0;while(!q.empty()){int p=q.front();q.pop();for(int d=0;d<4;d++){int from=p-D[d],stand=from-D[d];if(from>=0&&stand>=0&&from<100&&stand<100&&floorCell[from]&&floorCell[stand]&&distGoal[i][from]==INF){distGoal[i][from]=distGoal[i][p]+1;q.push(from);}}}}
 vector<Node>nodes;nodes.reserve(50000);nodes.push_back(start);priority_queue<Item>open;open.push({heuristic(start.b),0});unordered_map<uint64_t,int>best;array<int,100>prev,dirs;flood(start.p,start.b,prev,dirs);best[key(start,prev)]=0;expanded=0;
 while(!open.empty()&&expanded<cap){int ni=open.top().n;open.pop();Node n=nodes[ni];flood(n.p,n.b,prev,dirs);auto nk=key(n,prev);if(best[nk]!=n.g)continue;expanded++;
 if(heuristic(n.b)==0){pushes=n.g;vector<int>chain;while(nodes[ni].parent>=0){chain.push_back(ni);ni=nodes[ni].parent;}reverse(chain.begin(),chain.end());string result;Node cur=start;for(int id:chain){auto next=nodes[id];flood(cur.p,cur.b,prev,dirs);int stand=next.box-D[next.dir];string path;while(stand!=cur.p){path+=C[dirs[stand]];stand=prev[stand];}reverse(path.begin(),path.end());result+=path;result+=C[next.dir];cur=next;}return result;}
 for(int i=0;i<4;i++)for(int d=0;d<4;d++){int box=n.b[i],to=box+D[d],stand=box-D[d];if(to<0||to>=100||stand<0||stand>=100||!floorCell[to]||prev[stand]<0||binary_search(n.b.begin(),n.b.end(),to))continue;Node next=n;next.b[i]=to;sort(next.b.begin(),next.b.end());if(dead2(next.b,to))continue;int h=heuristic(next.b);if(h>=INF)continue;next.p=box;next.g=n.g+1;next.parent=ni;next.box=box;next.dir=d;array<int,100>p2,d2;flood(next.p,next.b,p2,d2);auto k=key(next,p2);auto it=best.find(k);if(it!=best.end()&&it->second<=next.g)continue;best[k]=next.g;int id=nodes.size();nodes.push_back(next);open.push({next.g+h,id});}
 }return "";
}
int main(int argc,char**argv){ifstream f(argv[1]);string line;vector<string>rows;int id=-1,count=0;while(getline(f,line)){if(line.size()&&line[0]==';'){id=stoi(line.substr(1));rows.clear();}else if(line.size()==10){rows.push_back(line);if(rows.size()==10){int expanded=0,pushes=0;string sol=solve(rows,argc>2?stoi(argv[2]):300000,expanded,pushes);if(!sol.empty()){cout<<id<<'\t'<<pushes<<'\t'<<expanded<<'\t'<<sol<<'\n';count++;}if(id%100==0)cerr<<id<<" processed, "<<count<<" solved\n";}}}cerr<<"DONE "<<count<<" solved\n";}
