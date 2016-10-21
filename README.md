ES6 + React 的组件demo，思路方案均来自immoc的React教学视频 http://www.imooc.com/learn/652。
视频质量很高，遗憾的是用ES5 + webpack 项目管理，放在现在grunt.js没了、webpack.config.js都完全不一样了。不过反而更简单了，甚至不用重写配置文件

打包后网址：https://ao-si-luo-ma-li.github.io/gallery-by-react/

ps:图片用的是其中某位学员的

用git bash 命令行工具,先git clone https://github.com/ao-si-luo-ma-li/gallery-by-react.git
如果本地安装了与github有关的ssh，可以使用git@github.com:ao-si-luo-ma-li/gallery-by-react.git。然后要装一下依赖，npm install。这里推荐使用cnpm install，cnpm是淘宝用来替代npm的，主要安装依赖更快速。其他命令建议还是使用npm

修改cfg文件件下的default.js下的 publicPath: 'assets/',  改为 publicPath: '/assets/'，可以在本地正常打开。打包上传至github，生成静态页面的时候再改回去，不然线上的又打不开了。主要是绝对路径和 相对路径的问题，文件会发生找不到的情况。

npm start启动
 
