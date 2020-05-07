import React,{useState} from 'react'
import axios from 'axios'

export default function ThirdDegree({page}) {

    const [dot,setDot]=useState([]);
    const [x_values,setX_values]=useState([]);
    const [y_values,setY_values]=useState([]);
    
    const [learningRate,setLearningRate]=useState(0.2);
    const [iterations,setIterations]=useState(5000);
    const [currentRounds,setCurrentRounds]=useState([]);
    const [activeRound,setActiveRound]=useState();

    const canvasRef = React.useRef(null)
 
    const addPosition=async(e,start)=>{
        const canvas=canvasRef.current
        const ctx=canvas.getContext('2d')
        let x=e.clientX - e.target.offsetLeft;
        let y=e.clientY - e.target.offsetTop;

        if(!start){
            let data={
                x,
                y
            }
            setX_values([...x_values,x])
            setY_values([...y_values,y])
            setDot([...dot,data]) 
            ctx.beginPath();
            ctx.rect(x, y-3, 6, 6);
            ctx.lineWidth = 2; 
            ctx.strokeStyle = "black";
            ctx.stroke();
            for(var i=0;i<dot.length;i++){
                ctx.beginPath();
                ctx.rect(dot[i].x, dot[i].y-3, 6,6);
                ctx.stroke();
            }               
        }
        if(start){
            startProcessing(dot);
        }
    }       

    function changeLearningRate(e){
        setLearningRate(e.target.value/250)
    }

    function changeIterations(e){
        setIterations(e.target.value*100)
    }

    function clear(){
        
        const canvas=canvasRef.current
        const ctx=canvas.getContext('2d')
        setX_values([])
        setY_values([])
        setDot([]) 
        setActiveRound();
        setCurrentRounds([]);
        ctx.beginPath(0,0);
        ctx.clearRect(0, 0, 800, 800);
    }

    function runTest(){
        const canvas=canvasRef.current
        const ctx=canvas.getContext('2d')
        console.log('run test')
        console.log(dot)
        let testData=[
            {x: 4, y: 569},
            {x: 32, y: 517},
            {x: 68, y: 452},
            {x: 107, y: 406},
            {x: 168, y: 368},
            {x: 233, y: 356},
            {x: 304, y: 373},
            {x: 372, y: 375},
            {x: 414, y: 361},
            {x: 469, y: 327},
            {x: 514, y: 275},
            {x: 544, y: 217},
            {x: 575, y: 146},
            {x: 590, y: 95}
        ]
        let count=0;
        let currentInterval=setInterval(()=>{
            if(count===13){
                clearInterval(currentInterval)
                startProcessing(testData)
            }
            ctx.beginPath();
            ctx.rect(testData[count].x, testData[count].y-3, 6, 6);
            ctx.strokeStyle = "black";
            ctx.stroke();
            count++
        },50)
    }

    async function startProcessing(data){

        const canvas=canvasRef.current
        const ctx=canvas.getContext('2d')

        let rounds=[
            {round:1,iterations:10,timeOut:500,color:'rgb(157, 172, 179)'},
            {round:2,iterations:100,timeOut:1500,color:'rgb(72, 73, 74)'},
            {round:3,iterations:2500,timeOut:0,color:'blue'},
            {round:4,iterations:iterations,timeOut:0,color:'red'},
        ]

        let results=[];

        let currentRounds=[];

        for(var i=0;i<4;i++){
            const config={
                headers:{
                    'Content-Type': 'application/json'
                }
            }
            let tdata={
                data:data,
                learningRate:learningRate,
                iterations:rounds[i].iterations
            }
            let res =await axios.post('/poly',tdata,config)
            let lineData=res.data.data
            results.push(lineData);
            setTimeout((round)=>{
                console.log(round)
                createLine(res.data.data,rounds[round].color)
                // setCurrentRounds([rounds[round]]);
                setActiveRound(round)
            },rounds[i].timeOut,i)

            setCurrentRounds(rounds);
        }
        
        function createLine(lineData,color){
            let count=0
            function draw(){
                if(count<99) requestAnimationFrame(draw)
                ctx.beginPath(0,0);
                ctx.beginPath();
                ctx.rect(lineData[count].x, lineData[count].y-1, 2, 2);
                ctx.strokeStyle =color;
                ctx.stroke();    
                count++;
            }   
            draw();            
        }
    }
    return (
        
        <div className='dataInput' style={{display:page==='3degree'?'':'none'}}>
            <h1>Third Degree Polynomial</h1>
            <div className='inputOptions'>
                <div className='buttons'>
                    <button onClick={(e) => runTest()}>Run test</button>
                    <button onClick={(e) => addPosition(e,true)}>Start</button>
                    <button onClick={(e) => clear()}>Clear</button>
                </div>
                <div className='optionContainer'>
                    <h3 className='optionHeader'>Learning Rate</h3>
                    <input type='range' onChange={(e)=>changeLearningRate(e)}/>
                    <h1>{learningRate}</h1>                     
                </div>
                <div className='optionContainer'>
                    <h3 className='optionHeader'>Iterations</h3>
                    <input type='range' onChange={(e)=>changeIterations(e)} /> 
                    <h1>{iterations}</h1>                     
                </div>
            </div>
            <div className='rounds'>
                {currentRounds.map((round,index)=>
                    <div 
                    style={{
                        borderColor:round.color,
                        opacity:activeRound===index?1:0.4,
                        backgroundColor:'white'
                    }}
                    className='round'>
                       <p>{`Round:\t ${round.round}`}</p>
                       <p>{`Iterations: ${round.iterations}`}</p>
                    </div>
                )}
            </div>
            <canvas
                ref={canvasRef}
                className='canvas'
                width={600}
                height={600}
                style={{
                    fill:'black',
                }}
                onClick={(e) => addPosition(e,false)}
            />

        </div>
    )
}



