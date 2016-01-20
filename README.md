# zoom-helper

<h1>用法</h1>
<pre>
<code>
	var myZoomer = new zoomHelper({
		container: '.zoom-container-selector',
		zoomer: '#zoomer_selector',
		afterZoom: function(data){
		    //do something you need;
		},
		zoomMax: 2,
		zoomMin: 0.1,
		zoomStep: 0.2
	});
</code>
</pre>
<h1>需要注意的一些问题</h1>
<span>当容器的大小和位置变化后，你可能需要调用 setInitData 方法来告诉zoomer重新计算她缓存的一些数据（宽度，位置之类的数据）。</span><br>
<span>zoomer在进行缩放时，尽量只动态获取那些必须的位置和宽高数据，而在初始化时保存那些基本保持不变的数据，所以如果你的容器发生了改变就需要告诉zoomer重新计算</span>
