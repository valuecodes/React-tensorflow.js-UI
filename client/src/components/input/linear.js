import React,{useState} from 'react'
import * as tf from '@tensorflow/tfjs';

export default function Linear({page}) {

    const [dot,setDot]=useState([]);
    const [x_values,setX_values]=useState([]);
    const [y_values,setY_values]=useState([]);
    const [animation,setAnimation]=useState(0);
    
    const [learningRate,setLearningRate]=useState(0.5);
    const [iterations,setIterations]=useState(500);

    const [m]=useState(tf.variable(tf.scalar(Math.random(1))))
    const [b]=useState(tf.variable(tf.scalar(Math.random(1))))

    const canvasRef = React.useRef(null)
 
    const addPosition=async(e)=>{

        const canvas=canvasRef.current
        const ctx=canvas.getContext('2d')

        let x=e.clientX - e.target.offsetLeft;
        let y=e.clientY - e.target.offsetTop;

        let data={
            x,
            y
        }

        setX_values([...x_values,x])
        setY_values([...y_values,y])
        setDot([...dot,data]) 

        let x_vals = [];
        let y_vals = [];

        let values=[...dot,data]
        
        for(var i=0;i<values.length;i++){
            x_vals.push(values[i].x/800)
            y_vals.push(values[i].y/800)      
        }
    
        const optimizer = tf.train.sgd(learningRate);
    
        function loss(pred, labels) {
          return pred
            .sub(labels)
            .square()
            .mean();
        }
        
        function predict(x) {   
          const xs = tf.tensor1d(x);
          const ys = xs.mul(m).add(b);
          return ys;
        }
    
        let line={}
        let count=0;

        function draw(){
            tf.tidy(() => {
                if (x_vals.length > 0) {
                const ys = tf.tensor1d(y_vals);
                optimizer.minimize(() =>
                    loss(predict(x_vals), ys));
                }
            });
            const lineX = [0, 1];
            const ys = tf.tidy(() => predict(lineX));
            let lineY = ys.dataSync();
            ys.dispose();
            line={
                x1:lineX[0]*800,
                x2:lineX[1]*800,
                y1:lineY[0]*800,
                y2:lineY[1]*800,      
            }
            count++;
            if(count<iterations){
                setAnimation(requestAnimationFrame(draw));
            }
            ctx.beginPath(0,0);
            ctx.clearRect(0, 0, 800, 800);
            ctx.stroke();
            ctx.moveTo(line.x1,line.y1);
    
            ctx.lineTo(line.x2,line.y2);
            ctx.stroke();    
            ctx.beginPath(0,0);
            ctx.rect(x, y-1, 2, 2);
            ctx.stroke();

            for(var i=0;i<dot.length;i++){
                ctx.beginPath(0,0);
                ctx.rect(dot[i].x, dot[i].y-1, 2, 2);
                ctx.stroke();
            }
            ctx.font = "30px Arial";
            ctx.fillText('Iterations', 10, 40); 
            ctx.fillText(count, 10, 70);           
        }
        draw();
        
    }       
    
    function changeIterations(e){
        setIterations(e.target.value*10)
    }

    function changeLearningRate(e){
        setLearningRate(e.target.value/100)
    }

    function clearPosition(){
        setDot([]);
        setX_values([]);
        setY_values([]);
        cancelAnimationFrame(animation);
        const canvas=canvasRef.current
        const ctx=canvas.getContext('2d')
        ctx.beginPath(0,0);
        ctx.clearRect(0, 0, 800, 800);
    }

    return (
        <div className='dataInput' style={{display:page==='linear'?'':'none'}}>
            <h1>Linear Regression</h1>
            <div className='inputOptions'>
                <div className='buttons'>
                    <p className='infoText'>Click on the canvas to add points</p>
                    <button onClick={(e) => clearPosition(e)}>Clear Point</button>

                </div>
                <div className='optionContainer'>
                    <h3 className='optionHeader'>Learning Rate</h3>
                    <input type='range' onChange={(e)=>changeLearningRate(e)}/>  
                    <h1>{learningRate}</h1>                     
                </div>
                <div className='optionContainer'>
                    <h3 className='optionHeader'>Iterations</h3>
                    <input type='range' defaultValue={50} onChange={(e)=>changeIterations(e)} />    
                    <h1>{iterations}</h1>                     
                </div>
            </div>

            
            <canvas
                ref={canvasRef}
                className='canvas'
                width={600}
                height={600}
                style={{fill:'black'}}
                onClick={(e) => addPosition(e)}
            />

        </div>
    )
}



