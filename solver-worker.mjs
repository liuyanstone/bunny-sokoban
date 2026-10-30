import {solve} from './solver.mjs?v=2';
self.onmessage=({data})=>{try{self.postMessage({solution:solve(data.board,data.state)});}catch{self.postMessage({solution:null});}};
