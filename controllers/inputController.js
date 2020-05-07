const tf = require('@tensorflow/tfjs')

exports.getInputs=(req,res,next)=>{

    let values=req.body;

    let x_values=[];
    let y_values=[];

    let x_vals = [];
    let y_vals = [];

    for(var i=0;i<values.length;i++){
        x_vals.push(values[i].x/800)
        y_vals.push(values[i].y/800)      
    }
    
    let m, b;
    
    const learningRate = 0.2;
    const optimizer = tf.train.sgd(learningRate);
    
    function setup() {
      m = tf.variable(tf.scalar(Math.random(1)));
      b = tf.variable(tf.scalar(Math.random(1)));
    }
    
    setup()

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
    
    for(var i=0;i<1500;i++) {
        tf.tidy(() => {
            if (x_vals.length > 0) {
            const ys = tf.tensor1d(y_vals);
            optimizer.minimize(() => loss(predict(x_vals), ys));
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
    }
    res.send({data:line})
}


exports.getPolyInputs=(req,res,next)=>{

    const values=req.body.data;
    const learningRate = req.body.learningRate;
    const iterations=req.body.iterations

    let x_values=[];
    let y_values=[];

    let x_vals = [];
    let y_vals = [];

    for(var i=0;i<values.length;i++){
        x_vals.push(values[i].x/800)
        y_vals.push(values[i].y/800)      
    }

    const optimizer = tf.train.adamax(learningRate);
    
    function setup() {
      a = tf.variable(tf.scalar(Math.random(1)));
      b = tf.variable(tf.scalar(Math.random(1)));
      c = tf.variable(tf.scalar(Math.random(1)));
      d = tf.variable(tf.scalar(Math.random(1)));
    }
    
    setup()

    function loss(pred, labels) {
      return pred
        .sub(labels)
        .square()
        .mean();
    }
    
    function predict(x) {   
    const xs = tf.tensor1d(x);
    const ys = xs
        .pow(tf.scalar(3))
        .mul(a)
        .add(xs.square().mul(b))
        .add(xs.mul(c))
        .add(d);
        return ys;
    }

    let line={}
    let result=[];
    for(var i=0;i<iterations;i++) {
        tf.tidy(() => {
            if (x_vals.length > 0) {
            const ys = tf.tensor1d(y_vals);
            optimizer.minimize(() => loss(predict(x_vals), ys));
            }
        });
        
        const curveX = [];
        for (let x = 0; x <= 1; x += 0.01) {
          curveX.push(x);
        }
        
        const ys = tf.tidy(() => predict(curveX));
        let curveY = ys.dataSync();
        ys.dispose();

        
        result=[];
        for (let i = 0; i < curveX.length; i++) {
            result.push({
                x:curveX[i]*800,
                y:curveY[i]*800
            })
          }

        // line={
        //     x1:lineX[0]*800,
        //     x2:lineX[1]*800,
        //     y1:lineY[0]*800,
        //     y2:lineY[1]*800,      
        // }
    }
    res.send({data:result})
}