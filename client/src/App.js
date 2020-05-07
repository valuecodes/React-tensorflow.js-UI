import React,{useState} from 'react';
import './App.css';
import NavBar from './components/Navigation/navbar'
import Linear from './components/input/linear'
import Polynominal from './components/input/polynominal'
import ThirdDegree from './components/input/thirdDegree'
import { Spring } from 'react-spring/renderprops';

function App() {
  
  const [page,setPage]=useState('linear');
  const [pageTransform,setPageTransform]=useState('linear');

  function changePage(page){
    setPageTransform(page);
    setPage(page)
  }

  return (
    <div className="App">
    <NavBar  changePage={changePage} changePageTransform={changePage}/>
    <div className='inputFrame'>
      <Spring
          from={{
              marginLeft:-800,
              opacity:0.0,
          }}

          to={{
            opacity:1,
            marginLeft:0,
          }}
          config={{mass:5, tension:500, friction:80}}
          key={page}
      >
          {props => (
            <div style={props} className='pages'>
              <Linear page={page}/>
              <Polynominal page={page}/>
              <ThirdDegree page={page}/>     
            </div>
          )}
      </Spring>
    </div>



    </div>
  );
}

export default App;
