require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

// 获取图片相关的数据
let imageDatas = require("../data/imageData.json");

//利用自执行函数，将图片名信息转换成图片URL路径信息
imageDatas = (function getImageURL(imageDatasArr) {
	for (let i = 0, j = imageDatasArr.length; i < j; i++) {
		var singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require("../images/" + singleImageData.fileName);

		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

//整个页面看做一个组件

class GalleryByReactApp extends React.Component {
	render() {
		return (
			<section className="stage">
		<section className="img-sec">

				</section>
				<nav className="controller-nav">
				</nav>
			</section>
		);
	}
}


export default GalleryByReactApp;