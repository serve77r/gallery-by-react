import React, { Component } from 'react';
import './App.css';
import dataArr from './data.json';
// console.log(dataArr)

class ImgFigure extends Component {
  render(){
    return (
        <figure className="img-figure">
          <img src={this.props.data.img} />
          <figcaption>
            <h2 className="img-title">{this.props.data.tit}</h2>
          </figcaption>
        </figure>
      )
  }
}

class App extends Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">
          {
            dataArr.map((item,index)=>{
              return (<ImgFigure data={item} key={index} />)
            })
          }
        </section>
        <nav className="controller-nav">
        </nav>
      </section>
    );
  }
}

export default App;
