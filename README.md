# zoom-helper
<span>在web端产品中，如果你希望展现一些类似拓扑图的元素，可能会希望能够缩放，基于这个需求，便有个zoomer-helper。</span><br>
<span>目前她的功能还很简陋，只支持鼠标滚轮缩放和拖动。例子中的工具条是外置的，考虑到这类工具条应该是定制化的，所以并没有整合到zoomer-helper中。</span><br>
<span>最后，希望这个小控件能够帮助到你~ </span>

<h1>用法</h1>
为了避免画面中元素的突然位移和缩放，建议给目标元素添加class:zoom-helper-hidden , 该样式内置在 zoom-helper.css 中。
```html
<head>
...
<link rel="stylesheet" type="text/css" href="your-project/modules/zoom-helper/zoom-helper.css">
...
</head>
<body>
...
<div class="zoom-container">
	<div id="zoomer" class="zoom-helper-hidden"></div>
</div>
...
<script type="text/javascript" src="your-project/modules/jquery/jquery.js"></script>
<script type="text/javascript" src="your-project/modules/jquery/jquery-ui.customer.min.js"></script>
<script type="text/javascript" src="your-project/modules/zoom-helper/addWheelListener.js"></script>
<script type="text/javascript" src="your-project/modules/zoom-helper/zoom-helper.js"></script>
</body>
```
```js
var myZoomer = new zoomHelper({
	container: '.zoom-container',
	zoomer: '#zoomer',
	afterZoom: function(data){
	    //do something you need;
	},
	zoomMax: 2,
	zoomMin: 0.1,
	zoomStep: 0.2
});	
```
<h1>需要注意的一些问题</h1>
- 当容器的大小和位置变化后，你可能需要调用 `setInitData()` 方法来告诉 zoom-helper 重新计算她缓存的一些数据（宽度，位置之类的数据）。
zoom-helper 在进行缩放时，尽量只动态获取那些必须的位置和宽高数据，而在初始化时保存那些基本保持不变的数据，所以如果你的容器发生了改变就需要告诉 zoom-helper 重新计算。
- 当被缩放的元素大小也发生变化（不是指zoom，而是原始大小）时，需要调用 `resetZoomer()` 方法来重置。
- 如果以上变化都是使用CSS动画进行的，你需要等变化结束后再执行上述方法。我的处理方式时 `setTimeout()` 或者 绑定动画结束的callback事件,例如:<br>
```js
	// .will-change-selector 是导致你容器变化的那个带有过度或者动画的元素，并不一定是容器本身，原理大家都清楚.
	$('.will-change-selector').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend webkitTransitionEnd oTransitionEnd otransitionend webkitTransitionEnd transitionend', function(){
		yourZoomer.setInitData();
	});
```

<h2>其他</h2>
<span>有时间了会加入 minMap 功能。</span>
