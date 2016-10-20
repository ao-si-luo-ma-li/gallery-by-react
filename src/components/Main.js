require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// 获取图片相关的数据
//新版本在读取json时要加上 json! ，否则读取不到数据，会产生没有forEach方法、没有图片等错误
let imageDatas = require('json!../data/imageData.json');

//利用自执行函数，将图片名信息转换成图片URL路径信息
imageDatas = (function getImageURL(imageDatasArr) {
	for (let i = 0, j = imageDatasArr.length; i < j; i++) {
		var singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);

		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);


function getRangeRandom(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

function get30DegRandom(deg) {
	return (Math.random() > 0.5 ? '' : '-') + Math.floor(Math.random() * deg);
}

//单个图片的组件
//props是为react组件添加的所有属性的集合
class ImgFigure extends React.Component {

	// 图片的组件被点击后的处理函数
	handleClick(e) {
		// 阻止冒泡，阻止默认事件
		e.stopPropagation();
		e.preventDefault();

		//点击时，如果没居中，则让其居中。否则就让其翻转
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}

	}

	render() {

		let styleObj = {};

		//如果props属性中设置了这张图片的位置，则使用
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}

		if (this.props.arrange.isCenter) {
			styleObj['zIndex'] = 11;
		}

		//如果图片旋转角度有值，且不为0
		if (this.props.arrange.rotate) {

			let arr = ['MozTransform', 'msTransform ', 'OTransform', 'WebkitTransform', 'transform'];
			arr.forEach(function(value) {
				styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));
		}

		// 根据提供的 props.arrange.isInverse，判断图片是否要加翻转的ClassName
		let imgFigureClassName = 'img-figure';
		imgFigureClassName += this.props.arrange.isInverse ? ' inverse' : '';

		//在es6中需要改变上下文环境 this.handleClick.bind(this)，否则会绑定到触发事件的div元素上
		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick.bind(this)}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		);
	}
}

//单个控制按钮组件
class Controller extends React.Component {

}


//整个页面看做一个组件，大管家

class GalleryByReactApp extends React.Component {

	// 指定初始化 state，当页面第一次加载时，一定执行该函数
	//es6 写法如下
	constructor(props) {
		super(props);
		this.state = {
			//进行state更改后，会导致 render() 重绘
			imgsArrangeArr: [
				//数组包含多个图片对象
				/*位置，状态等信息*/
				/*{
					pos: {
						left: '0',
						top: '0'
					},
					rotate:0,
					isInverse:false,
					isCenter: false
				}
				*/
			]
		}
	}

	/*翻转图片
	  输入当前翻转操作inverse的图片载对应数组中的index值
	*/
	inverse(index) {
		return function() {
			let imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

			//调用 setState ,页面重绘
			this.setState({
				imgsArrangeArr
			})
		}.bind(this);
	}

	//es6规定不能再组件定义的时候定义一个属性


