function checkBtnState(state){
    for(var key in toolsBtnStates[state]){
        if(toolsBtnState[key] != toolsBtnStates[state][key]){
            toolsBtnState[key] = toolsBtnStates[state][key];
            updateBtnState(toolsBtns[key],toolsBtnState[key]);
        }
    }
};

function updateBtnState(btn,state){
    if(state){
        btn.removeAttr('disabled');
    }else{
        btn.attr('disabled','disabled');
    }
};

var btnsFunctionMap = {
    zoomToMax : 'zoomToMax',
    zoomIn : 'zoomIn',
    zoomOut : 'zoomOut',
    zoomToSuitable : 'zoomToSuitable'
};

var toolsBtnState = {
    zoomToMax : true,
    zoomIn : true,
    zoomOut : true,
    zoomToSuitable : true
};

var toolsBtnStates = {
    max : {
        zoomToMax : false,
        zoomIn : false,
        zoomOut : true,
        zoomToSuitable : true
    },
    min : {
        zoomToMax : true,
        zoomIn : true,
        zoomOut : false,
        zoomToSuitable : true
    },
    def : {
        zoomToMax : true,
        zoomIn : true,
        zoomOut : true,
        zoomToSuitable : true
    }
};

var toolsBtns = {};

$(".js-tools-btn").each(function(){
    var _this = $(this);
    var _key = _this.attr('data-action-type');
    toolsBtns[_key] = _this;
});

var myZoomer = new zoomHelper({
    container: '.zoom-container',
    zoomer: '#zoomer',
    afterZoom: function(data){
        checkBtnState(data.state);
    },
    zoomMax: 2,
    zoomMin: 0.1,
    zoomStep: 0.2
});

for(var btn in toolsBtns){
    toolsBtns[btn].on('click',{key: btn},function(event){
        myZoomer[btnsFunctionMap[event.data.key]]();
    });
};

checkBtnState(myZoomer.getState().state);
