import React, { Component } from 'react';
import './App.css';
import dataArr from './data.json';
import ReactDOM from 'react-dom';
// console.log(dataArr)

let Constant = {
    centerPos:{
      left: 0,
      top: 0
    },
    hPosRange: {
      leftSecX:[0,0],
      rightSecX:[0,0],
      y: [0,0],
    },
    vPosRange: {
      x: [0,0],
      topY: [0,0]
    }
}
function getRangeRandom(low,high){
  return Math.ceil(Math.random()*(high-low) + low)
}
function get30DegRandom(){
  return ((Math.random() > 0.5 ? "" : "-") + Math.ceil(Math.random() * 30))
}

class ControllerUnit extends Component {
  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e){
    if(this.props.arrange.isCenter){
      this.props.inverse()
    }else{
      this.props.center()
    }
    e.stopPropagation();
    e.preventDefault();
  }
  render(){
    let controllerUtitCN = 'controller-utit';
    if(this.props.arrange.isCenter){
      controllerUtitCN += ' is-center';
      if(this.props.arrange.isInverse){
        controllerUtitCN += ' is-inverse'
      }
    }

    return (
      <span className={controllerUtitCN} onClick={this.handleClick}></span>
    )
  }
}

class ImgFigure extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this)
  }
  render(){
    let styleObj = {
      'MozTransform':'',
      'msTransform':'',
      'WebkitTransform':'',
      'transform':'' 
    };
    if(this.props.arrange.pos){
      Object.assign(styleObj,this.props.arrange.pos);
    }
    if(this.props.arrange.rotate){
      // ['Moz','ms','Webkit'].forEach(function(value){
      //   styleObj[ value +'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      // }.bind(this));
      // styleObj['transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      styleObj['transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      styleObj['MozTransform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      styleObj['msTransform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      styleObj['WebkitTransform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
    }
    if(this.props.arrange.isCenter){
      styleObj['zIndex'] = 11;
    }
    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
    return (
        <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
          <div className="img">
            <img src={this.props.data.img} alt="img"/>
            <figcaption>
              <h2 className="img-title">{this.props.data.tit}</h2>
            </figcaption>
          </div>
          <div className="img-back" onClick={this.handleClick}>
              <p>
                hello
                {this.props.data.desc}
              </p>
            </div>
        </figure>
      )
  }
  handleClick(e){
    e.stopPropagation();
    e.preventDefault();
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else {
      this.props.center();
    }
    
    // console.log(11);
  }
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      imgsArrangeArr:[]
    }
  }
  render() {
    var controllerUtits = [];
    dataArr.map((item,index)=>{
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos:{left:0,top:0},
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }
      controllerUtits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>)
    })
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {
            dataArr.map((item,index)=>{
              return (<ImgFigure data={item} key={index} ref={'ImgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>)
            })
          }
        </section>
        <nav className="controller-nav">
          {controllerUtits}
        </nav>
      </section>
    );
  }
  componentDidMount(){
    let stageDom = this.refs.stage,
        stageW = stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = Math.ceil(stageW/2),
        halfStageH = Math.ceil(stageH/2);
    let ImgFigureDom = ReactDOM.findDOMNode(this.refs.ImgFigure0),
        ImgW = ImgFigureDom.scrollWidth,
        ImgH = ImgFigureDom.scrollHeight,
        halfImgW = Math.ceil(ImgW/2),
        halfImgH = Math.ceil(ImgH/2);

    Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }
    Constant.hPosRange.leftSecX[0] = -halfImgW;
    Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
    Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    Constant.hPosRange.y[0] = -halfImgH;
    Constant.hPosRange.y[1] = stageH - halfImgH;
    Constant.vPosRange.topY[0] = -halfImgH;
    Constant.vPosRange.topY[1] = halfStageH - halfImgH*3;
    Constant.vPosRange.x[0] = halfStageW - ImgW;
    Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0)
  }
  rearrange(centerIndex){
    let imgsArrangeArr = this.state.imgsArrangeArr,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random()*2),
      topImgSpliceIndex = 0,
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

    imgsArrangeCenterArr[0] = {
      pos:centerPos,
      rotate:0,
      isCenter:true
    }

    topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
    // debugger;
    imgsArrangeTopArr.forEach((value,index)=>{
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0],vPosRangeX[1]),
        },
        rotate: get30DegRandom(),
        isCenter:false
      }
    })

    for(var i = 0, j = imgsArrangeArr.length,k = j/2; i<j; i++){
      var hPosRangeLORX = null;
      if(i<k){
        hPosRangeLORX = hPosRangeLeftSecX;
      }else{
        hPosRangeLORX = hPosRangeRightSecX;
      }
      imgsArrangeArr[i] = {
        pos:{
          top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter:false
      }
    }

    if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr:imgsArrangeArr
    })
  }
  inverse(index){
    return function(){
      // console.log(this);
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }.bind(this);
  }
  center(index){
    return function(){
      this.rearrange(index);
    }.bind(this)
  }
}


export default App;
