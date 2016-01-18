/*
 *
 * Copyright (c) 2015 EBo (https://github.com/E-Bo)
 *
 * Version 0.1
 *
 * Work with jQuery, mouseWheel zoom require addWheelListener.js and draggable require jQuery UI
 *
 */

var checker = {
    isDOM: function(dom){
        if(typeof HTMLElement === 'object' || typeof HTMLElement === 'function'){
            return dom instanceof HTMLElement;
        }else{
            return dom && typeof(dom) === 'object' && dom.nodeType === 1 && typeof(dom.nodeName) === 'string';
        }
    },
    isBool: function(bool){
        return typeof(bool) === 'boolean';
    },
    isString: function(string){
        return typeof(string) === 'string';
    },
    isObject: function(obj){
        return typeof(obj) === 'object';
    },
    isArray: function(arr){
        return arr instanceof Array;
    },
    isFunction: function(fun){
        return typeof(fun) === 'function';
    },
    isNumber: function(number){
        return typeof(number) === 'number';
    }
};

var setter = {
    setDom: function(needDom){
        if(checker.isObject(needDom) && checker.isDOM(needDom[0])){
            return needDom[0];
        }else if(checker.isString(needDom)){
            if(checker.isDOM($(needDom)[0])){
                return $(needDom)[0];
            }else{
                return null;
            }
        }else if(checker.isDOM(needDom)) {
            return needDom;
        }else{
            return null;
        }
    },
    setBool: function(needBool){
        if(checker.isBool(needBool)){
            return needBool;
        }else{
            return null;
        }
    },
    setString: function(needString){
        if(checker.isString(needString)){
            return needString;
        }else{
            return null;
        }
    },
    setObj: function(needObj){
        if(checker.isObject(needObj)){
            return needObj;
        }else{
            return null;
        }
    },
    setFunction: function(needFun){
        if(checker.isFunction(needFun)){
            return needFun;
        }else {
            return null;
        }
    },
    setNumber: function(needNum){
        if(checker.isNumber(needNum)){
            return needNum;
        }else {
            return null;
        }
    }
}

var zoomHelper = function(options){
    options = options || {};
    this.defOptions = {
        container : null,
        zoomer: null,
        useDrag: true,
        zoomStep: 0.1,
        zoomMax: 2,
        zoomMin: 0.1
    };
    this.options = $.extend({},this.defOptions);

    this.setOptions(options);

    window.UserAgent = window.UserAgent || this.getUserAgent();

    if(!this.options.container || !this.options.zoomer){
        this.consoleInfo('容器或zoom对象配置有误。');
        return;
    };

    this.initZoomer();
}