	/*	rearrange 函数
		1、重新布局所有图片,为图片确定位置状态
		2、centerIndex 指定居中排布哪个图片

	*/
	rearrange(centerIndex) {
		let imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.props.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			//获取所有的取值范围
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeX = vPosRange.x,
			vPosRangeTopY = vPosRange.topY,

			imgsArrangeTopArr = [],
			//取一个或不取
			topImgNum = Math.floor(Math.random() * 2),
			//标记放在顶部区域的图片是从数组的哪个位置取出来的
			topImgSpliceIndex = 0,

			// 1、将中心点的图片组件从数组中删除,返回被删除的数组
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

		//布局中心的图片设置状态
		//居中图片不需要旋转
		imgsArrangeCenterArr[0] = {
			pos: centerPos,
			rotate: 0,
			isCenter: true
		}


		// 2、取出布局在舞台上侧的图片数组的序号，一个或零个。从数组中删除,返回被删除的数组
		topImgSpliceIndex = Math.floor(Math.random() * imgsArrangeArr.length);
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

		//布局上侧的图片
		imgsArrangeTopArr.forEach(function(value, index) {
			imgsArrangeTopArr[index] = {
				pos: {
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1])
				},
				rotate: get30DegRandom(30),
				isCenter: false
			}

		})

		//此时数组中的中心图片和上侧图片已经从imgsArrangeArr中剔除
		//布局俩侧的图片
		for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {

			//获取当前图片布局左边或右边的取值范围
			let hPosRangeNowX = [];
			if (i < k) {

				hPosRangeNowX = hPosRangeLeftSecX;
			} else {
				hPosRangeNowX = hPosRangeRightSecX;
			}

			imgsArrangeArr[i] = {
				pos: {
					left: getRangeRandom(hPosRangeNowX[0], hPosRangeNowX[1]),
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1])
				},
				rotate: get30DegRandom(30),
				isCenter: false
			}
		}

		//将剔除的图片重新放回去
		if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
		}
		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

		//设置state,触发组件component的重新渲染 render().给它传递了一个对象
		this.setState({
			imgsArrangeArr: imgsArrangeArr
		})
	}

	/*
		利用rearrange函数，居中对应的index 图片,重新布局
	*/
	center(index) {
		return function() {
			this.rearrange(index);
		}.bind(this);
	}

	//组件加载以后（插入文档），为每张图片计算其位置的范围
	// 同时初始化水平，垂直方向的取值范围
	componentDidMount() {

		//首先取到舞台的大小
		//在es6中,通过 ReactReactDOM.findDOMNode ,根据组件的 refs 进行索引
		let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = stageW / 2,
			halfStageH = stageH / 2;

		//拿到一个 imageFigure 组件的大小

		let imageFigureDOM = ReactDOM.findDOMNode(this.refs.imageFigures0),
			imgW = imageFigureDOM.scrollWidth,
			imgH = imageFigureDOM.scrollHeight,
			halfImageW = imgW / 2,
			halfImageH = imgH / 2;


		//计算中心图片的位置点
		this.props.Constant.centerPos = {
			left: halfStageW - halfImageW,
			top: halfStageH - halfImageH

		};

		//舞台左右俩侧的图片的水平、垂直取值范围

		this.props.Constant.hPosRange.leftSecX[0] = -halfImageW;
		this.props.Constant.hPosRange.leftSecX[1] = halfStageW - halfImageW * 3;
		this.props.Constant.hPosRange.rightSecX[0] = halfStageW + halfImageW;

		this.props.Constant.hPosRange.rightSecX[1] = stageW - halfImageW;
		this.props.Constant.hPosRange.y[0] = -halfImageH;

		this.props.Constant.hPosRange.y[1] = stageH - halfImageH;

		//舞台上侧的图片的取值范围
		this.props.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.props.Constant.vPosRange.x[1] = halfStageW;
		this.props.Constant.vPosRange.topY[0] = -halfImageH;
		this.props.Constant.vPosRange.topY[1] = halfStageH - halfImageH * 3;

		//调用 rearrange 函数，改变 state 状态,引发页面重绘
		this.rearrange(0);
	}

	render() {

		//控制组件集合，图片组件集合
		let controllerUnits = [],
			imgFigure = [];

		//value 表示数组的值，index表示索引
		imageDatas.forEach(function(value, index) {

			//初始化图片组件的状态对象
			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				}
			}

			//使用imgFigure组件填充数组，下面 {...} 是js表达式，一并插入  
			imgFigure.push(<ImgFigure data={value} key={'imageFigures'+index}
			 ref={'imageFigures'+index} arrange={this.state.imgsArrangeArr[index]}
			  inverse={this.inverse(index)} center={this.center(index)}/>)
		}.bind(this))


		return (
			<section className="stage" ref="stage">
				<section className="img-sec">
					{imgFigure}
				</section>
				<nav className="controller-nav">
					{controllerUnits}
				</nav>
			</section>
		);
	}
}

//es6 这两个属性不能写在class内。
GalleryByReactApp.propTypes = { //属性校验器，表示改属性必须是object，否则报错
	Constant: React.PropTypes.object
}

GalleryByReactApp.defaultProps = {
	//存储取值范围,通过 this.props.Constant 取值
	Constant: {
		centerPos: {
			left: 0,
			right: 0
		},
		hPosRange: { //水平方向的取值范围
			leftSecX: [0, 0],
			rightSecX: [0, 0],
			y: [0, 0]
		},
		vPosRange: { //垂直方向上的取值范围（仅限舞台的上半部分）
			x: [0, 0],
			topY: [0, 0]
		}
	}
}

export default GalleryByReactApp;