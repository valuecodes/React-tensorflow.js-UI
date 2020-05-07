import React from 'react'

export default function navbar(props) {
    return (
        <div className='navBar'>
            <button onClick={props.changePage.bind(this,'linear')} className='navbarButton'>Linear</button>
            <button onClick={props.changePage.bind(this,'polynominial')} className='navbarButton'>Polynominial</button>
            <button onClick={props.changePage.bind(this,'3degree')} className='navbarButton'>Third degree</button>
        </div>
    )
}
