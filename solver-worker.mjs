import {solve} from './solver.mjs';
self.onmessage=({data})=>{try{self.postMessage({solution:solve(data.board,data.state)});}catch{self.postMessage({solution:null});}};