zoomHelper.prototype = {
    optionsCheck:{
        container: setter.setDom,
        zoomer: setter.setDom,
        useDrag: setter.setBool,
        afterZoom: setter.setFunction,
        zoomStep: setter.setNumber,
        zoomMax: setter.setNumber,
        zoomMin: setter.setNumber
    },
    clients: {
        'default' : {
            prefix: ''
        },
        'firefox' : {
            prefix: '-moz-'
        },
        'webkit' : {
            prefix: '-webkit-'
        },
        'msie' : {
            prefix: '-ms-'
        }
    },
    setOptions: function(options){
        for(var key in this.optionsCheck){
            this.options[key] = this.optionsCheck[key](options[key]) === null ? this.options[key] : this.optionsCheck[key](options[key]);
        }
        this.logicalCheck();
    },
    logicalCheck: function(){
        if(this.options.zoomMax < this.options.zoomMin){
            this.options.zoomMax = this.defOptions.zoomMax;
            this.options.zoomMin = this.defOptions.zoomMin;
            this.consoleInfo('zoom边界值设置有误，已还原为默认值。');
        }
    },
    initZoomer: function(){
        this.container = $(this.options.container);
        this.element = $(this.options.zoomer);
        this.setInitData();
        this.element.wrap('<div class="zoomer-inner"></div>');
        this.zoomerInner = this.element.parent('.zoomer-inner');       // for zoom
        this.zoomerInner.wrap('<div class="zoomer-outer" style="width: '+ this.elementStyles.outerWidth +'px; height: '+ this.elementStyles.outerHeight +'px"></div>');
        this.zoomerOuter = this.zoomerInner.parent('.zoomer-outer');   // for position
        if(this.options.useDrag){
            this.initDraggable();
        }
        addWheelListener(this.options.container, $.proxy(this.wheelZoom,this), false);

        this.dPosition = {
            left : 0,
            top : 0
        };
        this.scale = 1;
        this.zoom(this.centerPosition,this.initScale);
        this.element.removeClass('zoom-helper-hidden');
    },
    initDraggable:function(){
        if(!this.dragContainer){
            this.zoomerOuter.wrap('<div class="drag-container" style="padding:'+ this.containerStyles.height +'px '+ this.containerStyles.width +'px; margin-top:'+ -this.containerStyles.height +'px; margin-left:'+ -this.containerStyles.width +'px;"></div>');
            this.dragContainer = this.zoomerOuter.parent('.drag-container');
        }
        this.dragContainer.draggable({
    		scroll: false,
    		start:function(){
                $(event.target).addClass("closehand");
    		},
    		stop:function(){
                $(event.target).removeClass("closehand");
    		}
    	});
    },
    setInitData: function(){
        this.containerStyles = {
            width: this.container.width(),
            height: this.container.height(),
            outerWidth: this.container.outerWidth(false),
            outerHeight: this.container.outerHeight(false)
        };
        this.elementStyles = {
            outerWidth: this.element.outerWidth(true),
            outerHeight: this.element.outerHeight(true)
        };
        this.centerPosition = this.getCenterPosition();
        var initScale = Math.min(this.containerStyles.width/this.elementStyles.outerWidth,this.containerStyles.height/this.elementStyles.outerHeight);
        this.initScale = initScale < 1? initScale : 1;
        this.initScale = this.getFixedScale(this.initScale);
    },
    wheelZoom: function(e){
        var direct = 0;
    	e = e || window.event;
    	if(e.wheelDelta){
    		direct = e.wheelDelta > 0 ? 1 : -1;
    	}else if(e.detail){
    		direct = e.detail < 0 ? 1 : -1;
    	}

        this.zoom({
            top: e.pageY,
            left: e.pageX
        },this.getNewScale(direct));

        if(e.preventDefault) {
    		e.preventDefault();
    		e.stopPropagation();
    	}else{
    		e.returnValue = false;
    		e.cancelBubble = true;
    	}
    },
    getNewScale: function(direct){
        var _newScale = this.scale + this.options.zoomStep * direct;
        return this.getFixedScale(_newScale);
    },
    getFixedScale: function(scale){
        if(!checker.isNumber(scale)){
            this.consoleInfo('zoom级别参数有误');
            return;
        }
        if(scale < this.options.zoomMin){
            scale = this.options.zoomMin;
        }else if(scale > this.options.zoomMax){
            scale = this.options.zoomMax;
        }
        scale = scale.toFixed(6) - 0;
        return scale;
    },
    getZoomerPosition: function(){
        return this.zoomerInner.offset();
    },
    getCenterPosition: function(){
        return {
            top: this.container.offset().top + this.containerStyles.outerHeight/2,
            left: this.container.offset().left + this.containerStyles.outerWidth/2
        };
    },
    zoom: function(originPoint,newScale){
        if(newScale == this.scale){
            if(this.scale == this.options.zoomMax){
                return 'Max';
            }else if(this.scale == this.options.zoomMin){
                return 'Min';
            }else{
                return 'NotChange';
            }
        }
        var dy = (newScale/this.scale - 1) * (this.getZoomerPosition().top + this.elementStyles.outerHeight * this.scale / 2 - originPoint.top);
        var dx = (newScale/this.scale - 1) * (this.getZoomerPosition().left + this.elementStyles.outerWidth * this.scale / 2 - originPoint.left);
        this.scale = newScale;
        this.dPosition.top += dy;
        this.dPosition.left += dx;
        this.setStyle(this.scale,this.dPosition);
        return this.scale;
    },
    zoomIn: function(){
        return this.zoom(this.centerPosition,this.getNewScale(1));
    },
    zoomOut: function(){
        return this.zoom(this.centerPosition,this.getNewScale(-1));
    },
    zoomToMax: function(){
        return this.zoom(this.centerPosition,this.options.zoomMax);
    },
    zoomToSuitable: function(){
        this.scale = this.initScale;
        this.dPosition.left = 0;
        this.dPosition.top = 0;
        this.setStyle(this.scale, this.dPosition);
        if(this.dragContainer){
            this.dragContainer.css({
                left: 0,
                top: 0
            });
        }
        return this.scale;
    },
    zoomToScale: function(newScale){
        return this.zoom(this.centerPosition,this.getFixedScale(newScale));
    },
    setStyle: function(newScale,dPosition){
        this.zoomerInner.css(this.getCssCode(newScale,dPosition));
        if(this.options.afterZoom){
            this.options.afterZoom(this.getState());
        }
    },
    getState: function(){
        var _state = 'def';
        if(this.scale == this.options.zoomMax){
            _state = 'max';
        }else if(this.scale == this.options.zoomMin){
            _state = 'min';
        }
        return {
            scale: this.scale,
            state: _state
        };
    },
    getCssCode: function(newScale,dPosition){
        var cssObj = {
            left: dPosition.left + 'px',
            top: dPosition.top + 'px',
        };
        for(var i = 0; i < window.UserAgent.length; i++){
            cssObj[this.clients[window.UserAgent[i]].prefix + 'transform'] = 'scale(' + newScale + ')';
        };
        return cssObj;
    },
    getUserAgent: function(){
        var _ua = ['default'];
        for(var key in this.clients){
            if(RegExp(key).test(navigator.userAgent.toLowerCase())){
                _ua.unshift(key);
            }
        }
        return _ua;
    },
    consoleInfo: function(msg){
        if(console && console.info){
            console.info(msg);
        }
    }
}
