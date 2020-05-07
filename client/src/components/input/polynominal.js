import React,{useState} from 'react'
import * as tf from '@tensorflow/tfjs';

export default function Polynominial({page}) {

    const [dot,setDot]=useState([]);
    const [x_values,setX_values]=useState([]);
    const [y_values,setY_values]=useState([]);
    const [animation,setAnimation]=useState(0);

    const [learningRate,setLearningRate]=useState(0.25);
    const [selectedOptimizer,setOptimizer]=useState('adamax')
    const optimizers=['sgd','momentun','agagrad','adadelta','adam','adamax','rmsprops']

    const [a]=useState(tf.variable(tf.scalar(Math.random(1))))
    const [b]=useState(tf.variable(tf.scalar(Math.random(1))))
    const [c]=useState(tf.variable(tf.scalar(Math.random(1))))

    const canvasRef = React.useRef(null)
 
    const addPosition=async(e,reset)=>{

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
            x_vals.push(values[i].x/600)
            y_vals.push(values[i].y/600)      
        }

        let optimizer;
        switch(selectedOptimizer){
            case 'adamax':
                optimizer=tf.train.adamax(learningRate);
                break;
            case 'sgd':
                optimizer=tf.train.sgd(learningRate);
                break;
            case 'momentum':
                optimizer=tf.train.momentum(learningRate);
                break;
            case 'agarad':
                optimizer=tf.train.adagrad(learningRate);
                break;
            case 'adadelta':
                optimizer=tf.train.adadelta(learningRate);
                break;
            case 'adam':
                optimizer=tf.train.adam(learningRate);
                break;
            case 'rmsprops':
                optimizer=tf.train.rmsprop(learningRate);
                break;
            default:
                optimizer=tf.train.adamax(learningRate);
                break;
        }
        
        function loss(pred, labels) {
        return pred
            .sub(labels)
            .square()
            .mean();
        }
        
        function predict(x) {   
        const xs = tf.tensor1d(x);
        const ys = xs.square().mul(a)
            .add(xs.mul(b)).add(c);
            return ys;
        }

        let count=0;
        let be = Date.now(),fps=0;

        function draw(){

            ctx.beginPath(0,0);
            ctx.clearRect(0, 0, 800, 800);

            let now = Date.now()
            fps = Math.round(1000 / (now - be))
            be = now 
            if(fps<2){
                fps=2;
            }
        
            ctx.font = "20px Arial";
            ctx.fillText(`Framerate: ${fps}fps`, 150, 30);  

            tf.tidy(() => {
                if (x_vals.length > 0) {
                const ys = tf.tensor1d(y_vals);
                optimizer.minimize(() =>
                    loss(predict(x_vals), ys));
                }
            });
            
            const curveX = [];
            for(let x=0;x<1;x+=0.01){
                curveX.push(x);
            }
            const ys = tf.tidy(() => predict(curveX));
            let curveY = ys.dataSync();

            ys.dispose();
            count++;

            setAnimation(requestAnimationFrame(draw));

            ctx.rect(x, y-1, 2, 2);
            for(var i=0;i<dot.length;i++){
                ctx.rect(dot[i].x, dot[i].y-1, 2, 2);
            }

            for(var q=0;q<curveX.length;q++){
                ctx.rect(curveX[q]*600, curveY[q]*600, 2, 2);
            }

            ctx.font = "20px Arial";
            ctx.fillText(`Iterations: ${count}`, 10, 30);  
            ctx.stroke();
        }
        draw();
        
    }       

    function changeLearningRate(e){
        setLearningRate(e.target.value/200)
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

    const selectOptimizer=(optim)=>{
        setOptimizer(optim)
    }

    return (
        <div className='dataInput' style={{display:page==='polynominial'?'':'none'}}>
            <h1>Polynominial Regression</h1>
            <div className='inputOptions'>
                <div className='buttons'>
                    <p className='infoText'>Click on the canvas to add points</p>
                    <button onClick={(e) => clearPosition()}>Delete point</button>
                </div>
                <div className='optionContainer'>
                    <h3 className='optionHeader'>Learning Rate</h3>
                    <input type='range' defaultValue={50} onChange={(e)=>changeLearningRate(e)}/>
                    <h1>{learningRate}</h1>                     
                </div>
                <div className='optionContainer'>
                    <h3 className='optionHeader'>Optimizer</h3>
                    <div className='optimizers'>
                        {optimizers.map(optim=>
                            <p 
                                key={optim}
                                style={{backgroundColor:selectedOptimizer===optim?'rgb(133, 169, 185)':'lightgray'}} 
                                onClick={()=>selectOptimizer(optim)}>{optim}</p>
                        )}
                    </div>

                    {/* <div className='activePositions'>
                        {dot.map(elem=>
                            <div className='aPosBlock'>
                                <p>X: {elem.x} </p>
                                <p>Y: {elem.y}</p>
                            </div>
                        )}    
                    </div> */}
                </div>
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



