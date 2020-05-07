// import React,{useState} from 'react'
// import axios from 'axios'

// export default function DataInput() {

//     const [dot,setDot]=useState([]);
//     const [line,setLine]=useState({x1: 0, x2: 0, y1: 0, y2: 0});
//     const [loading,setLoading]=useState()
    
//     const canvasRef = React.useRef(null)

//     const addPosition=async(e)=>{

//         const canvas=canvasRef.current
//         const ctx=canvas.getContext('2d')

//         let x=e.clientX - e.target.offsetLeft;
//         let y=e.clientY - e.target.offsetTop;

//         const config={
//             headers:{
//                 'Content-Type': 'application/json'
//             }
//         }

//         let data={
//             x,
//             y
//         }

//         ctx.beginPath();
//         ctx.rect(x, y-1, 2, 2);
//         ctx.lineWidth = 2; 
//         // ctx.stroke();

//         for(var i=0;i<dot.length;i++){
//             ctx.beginPath();
//             ctx.rect(dot[i].x, dot[i].y-1, 2, 2);
//             ctx.stroke();
//         }
        
//         let res =await axios.post('/',[...dot,data],config)

//         let lineData=res.data.data

//         let count=0;
//         function draw() {
//             if(count<80){
//                 requestAnimationFrame(draw);   
//             }
//             ctx.beginPath(0,0);
//             ctx.clearRect(0, 0, 800, 800);
//             ctx.moveTo(lineData.x1,line.y1+((lineData.y1-line.y1)/80)*count);
//             ctx.lineTo(lineData.x2,line.y2+((lineData.y2-line.y2)/80)*count);
//             ctx.moveTo(0,0)
//             ctx.lineWidth = 2; 
//             ctx.stroke();
//             count++;    
            
//             ctx.beginPath(0,0);
//             ctx.rect(x, y-1, 2, 2);
//             ctx.stroke();
            
//             for(var i=0;i<dot.length;i++){
//                 ctx.beginPath(0,0);
//                 ctx.rect(dot[i].x, dot[i].y-1, 2, 2);
//                 ctx.stroke();
//             }
            
//         }
//         draw();
//         setDot([...dot,data])  
//         setLine(lineData)      
//     }   

//     function resetData(){
//         console.log('tea')
//     }

//     return (
//         <div className='dataInput'>
//             <h1 onClick={resetData()}>Data input</h1>
//             <button>Reset</button>
//             <canvas
//                 ref={canvasRef}
//                 className='canvas'
//                 width={600}
//                 height={600}
//                 style={{fill:'black'}}
//                 onClick={(e) => addPosition(e)}
//             />
//         </div>
//     )
// }
