/**
 * Created with JetBrains WebStorm.
 * User: Cho il hyun
 * Date: 13. 10. 11
 * Time: 오전 11:00
 * To change this template use File | Settings | File Templates.
 */


(function(){
    var root = this;

    var Galaxy = root.Galaxy = {};
    var lastScroll = 0;
    Galaxy.Scene = function(options) {

        $.extend(this,options);
        this.previewScene = '';
        this.thisScene= '';
        this.zeroEvent = false;
        this.auto = false;
        this._setScrollEvent();
    }

    Galaxy.Scene.prototype = {
        _history :null,
        _loadEvent:false,
        delay :  {},
        playMovie: function(start,end,durationTime) {
            var scope = this;
            //durationTime = 1000;
            if (this.auto === true) return;
            this.auto = true;
            this._start = start;
            this._end = end;
            this._playNumber = lastScroll;

            if (this._end > lastScroll) {
                this.autoPlayType = 'up';
            } else {
                this.autoPlayType = 'down';
            }
            scope.delay = {
                136 : {history:[],length:5}
            }
            this.playTime = setInterval(function(){

                if (scope.autoPlayType == 'up') {
                    if (scope._end > lastScroll) {



                        if (scope._playNumber < scope._end) {
                            lastScroll++;

                            scope.controller.selectScene(lastScroll,'up','',durationTime);
                        }
                    }  else {
                        scope.auto = false;
                        scope.controller.setDurationTime(300);
                        clearInterval(scope.playTime);
                    }

                    scope.thisScene = 'up';
                } else {
                    if (scope._start < lastScroll) {
                        lastScroll--;
                        scope.previewScene =  scope.thisScene;
                        scope.thisScene = 'down';
                        if (scope.thisScene != scope.previewScene && scope.previewScene != '') {

                            lastScroll++;
                            lastScroll++;
                            scope.controller.selectScene(lastScroll,'down','downEvent',durationTime);
                        }    else {
                            scope.controller.selectScene(lastScroll,'down','',durationTime);
                        }



                    } else {
                        scope.auto = false;
                        scope.controller.setDurationTime(300);
                        clearInterval(scope.playTime);
                    }

                  //  scope.previewScene =  scope.thisScene;

                }

                scope._history = lastScroll;



            },5);


        } ,
        _setScrollEvent : function(){
            var scope = this,scollChangeEvent;

            $(window).bind('mousewheel',function(event) {
                setTimeout (function(){
                    scope._loadEvent = false;
                },100);
                if (scope.auto === true) {
                    return;
                }
                if (event.originalEvent.wheelDelta >= 0) {

                    if (lastScroll <= 0) {
                        lastScroll = 0;
                        if(scope._history != 0) scope.controller.selectScene(lastScroll,'');
                        scope._history = lastScroll;
                    }  else {
                        lastScroll--;
                        scope.previewScene =  scope.thisScene;
                        scope.thisScene = 'down';
                        if (scope._history === lastScroll) {
                            lastScroll++;
                            return ;
                        }
                        if (scope.thisScene != scope.previewScene && scope.previewScene != '') {
                            scollChangeEvent = 'downEvent';
                            lastScroll++;
                            lastScroll++;
                        }  else {
                            scollChangeEvent = '';
                        }
                        scope.controller.selectScene(lastScroll,'down',scollChangeEvent);
                        scope._history = lastScroll;
                    }
                } else {
                    if (lastScroll < scope.sceneTotal) {

                         //delay
                        lastScroll++;
                        scope.previewScene =  scope.thisScene;
                        scope.thisScene = 'up';
                    } else {
                        lastScroll = scope.sceneTotal;
                    }
                    if (scope._history === lastScroll) {
                        lastScroll--;
                        return ;
                    }
                    if (scope.thisScene != scope.previewScene && scope.previewScene != '' && lastScroll != 1) {
                        scollChangeEvent = 'upEvent';
                        lastScroll--;
                        lastScroll--;
                    }   else {
                        scollChangeEvent = '';
                    }
                    scope.controller.selectScene(lastScroll,'up',scollChangeEvent);
                    scope._history = lastScroll;
                }
                scope._loadEvent = true;
            });
        }
    }
    Galaxy.Element = function(options) {
        $.extend(this,options);
    }
    Galaxy.Element.prototype = {
        setMenuEvent: false,
        create: function(screenName,controller) {
            var scope = this;
            this.history = {

                moveX:[],
                moveY:[],
                scale:[],
                alpha:[],
                rotate:[],
                shadow:[]
            };
            this.durationTime = 300;
            this.events = {rotate:false,translate:false,scale:false};
            this.cfg = {rotateTarget:0,movexTarget:0,moveyTarget:0,scaleTarget:0,alphaTarget:0,rotateTarget:0 };
            this.screenName = screenName;
            this.controller = controller;
            this.rotate = this.default ? this.default.rotate : 0;
            this.moveX =  this.default ? this.default.moveX : 0;
            this.moveY =  this.default ? this.default.moveY : 0;
            this.scaleNum =this.default ? this.default.scaleNum : 1;
            this.alpha = this.default ? this.default.alpha : 1;
            this.debug = this.default ? this.default.debug : false;
            this.scrollType = '';
            this.historyMoveY = [];
            this.historyMoveX = [];
            this.historyScale = [];
            this.shadow = 0;

            var wrap = $('#'+this.screenName+' .sceneWrap');
            if (this.id) {
                var imageTag = '<img id="'+this.id+'" src="'+controller.basePath+'/'+this.src+'" >';
            } else {
                var imageTag = '<img src="'+controller.basePath+'/'+this.src+'" >';
            }
            wrap.append('<div class="'+this.name+'">'+imageTag+'</div>');

            if (this.styleData  instanceof  Object) {
                if (!this.styleData.position)  this.styleData.position = 'absolute';

                $('.'+this.name).css(this.styleData);
                this.setDurationTime();

                $('.'+this.name).css("transform","rotate("+ this.rotate +"deg) translate("+this.moveX+"px,"+this.moveY+"px) scale("+this.scaleNum+","+this.scaleNum+")");
                // $('.'+this.name).css('-ms-transform',"rotate("+ this.rotate +"deg) translate("+this.moveX+"px,"+this.moveY+"px) scale("+this.scaleNum+","+this.scaleNum+")");

                $('.'+this.name).css("opacity",this.alpha);
            }
            if (this.ani) {
                if(this.ani.scale && $.isArray(this.ani.scale)) {
                    $.each(this.ani.scale,function(i,scale){
                        scale.history = [];
                    });
                } else if(this.ani.scale){
                    this.ani.scale.history= [];
                }
                if (this.ani.translate && $.isArray(this.ani.translate)){
                    $.each(this.ani.translate,function(i,translate){
                        translate.history = [];
                    });
                } else if(this.ani.translate){
                    this.ani.translate.history= [];
                }
                if(this.ani.alpha && $.isArray(this.ani.alpha)) {
                    $.each(this.ani.alpha,function(i,alpha){
                        alpha.history = [];
                    });
                } else if(this.ani.alpha){
                    this.ani.alpha.history= [];
                }

                if (this.ani.shadow &&  $.isArray(this.ani.shadow)) {
                    $.each(this.ani.shadow,function(i,shadow){
                        shadow.history = [];
                    });
                }  else if(this.ani.shadow){
                    this.ani.shadow.history= [];
                }
                if(this.ani.rotate && $.isArray(this.ani.rotate)) {
                    $.each(this.ani.rotate,function(i,rotate){
                        rotate.history = [];
                    });
                } else if(this.ani.rotate){
                    this.ani.rotate.history= [];
                }
            }


            this.controller.element.on("setDurationTime", function(event,setDurationTime){
                scope.durationTime =  setDurationTime;

                scope.setDurationTime(setDurationTime);

            });

            this.controller.element.on("playScene", function(event,scene,scrollType,scollChangeEvent){

                scope.playScene(scene,scrollType,scollChangeEvent);

            });
        } ,
        setDurationTime: function() {
            if (this.durationTime > 300) {

                this.setMenuEvent = true;
            } else {
                this.setMenuEvent = false;
            }
            $('.'+this.name).css('-moz-transition-duration',this.durationTime+'ms');
            $('.'+this.name).css('-webkit-transition-duration',this.durationTime+'ms');
            $('.'+this.name).css('-ms-transition-duration',this.durationTime+'ms');
        },
        setHistory: function(type) {
            if (this.scrollType == 'up') this.history[type].push(1);
            else   this.history[type].pop();
        },
        getTranslate: function(scene) {

            var scope = this,translates;

            if (!$.isArray(this.ani.translate)) {
                translates = [this.ani.translate];
            } else {
                translates = this.ani.translate;
            }

            // console.log(this.ani.translate)
            $.each(translates,function(i,translate){

                if (translate.startScene && scene >= translate.startScene && scene <= translate.endScene)  {
                    translate.renderer = true;

                    scope.historyCheck(translate,scene,'translate');
                    var aniLen = translate.history.length;

                    if (scope.scrollType =='up') {
                        scope.moveY  = (scope.pcel(aniLen,translate.length,translate.y)).toFixed(3);
                        scope.moveX  =  (scope.pcel(aniLen,translate.length,translate.x)).toFixed(3);
                        if (scope.historyMoveY[i-1]) {
                            scope.moveY = parseInt(scope.historyMoveY[i-1]) +  parseInt(scope.moveY);
                            scope.moveX = parseInt(scope.historyMoveX[i-1]) +  parseInt(scope.moveX);
                        }
                    } else {
                        scope.moveY  = (scope.pcel(aniLen,translate.length,translate.y)).toFixed(3);
                        scope.moveX  =  (scope.pcel(aniLen,translate.length,translate.x)).toFixed(3);
                        if (scope.historyMoveY[i-1]) {
                            scope.moveY = parseInt(scope.historyMoveY[i-1]) +  parseInt(scope.moveY);
                            scope.moveX = parseInt(scope.historyMoveX[i-1]) +  parseInt(scope.moveX);
                        }
                    }
                    if (scope.debug) {
//                        console.log('scene:'+scene+' aniLen '+aniLen+' y: '+scope.moveY +' x:'+scope.moveX+' translate.length:'+translate.length+' scrollType:'+scope.scrollType+' history:'+translate.history.length);
                    }

                    if(translate.endScene != scene) {
                        scope.lastSetting(translate);
                    }  else if(scope.scrollType == 'down'){
                        scope.lastSetting(translate,scene);
                    }

                    translate.aniFlow = scope.scrollType;
                    scope.events.translate = true;
                    if (translate.endScene == scene) {
                        scope.historyMoveY[i] = scope.moveY
                        scope.historyMoveX[i] = scope.moveX
                    }
                } else {
                    translate.renderer = false;
                }
            });





        },
        circle: function(radius, steps, centerX, centerY){
            var xValues = [centerX];
            var yValues = [centerY];
            var table="<tr><th>Step</th><th>X</th><th>Y</th></tr>";
            var ctx = document.getElementById("canvas").getContext("2d");
            ctx.fillStyle = "red"
            ctx.beginPath();
            for (var i = 0; i <= steps; i++) {
                var radian = (2*Math.PI) * (i/steps);
                xValues[i+1] = centerX + radius * Math.cos(radian);
                yValues[i+1] = centerY + radius * Math.sin(radian);
                if(0==i){
                    ctx.moveTo(xValues[i+1],yValues[i+1]);
                }else{
                    ctx.lineTo(xValues[i+1],yValues[i+1]);
                }
                table += "<tr><td>" + i + "</td><td>" + xValues[i+1] + "</td><td>" + yValues[i+1] + "</td></tr>";
            }
            ctx.fill();
            return table;
        },
        historyCheck: function(obj,scene,type) {

            if (this.scrollEvnetType == 'upEvent') { }
            if (this.scrollEvnetType == 'downEvent') {
                //obj.history.pop();
            }
        },
        renderShadow: function(scene) {
            var scope = this,shadows;
            if (!$.isArray(this.ani.shadow)) {
                shadows = [this.ani.shadow];
            } else {
                shadows = this.ani.shadow;
            }

            $.each(shadows,function(index,shadow){




                if (shadow.startScene && scene >= shadow.startScene && scene <= shadow.endScene) {
                    scope.historyCheck(shadow,scene,'shadow');
                    var aniLen = shadow.history.length;
                    var shadowX = (scope.pcel(aniLen,shadow.length,shadow.x)).toFixed(0);
                    var shadowY = (scope.pcel(aniLen,shadow.length,shadow.y)).toFixed(0);

                    if(shadow.endScene != scene) {
                        scope.lastSetting(shadow);
                    } else if(scope.scrollType == 'down'){
                        scope.lastSetting(shadow);
                    }
                    //console.log(scope.name+' x: '+ shadowX+' Y:'+shadowY);
                    //console.log(shadowX+'px '+shadowY+'px '+shadow.size+'px '+shadow.size+'px #'+shadow.color)


                    $('.'+scope.name).css({"-webkit-box-shadow":'5px 5px 10px #00f'});


                }


            });
        },
        renderRotate: function(scene) {

            var scope = this,rotates;
            if (!$.isArray(this.ani.rotate)) {
                rotates = [this.ani.rotate];
            } else {
                rotates = this.ani.rotate;
            }
           // if (this.debug) console.log(scene)
            $.each(rotates,function(index,rotate) {
                if (rotate.startScene && scene >= rotate.startScene && scene <= rotate.endScene) {
                    scope.historyCheck(rotate,scene,'rotate');
                    var aniLen = rotate.history.length;
                    if (rotate.value > 0) {
                        if(scope.scrollType =='down') {

                            scope.rotate = (scope.default.rotate - scope.pcel(aniLen,rotate.length,rotate.value)).toFixed(3);
                        } else {
                            scope.rotate = (scope.default.rotate + scope.pcel(aniLen,rotate.length,rotate.value)).toFixed(3);
                        }
                    //    if(scope.debug) console.log(' 원본값:'+scope.default.rotate+' rotate:'+ scope.rotate)
                    } else {

                        if(scope.scrollType =='down') {
                            scope.rotate = (scope.default.rotate + scope.pcel(aniLen,rotate.length,rotate.value)).toFixed(3);
                        }  else {
                            scope.rotate = (-scope.default.rotate - scope.pcel(aniLen,rotate.length,rotate.value)).toFixed(3);
                        }


                    }




                    if(rotate.endScene != scene) {
                        scope.lastSetting(rotate);
                    } else if(scope.scrollType == 'down'){
                        scope.lastSetting(rotate);
                    }
                    scope.events.rotate = true;
                    scope.aniFlow = scope.scrollType;

                }
            });

        },
        renderScale: function(scene) {
            var scope = this,scales;
            if (!$.isArray(this.ani.scale)) {
                scales = [this.ani.scale];
            } else {
                scales = this.ani.scale;
            }

            $.each(scales,function(index,scale){
                if (scale.startScene && scene >= scale.startScene && scene <= scale.endScene) {
                    scope.historyCheck(scale,scene,'scale');
                    var aniLen = scale.history.length;

                    if (scale.scaleType) {

                        switch(scale.scaleType) {
                            case 1:
                                if (scope.scrollType =='up') {
                                    var scaleValue = (scope.pcel(aniLen,scale.length,scale.value)+scale.value).toFixed(3);
                                    if (scope.historyScale[index-1]) {
                                        scope.scaleNum = (parseFloat(scope.historyScale[index-1]) -  parseFloat(scaleValue)).toFixed(3);
                                    }  else {
                                        scope.scaleNum  =  (scope.default.scaleNum - scaleValue).toFixed(3);
                                    }
                                }  else {
                                    var scaleValue = (scope.pcel(aniLen,scale.length,scale.value)+scale.value).toFixed(3);
                                    if (scope.historyScale[index-1]) {
                                        scope.scaleNum  = (parseFloat(scope.historyScale[index-1])  -  parseFloat(scaleValue)).toFixed(3);
                                        if (aniLen === 0) {
                                            scope.scaleNum = scope.historyScale[index-1];
                                        }
                                    }  else {
                                        scope.scaleNum  = (scope.default.scaleNum -  parseFloat(scaleValue)).toFixed(3);
                                        if (aniLen === 0) {
                                            scope.scaleNum = scope.default.scaleNum;
                                        }
                                    }
                                }
                                break;
                            case 2:
                                if (scope.scrollType =='up') {

                                    if (scope.historyScale[index-1]) {
                                        scope.scaleNum = (parseFloat(scope.historyScale[index-1])  + scope.pcel(aniLen,scale.length,scale.value)+scale.value).toFixed(3);
                                    }  else {
                                        scope.scaleNum = (scope.default.scaleNum + scope.pcel(aniLen,scale.length,scale.value)+scale.value).toFixed(3);
                                    }

                                } else {

                                    var scaleValue = (scope.pcel(aniLen,scale.length,scale.value)+scale.value).toFixed(3);
                                    if (scope.historyScale[index-1]) {

                                        scope.scaleNum  = (parseFloat(scope.historyScale[index-1])+  parseFloat(scaleValue)).toFixed(3);
                                        if (aniLen === 0) {
                                            scope.scaleNum = scope.historyScale[index-1];
                                        }
                                    }  else {
                                        scope.scaleNum  = (scope.default.scaleNum +  parseFloat(scaleValue)).toFixed(3);

                                        if (aniLen === 0) {
                                            scope.scaleNum = scope.default.scaleNum;
                                        }
                                    }



                                }
                                break;
                        }
                    }  else {
                        scope.scaleNum = (scope.pcel(aniLen,scale.length,scale.value)+scale.value).toFixed(3);
                    }

                    if (scope.debug) {
//                        console.log('scene:' + scene +' aniLen:'+aniLen+' scale:'+scope.scaleNum+' length:'+scale.length);
                    }

                    if(scale.endScene != scene) {
                        scope.lastSetting(scale);
                    } else if(scope.scrollType == 'down'){
                        scope.lastSetting(scale);
                    }
                    scope.events.scale = true;
                    if (scale.endScene == scene) {
                        scope.historyScale[index] = scope.scaleNum

                    }
                    scale.aniFlow = scope.scrollType;
                }
            });

        },
        getAlpha: function(scene) {
            var scope = this,alphas;


            /*
             menuEvent:{
             startScene:290,endScene:300,
             alpha:[{startScene:295,endScene:296,fade:false,length:2}],
             }
             */



            if (!$.isArray(this.ani.alpha)) {
                alphas = [this.ani.alpha];
            } else {
                alphas = this.ani.alpha;
            }

            $.each(alphas,function(index,alpha) {

                if (alpha.startScene && scene >= alpha.startScene && scene <= alpha.endScene) {
                    scope.historyCheck(alpha,scene,'alphas');
                    var aniLen = alpha.history.length;
                    if (alpha.fade) {
                        if (alpha.length > 2) {
                            scope.alpha = (1 -scope.pcel(aniLen,alpha.length,1)).toFixed(3);
                        } else {
                            scope.alpha = alpha.aniFlow == 'up' || alpha.aniFlow == '' ? 0:1;
                        }
                    }  else {
                        if (alpha.length > 2) {
                            scope.alpha = (scope.pcel(aniLen,alpha.length,1)).toFixed(3);
                        }  else {
                            scope.alpha = alpha.aniFlow == 'up' || alpha.aniFlow == '' ? 1:0;
                        }
                        if (scope.debug) {
                            // console.log('scrollEvnetType '+scope.scrollEvnetType+' scene:'+scene+',history:'+alpha.history.length+',aniLen:'+aniLen+',alpha:'+scope.alpha +' scrollType:'+scope.scrollType+' history:'+alpha.history.length)
                        }
                    }
                    if(alpha.endScene != scene) {
                        scope.lastSetting(alpha);
                    } else if(scope.scrollType == 'down'){
                        scope.lastSetting(alpha);
                    }
                    $('.'+scope.name).css({
                        "opacity":scope.alpha
                    });


                    alpha.aniFlow = scope.scrollType;
                }
            });



        },

        lastSetting: function(obj,scene) {

            if (this.scrollType == 'up') {
                obj.history.push(1);
            }
            else {

                obj.history.pop();
            }
        },
        playScene : function(scene,scrollType,scollChangeEvent){
            if (!this.ani) {
                return;
            }


            this.scrollEvnetType = scollChangeEvent;
            this.scrollType = scrollType;
            if(this.debug) {
                 //console.log(scene)
            }
            if (this.ani.startScene <= scene && this.ani.endScene >= scene) {

                if (this.ani.shadow) {
                    this.renderShadow(scene);

                }

                if (this.ani.scale)  {
                    this.renderScale(scene);

                }
                if (this.ani.translate) {

                    this.getTranslate(scene);

                }

                if (this.ani.alpha) {
                    this.getAlpha(scene);


                }
                if ( this.ani.rotate ) {
                    this.renderRotate(scene);

                }
                this.display(scene);
            }

        },
        display: function(scene) {

            var e = [],scope=this;

            var rotate = this.events.rotate ?  this.rotate : 0;
            var moveX = this.events.translate ?  this.moveX : 0;
            var moveY = this.events.translate ?  this.moveY : 0;
            //var scale = this.events.scale ?  this.scaleNum : 0;

            $('.'+this.name).css("transform","rotate("+ this.rotate +"deg) translate("+moveX+"px,"+moveY+"px) scale("+this.scaleNum+","+this.scaleNum+")");

            if (this.debug) {
                //console.log(scene);
                // console.log("rotate("+ this.rotate +"deg) translate("+moveX+"px,"+moveY+"px) scale("+this.scaleNum+","+this.scaleNum+")");
            }
            if (scene === 0) {
                //초기값으로 초기화
                this.reset();

            }

        },
        reset: function() {

            this.events.translate = false;
            this.events.rotate = false;
            this.events.scale = false;

            if (this.ani) {

                if(this.ani.scale && $.isArray(this.ani.scale)) {
                    $.each(this.ani.scale,function(i,scale){
                        scale.history = [];
                    });

                } else if(this.ani.scale){
                    this.ani.scale.history= [];
                }
                if (this.ani.shadow &&  $.isArray(this.ani.shadow)) {
                    $.each(this.ani.shadow,function(i,shadow){
                        shadow.history = [];
                    });
                }  else if(this.ani.shadow) {
                    this.ani.shadow.history= [];
                }

                if (this.ani.translate && $.isArray(this.ani.translate)){
                    $.each(this.ani.translate,function(i,translate){
                        translate.history = [];
                    });

                } else if(this.ani.translate){
                    this.ani.translate.history= [];
                }

                if (this.debug) {

                }
                if(this.ani.alpha && $.isArray(this.ani.alpha)) {

                    $.each(this.ani.alpha,function(i,alpha){
                        alpha.history = [];
                    });
                } else if(this.ani.alpha){
                    this.ani.alpha.history= [];
                }

                if($.isArray(this.ani.rotate)) {

                    $.each(this.ani.rotate,function(i,rotate){
                        rotate.history = [];
                    });
                }  else if(this.ani.rotate){
                    this.ani.rotate.history= [];
                }

            }
            this.historyMoveY = [];
            this.historyMoveX = [];

            this.historyScale = [];
            this.rotate = this.default ? this.default.rotate : 0;
            this.moveX =  this.default ? this.default.moveX : 0;
            this.moveY =  this.default ? this.default.moveY : 0;
            this.scaleNum =this.default ? this.default.scaleNum : 1;
            this.alpha = this.default ? this.default.alpha : 1;
            this.debug = this.default ? this.default.debug : false;
            this.scrollType = '';
            this.scrollEvnetType ='';
        },
        //scene,this.ani.length,to
        pcel:function(n1,n2,hg){ //--비례식


            return  (hg/n2)*n1;
        }
    }


    var DB = [],MENU={},dataLoaded = new Array(),SCREEN=[],BACKGROUND=[];
    Galaxy.Data = function(options) {

        $.extend(this,options);
        this.add({name:'menu_01_2',src:'new/menu/journey_menu_01_off.gif',type:'menu'});
        this.add({name:'menu_01_1',src:'new/menu/journey_menu_01_on.gif',type:'menu'});
        this.add({name:'menu_02_1',src:'new/menu/journey_menu_02_on.gif',type:'menu'});
        this.add({name:'menu_02_2',src:'new/menu/journey_menu_02_off.gif',type:'menu'});
        this.add({name:'menu_03_1',src:'new/menu/journey_menu_03_on.gif',type:'menu'});
        this.add({name:'menu_03_2',src:'new/menu/journey_menu_03_off.gif',type:'menu'});






        this.add({group:0,name:'galaxynote3_main',src:'new/storyboard_galaxynote3_main.jpg',type:'screen',
            styleData:{display:'block',left:'0px',top:'0px','z-index':30000},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
//            styleData:{display:'block','z-index':20000} ,
            ani:{
                startScene:1,endScene:45,
                alpha:{startScene:1,endScene:2,fade:true,length:2} ,


            }

        });
        this.add({name:'s_b',src:'new/screen/gradation.png',type:'background',
            styleData:{display:'block','z-index':10000}
        });

//        // 배경
        this.add({group:0,name:'s_1',src:'new/screen/01_bg.png',type:'screen',
            styleData:{display:'block',left:'-585px',top:'-310px'},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:0.41,alpha:1},
            ani:{
                startScene:1,endScene:45,
                scale:{startScene:1,endScene:12,value:0.52,length:12},
                translate:{startScene:1,endScene:12,y:-320,x:130,length:12},
                alpha:{startScene:10,endScene:45,fade:true,length:25}
            }
        });
        //여자아이
        this.add({group:0,name:'s_2',src:'new/screen/01_body.png',type:'screen',
            styleData:{display:'block',left:'72px',top:'-240px','z-index':104},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:0.51,alpha:1},
            ani:{
                startScene:1,endScene:20,
                scale:{startScene:1,endScene:12,value:0.61,length:12},
                translate:{startScene:1,endScene:12,y:-320,x:345,length:12},
                alpha:{startScene:18,endScene:20,fade:true,length:2}
            }



        });




        //핸드폰   왼손
        this.add({group:0,name:'s_4',src:'new/screen/01_left_hand_01.png',type:'screen',

            styleData:{display:'block',left:'110px',top:'195px','z-index':50} ,
            default:{rotate:0,moveX:0,moveY:0,scaleNum:0.51,alpha:1},
            ani:{
                startScene:1,endScene:25,
                scale:{startScene:1,endScene:12,value:0.61,length:12},
                translate:{startScene:1,endScene:12,y:-120,x:0,length:12},
                alpha:{startScene:24,endScene:25,fade:true,length:2}
            }
        });
        //핸드폰 오른손
        this.add({group:0,name:'s_7',src:'new/screen/01_right_hand_01.png',type:'screen',
            debugTemp:'abc',
            styleData:{display:'block',left:'170px',top:'250px','z-index':103} ,
            default:{rotate:0,moveX:0,moveY:0,scaleNum:0.51,alpha:1},
            ani:{
                startScene:1,endScene:30,
                //rotate:{startScene:26,endScene:30,value:12,length:4},
                scale:{startScene:1,endScene:12,value:0.61,length:12},
                translate:[{startScene:1,endScene:12,y:-60,x:200,length:12},{startScene:18,endScene:24,y:-60,x:900,length:6}],
                //alpha:{startScene:14,endScene:16,fade:true,length:2}
            }
        });
//
//        //왼손 두번째 핸드
        this.add({group:0,name:'s_5',src:'new/screen/01_left_hand_02.png',type:'screen',
            styleData:{display:'block',left:'90px',top:'50px','z-index':102} ,
            default:{rotate:0,moveX:0,moveY:0,scaleNum:0.90,alpha:0},
            ani:{
                startScene:20,endScene:60,
                rotate:{startScene:27,endScene:31,value:12,length:4},
                //  scale:{startScene:26,endScene:30,value:0.45,length:4},
                translate:{startScene:24,endScene:34,y:-30,x:0,length:10},
                alpha:[
                    {startScene:24,endScene:25,fade:false,length:2},
                    {startScene:35,endScene:40,fade:false,length:4,fade:true}
                ]
            }
        });
//
//        //오른손  두번째
        this.add({group:0,name:'s_8',src:'new/screen/01_right_hand_02.png',type:'screen',

            styleData:{display:'block',left:'240px',top:'100px','z-index':102} ,
            default:{rotate:0,moveX:500,moveY:500,scaleNum:0.90,alpha:0},
            ani:{
                startScene:20,endScene:45,
                rotate:{startScene:26,endScene:30,value:12,length:4},
                //  scale:{startScene:26,endScene:30,value:0.45,length:4},
                translate:[{startScene:20,endScene:26,y:60,x:80,length:6},{startScene:35,endScene:45,y:650,x:800,length:10}],
                alpha:{startScene:20,endScene:21,fade:false,length:2}
            }
        });



//
//
//
//
//
//
//        this.add({group:0,name:'s_10',src:'new/screen/01_right_hand_04.png',type:'screen'});
//
//

//
//        //핸드폰 장면 두번째
        this.add({group:0,name:'s_11',src:'new/screen/01_screen_02.png',type:'screen',
            styleData:{display:'block',left:'107px',top:'77px','z-index':51} ,
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani:{
                startScene:7,endScene:26,
                //scale:{startScene:13,endScene:14,value:0.81,length:4},
                // translate:[{startScene:9,endScene:13,y:0,x:10,length:3}],

                alpha:[{startScene:13,endScene:14,fade:false,length:2},{startScene:24,endScene:25,fade:true,length:2}  ]
            }
        });
////
//
//
        this.add({group:0,name:'s_12',src:'new/screen/01_screen_03.png',type:'screen'});
        this.add({group:0,name:'s_13',src:'new/screen/01_screen_04.png',type:'screen'});





//        //오른손 펜
        this.add({group:0,name:'s_9',src:'new/screen/01_right_hand_03.png',type:'screen',
            styleData:{display:'block',left:'600px',top:'500px','z-index':230},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani:{
                startScene:41,endScene:80,
                //rotate:{startScene:26,endScene:30,value:12,length:4},
                //  scale:{startScene:26,endScene:30,value:0.45,length:4},
                translate:[
                    {startScene:42,endScene:55,y:-372,x:-195,length:13},
                    {startScene:71,endScene:80,y:500,x:500,length:8} ,

                ],
                //alpha:[{startScene:38,endScene:44,fade:false,length:7}]
            }
        });
//
//
//
//        //핸드폰 화면의 둥근 버튼1
        this.add({group:0,name:'s_14',src:'new/screen/01_screen_05_aircommand01.png',type:'screen',
            styleData:{display:'block',left:'360px',top:'145px','z-index':201} ,
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani:{
                startScene:38,endScene:80,
                //scale:{startScene:1,endScene:10,value:0.95,length:10},
                //translate:{startScene:1,endScene:10,y:-120,x:0,length:10},

                alpha:[{startScene:38,endScene:39,fade:false,length:2},{startScene:70,endScene:78,fade:true,length:8}]
            }


        });



        //핸드폰 화면의 둥근 버튼1
        this.add({group:0,name:'s_15',src:'new/screen/01_screen_05_aircommand02.png',type:'screen',

            styleData:{display:'block',left:'360px',top:'145px','z-index':202} ,
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani:{
                startScene:38,endScene:80,
                //scale:{startScene:1,endScene:10,value:0.95,length:10},
                //translate:{startScene:1,endScene:10,y:-120,x:0,length:10},

                alpha:[{startScene:58,endScene:59,fade:false,length:2},{startScene:70,endScene:78,fade:true,length:8}]
            }
        });
//
//


//
//        //파란색 선 5개
        this.add({group:0,name:'s_16',src:'new/screen/01_screen_05_circleline01.png',type:'screen',
            styleData:{display:'block',left:'314px',top:'80px','z-index':220},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani:{
                startScene:91,endScene:200,
                alpha:[{startScene:93,endScene:100,fade:false,length:7},{startScene:136,endScene:137,fade:true,length:2}]
            }

        });
        //        //        //파란색 선 2번째개
        this.add({group:0,name:'s_17',src:'new/screen/01_screen_05_circleline02.png',type:'screen',
            styleData:{display:'block',left:'315px',top:'80px','z-index':220},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani:{
                startScene:91,endScene:140,
                alpha:[{startScene:103,endScene:108,fade:false,length:6},{startScene:136,endScene:137,fade:true,length:2}]
            }
        });


          this.add({group:0,name:'s_18',src:'new/screen/01_screen_05_circleline03.png',type:'screen',

            styleData:{display:'block',left:'315px',top:'80px','z-index':220},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani:{
                startScene:91,endScene:140,
                alpha:[{startScene:108,endScene:119,fade:false,length:11},{startScene:136,endScene:137,fade:true,length:2}]
            }


        });
//

         this.add({group:0,name:'s_19',src:'new/screen/01_screen_05_circleline04.png',type:'screen',

            styleData:{display:'block',left:'315px',top:'80px','z-index':220},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani:{
                startScene:91,endScene:140,
                alpha:[{startScene:119,endScene:126,fade:false,length:7},{startScene:136,endScene:137,fade:true,length:2}]
            }


        });

        this.add({group:0,name:'s_20',src:'new/screen/01_screen_05_circleline05.png',type:'screen',
            styleData:{display:'block',left:'315px',top:'80px','z-index':220},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani:{
                startScene:91,endScene:140,
                alpha:[{startScene:127,endScene:131,fade:false,length:4},{startScene:136,endScene:137,fade:true,length:2}]
            }
        });

////
////
////
//
//
//

//
        this.add({group:0,name:'s_21',src:'new/screen/01_screen_05_circleline06.png',type:'screen',

            styleData:{display:'block',left:'315px',top:'80px','z-index':220},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani:{
                startScene:91,endScene:145,
                alpha:[{startScene:129,endScene:136,fade:false,length:7},{startScene:136,endScene:137,fade:true,length:2}]
            }

        });


        //검정 투명 핸드폰 배경
        this.add({group:0,name:'s_22',src:'new/screen/01_screen_06.png',type:'screen',

            styleData:{display:'block',left:'282px',top:'42px','z-index':201} ,
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani:{
                startScene:130,endScene:180,
                alpha:[{startScene:138,endScene:139,fade:false,length:2},{startScene:155,endScene:156,fade:true,length:2}]

            }


        });

        //핸드폰 정면 본체
        this.add({group:0,name:'s_6',src:'new/screen/01_left_hand_03.png',type:'screen',
            styleData:{display:'block',left:'90px',top:'5px','z-index':102} ,
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani:{
                startScene:38,endScene:250,
                //rotate:{startScene:26,endScene:30,value:12,length:4},
                scale:{startScene:160,endScene:175,value:0.12,length:15,scaleType:1},
                translate:[{startScene:20,endScene:30,y:-30,x:0,length:10},{startScene:160,endScene:175,y:0,x:-165,length:15},{startScene:210,endScene:215,y:-1450,x:0,length:15}],
                alpha:[{startScene:38,endScene:44,fade:false,length:6}]
            }
        });



        //배경  2
        this.add({group:0,name:'s_2222',src:'new/screen/01_bg02.png',type:'screen',
            styleData:{display:'block',left:'83px',top:'-30px','z-index':2} ,
            default:{rotate:0,moveX:0,moveY:0,scaleNum:0.9,alpha:0},
            ani :{
                startScene:33,endScene:250,
                alpha:{startScene:38,endScene:46,fade:false,length:8},
                scale:{startScene:160,endScene:175,value:0.12,length:15,scaleType:1},
                translate:[{startScene:160,endScene:175,y:12,x:-186,length:15},{startScene:210,endScene:215,y:-1450,x:0,length:15}]
            }
        });

        //아이나오는 화면
        this.add({group:0,name:'s_23',src:'new/screen/01_screen_07.png',type:'screen',

            styleData:{display:'block',left:'96px',top:'48px','z-index':202} ,
            default:{rotate:0,moveX:0,moveY:0,scaleNum:0.76,alpha:0},
            ani:{
                startScene:174,endScene:250,
                //scale:{startScene:160,endScene:175,value:0.12,length:15,scaleType:1},
                translate:[{startScene:176,endScene:200,y:25,x:45,length:15},{startScene:210,endScene:215,y:-1450,x:0,length:15}],
                alpha:[{startScene:174,endScene:175,fade:false,length:2}],
                //shadow :[{startScene:180,endScene:190,y:5,x:5,size:5,color:'#CC9990',length:10}]
            }
        });
        //아이 그림자
        this.add({group:0,name:'s_23_5',src:'new/screen/01_screen_shadow.png',type:'screen',

            styleData:{display:'block',left:'120px',top:'108px','z-index':201} ,
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani:{
                startScene:174,endScene:250,
                //scale:{startScene:160,endScene:175,value:0.12,length:15,scaleType:1},
                translate:[{startScene:178,endScene:200,y:17,x:37,length:15},{startScene:210,endScene:215,y:-1450,x:0,length:15}],
                alpha:[{startScene:174,endScene:175,fade:false,length:2}],
                //shadow :[{startScene:180,endScene:190,y:5,x:5,size:5,color:'#CC9990',length:10}]
            }
        })
        //핸드폰 화면 첫번째 축소된 하면
        this.add({group:0,name:'s_141_1',src:'new/screen/01_screen_05.png',type:'screen',
            styleData:{display:'block',left:'96px',top:'48px','z-index':200} ,
            default:{rotate:0,moveX:0,moveY:0,scaleNum:0.76,alpha:0},
            ani :{
                startScene:168,endScene:250,
                translate:[{startScene:210,endScene:215,y:-1450,x:0,length:15}],
                alpha:[{startScene:176,endScene:177,fade:false,length:2}]
            }
        });



//        //핸드폰 화면 첫번째
        this.add({group:0,name:'s_141',src:'new/screen/01_screen_05.png',type:'screen',
            styleData:{display:'block',left:'282px',top:'42px','z-index':190} ,
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani:{
                startScene:38,endScene:150,
                scale:{startScene:1,endScene:10,value:0.95,length:10},
                translate:[{startScene:1,endScene:10,y:-120,x:0,length:10},{startScene:210,endScene:215,y:-1450,x:0,length:15}],

                alpha:[{startScene:38,endScene:39,fade:false,length:2},{startScene:138,endScene:140,fade: true,length:2}]
            }
        });



        //오른손 펜  1
        this.add({group:0,name:'s_9_1',src:'new/screen/01_right_hand_03.png',type:'screen',
            styleData:{display:'block',left:'600px',top:'500px','z-index':230},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani:{
                startScene:81,endScene:200,
                //rotate:{startScene:26,endScene:30,value:12,length:4},
                scale:{startScene:160,endScene:170,value:0.12,length:10,scaleType:1},
                translate:[
                    {startScene:81,endScene:90,y:-375,x:-205,length:9},
                    {startScene:92,endScene:96,y:9,x:-59,length:4},
                    {startScene:98,endScene:100,y:-4,x:-10,length:2},
                    {startScene:102,endScene:104,y:-4,x:-10,length:2},
                    {startScene:105,endScene:108,y:-20,x:0,length:3},
                    {startScene:109,endScene:112,y:-19,x:5,length:3},
                    {startScene:113,endScene:116,y:-16,x:21,length:3},
                    {startScene:117,endScene:120,y:-16,x:20,length:3},
                    {startScene:121,endScene:124,y:-16,x:35,length:3},
                    {startScene:125,endScene:128,y:20,x:40,length:3},
                    {startScene:129,endScene:132,y:40,x:3,length:3},
                    {startScene:133,endScene:136,y:35,x:-30,length:3},

                    {startScene:142,endScene:150,y:-87,x:0,length:8},


                    {startScene:160,endScene:175,y:0,x:-240,length:15},
                    {startScene:176,endScene:200,y:500,x:0,length:15},
                   // {startScene:205,endScene:213,y:12,x:0,length:8},
                ]
                // circle :{startScene:92,endScene:130,step:15}
                //alpha:[{startScene:38,endScene:44,fade:false,length:7}]
            }
        });

        this.add({group:0,name:'s_26',src:'new/screen/01_script_bg01.png',type:'screen',

            styleData:{display:'block',left:'800px',top:'0px','z-index':190},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani : {
                startScene:170,endScene:250,
                translate:[

                    {startScene:176,endScene:200,y:20,x:-370,length:15},
                    {startScene:210,endScene:215,y:-1450,x:0,length:15}
                ],
                alpha:[{startScene:176,endScene:200,fade:false,length:15}]

            }



        });
        //타이틀
        this.add({group:0,name:'s_29',src:'new/screen/01_title.png',type:'screen',
            styleData:{display:'block',left:'840px',top:'180px','z-index':190},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani : {
                startScene:170,endScene:250,
                translate:[

                    {startScene:176,endScene:200,y:20,x:-280,length:15},
                    {startScene:210,endScene:215,y:-1450,x:0,length:15}
                ],
                alpha:[{startScene:176,endScene:200,fade:false,length:15}]

            }

        });

        //텍스트 글
        this.add({group:0,name:'s_3',src:'new/screen/01_bodyscript.png',type:'screen',



            styleData:{display:'block',left:'875px',top:'280px','z-index':190},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani : {
                startScene:170,endScene:250,
                translate:[

                    {startScene:176,endScene:200,y:20,x:-280,length:15},
                    {startScene:210,endScene:215,y:-1450,x:0,length:15}
                ],
                alpha:[{startScene:176,endScene:200,fade:false,length:15}]

            }


        });

        //collect
        this.add({group:0,name:'s_28',src:'new/screen/01_subtitle.png',type:'screen',

            styleData:{display:'block',left:'875px',top:'245px','z-index':190},   //500
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},                  //500
            ani : {
                startScene:170,endScene:250,
                translate:[

                    {startScene:176,endScene:200,y:20,x:-280,length:15},
                    {startScene:210,endScene:215,y:-1450,x:0,length:15}
                ],
                alpha:[{startScene:176,endScene:200,fade:false,length:15}]

            }


        });
        this.add({group:0,name:'s_27',src:'new/screen/01_script_bg02.png',type:'screen',
            styleData:{display:'block',left:'875px',top:'80px','z-index':190},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani : {
                startScene:170,endScene:250,
                translate:[

                    {startScene:176,endScene:200,y:20,x:-110,length:15}  ,
                    {startScene:210,endScene:215,y:-1450,x:0,length:15}
                ],
                alpha:[{startScene:176,endScene:200,fade:false,length:15}]

            }

        });



        //아래 그림자
        this.add({group:0,name:'s_back_shadow',src:'new/screen/width_transition_shadow.png',type:'screen',
            styleData:{display:'block',left:'0px',top:'438px','z-index':300},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani:{
                startScene:170,endScene:250,
                translate:[
                    {startScene:210,endScene:215,y:-1450,x:0,length:15}
                ]
            }



        });

        this.add({group:0,name:'s_24',src:'new/screen/01_screen_07_smallthumnail01.png',type:'screen'});
        this.add({group:0,name:'s_25',src:'new/screen/01_screen_07_smallthumnail02.png',type:'screen'});



        //2차분
        /*
         #############################
         */
        //배경 조각 난거      -73, 12
        this.add({group:0,name:'s_30_1',src:'new/screen/02_bg_top.png',type:'screen',
            styleData:{display:'block',left:'-72px',top:'-248px','z-index':100},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani :{
                startScene:260,endScene:300,
                translate:[
                    {startScene:270,endScene:285,y:750,x:0,length:15}

                ]
            }
        });

        //  배경
        this.add({group:0,name:'s_30',src:'new/screen/02_bg.png',type:'screen',
            styleData:{display:'block',left:'-200px',top:'234px','z-index':100},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani :{
                startScene:170,endScene:300,
                translate:[
                    {startScene:210,endScene:215,y:-1450,x:0,length:15},
                    {startScene:270,endScene:285,y:705,x:0,length:15}

                ]
            }
        });





        //핸드폰 잘라진 그림자
        //group 2
        this.add({group:0,name:'s_unders_1',src:'new/screen/03_note3_undershadow.png',type:'screen',
            styleData:{display:'block',left:'455px',top:'380px','z-index':102},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:0.68,alpha:0},
            ani :{
                startScene:280,endScene:340,
                alpha:[{startScene:292,endScene:300,fade:false,length:8}]  ,
                translate :[
                    {startScene:320,endScene:340,y:0,x:754,length:20}
                ]
            }


        });


          //동그란 원
        //group 2
        this.add({group:0,name:'s_40',src:'new/screen/02_script_bg01.png',type:'screen',
            styleData:{display:'block',left:'-250px',top:'-30px','z-index':101},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani : {
                startScene:170,endScene:380,
                alpha:[{startScene:280,endScene:295,fade:false,length:15},{startScene:360,endScene:361,fade:true,length:2}],
                translate:[
                    {startScene:280,endScene:295,y:0,x:215,length:15},
                    {startScene:320,endScene:340,y:0,x:754,length:20}
                ],



            }
        });
        //동그란 원
        //group 2
        this.add({group:0,name:'s_41',src:'new/screen/02_script_bg02.png',type:'screen',
            styleData:{display:'block',left:'795px',top:'210px','z-index':101},    //545
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani : {
                startScene:170,endScene:340,
              //  alpha:[{startScene:280,endScene:295,fade:false,length:15}],
                translate:[
                    {startScene:280,endScene:295,y:0,x:-250,length:15},
                    {startScene:320,endScene:340,y:0,x:754,length:20}
                ]
            }

        });
        //group 2
        this.add({group:0,name:'s_42',src:'new/screen/02_script_bg03.png',type:'screen',

            styleData:{display:'block',left:'770px',top:'340px','z-index':101},    //670 + 100
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani : {
                startScene:170,endScene:340,
                //  alpha:[{startScene:280,endScene:295,fade:false,length:15}],
                translate:[
                    {startScene:280,endScene:295,y:0,x:-100,length:15},
                    {startScene:320,endScene:340,y:0,x:754,length:20}
                ]
            }


        });


        //핸드폰 잘라진 그림자2
        //group 2
        this.add({group:0,name:'s_unders_2',src:'new/screen/03_note3_undershadow.png',type:'screen',
            styleData:{display:'block',left:'360px',top:'380px','z-index':102},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:0.68,alpha:0},
            ani :{
                startScene:280,endScene:340,
                alpha:[{startScene:292,endScene:300,fade:false,length:8}]   ,
                translate:[
                    {startScene:320,endScene:340,y:0,x:754,length:20}
                ]
            }


        });

        //핸드폰 잘라진 그림자3
        //group 2
        this.add({group:0,name:'s_unders_3',src:'new/screen/03_note3_undershadow.png',type:'screen',
            styleData:{display:'block',left:'264px',top:'380px','z-index':102},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:0.68,alpha:0},
            ani :{
                startScene:280,endScene:340,
                alpha:[{startScene:292,endScene:300,fade:false,length:8}]  ,
                translate:[
                    {startScene:320,endScene:340,y:0,x:754,length:20}
                    ]
            }


        });


        //핸드폰 잘라진 그림자4
        //group 2
        this.add({group:0,name:'s_unders_4',src:'new/screen/03_note3_undershadow.png',type:'screen',
            styleData:{display:'block',left:'168px',top:'380px','z-index':102},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:0.68,alpha:0},
            ani :{
                startScene:280,endScene:340,
                alpha:[{startScene:292,endScene:300,fade:false,length:8}]  ,
                translate:[  {startScene:320,endScene:340,y:0,x:754,length:20} ]
            }


        });
        //라인
        //group 2
        this.add({group:0,name:'s_bg_line_1',src:'new/screen/02_script_bg_line.png',type:'screen',
            styleData:{display:'block',left:'90px',top:'355px','z-index':100},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:0.1,alpha:0} ,
            ani :{
                startScene:280,endScene:340,
                alpha:[{startScene:280,endScene:281,fade:false,length:2}],
                scale:{startScene:292,endScene:310,value:0.5,length:18,scaleType:1},
                translate :[  {startScene:320,endScene:340,y:0,x:754,length:20}]
            }

        });
        //핸드폰 그림자
        this.add({group:0,name:'s_53_shadow',id:'_hand04',src:'new/screen/02_note3_shadow.png',type:'screen',
            styleData:{display:'block',left:'50px',top:'610px','z-index':101},
            default:{rotate:-11,moveX:0,moveY:0,scaleNum:0.85,alpha:1},
            // shadow :{},
            ani :{
                startScene:170,endScene:340,
                translate:[
                    {startScene:210,endScene:215,y:-1440,x:360,length:15},
                    {startScene:320,endScene:340,y:0,x:300,length:20}
                ],
                alpha:[{startScene:220,endScene:228,fade:true,length:8}] ,


            }

        });







        //핸드폰 왼쪽 1번째
        this.add({group:0,name:'s_53_3',id:'_hand04',src:'new/screen/02_note3_screen01.png',type:'screen',
            styleData:{display:'block',left:'41px',top:'605px','z-index':102},
            default:{rotate:-11,moveX:0,moveY:0,scaleNum:0.9,alpha:1},
            // shadow :{},
            ani :{
                startScene:170,endScene:340,
                rotate:[{startScene:239,endScene:249,value:11,length:10}],
                scale:{startScene:265,endScene:275,value:0.11,length:10,scaleType:1},
                alpha:[{startScene:256,endScene:257,fade:true,length:2}],
                translate:[
                    {startScene:210,endScene:215,y:-1450,x:359,length:15},
                    {startScene:239,endScene:249,y:-39,x:-25,length:10},
                    {startScene:280,endScene:295,y:75,x:29,length:15} ,
                    {startScene:320,endScene:340,y:0,x:754,length:20}
                ]
            }

        });


        //핸드폰 왼쪽 2번째
        this.add({group:0,name:'s_53_2',id:'_hand03',src:'new/screen/02_note3_screen01.png',type:'screen',
            styleData:{display:'block',left:'184px',top:'546px','z-index':102},
            default:{rotate:9,moveX:0,moveY:0,scaleNum:0.9,alpha:1},
            // shadow :{},
            ani :{
                startScene:170,endScene:340,
                rotate:[{startScene:236,endScene:240,value:-9,length:4}],
              //  scale:{startScene:265,endScene:275,value:0.11,length:10,scaleType:1},
                alpha:[{startScene:255,endScene:256,fade:true,length:2}],
                translate:[
                    {startScene:210,endScene:215,y:-1450,x:-175,length:15},
                    {startScene:236,endScene:250,y:20,x:135,length:14} ,
                    {startScene:280,endScene:295,y:75,x:-2,length:15} ,
                    {startScene:320,endScene:340,y:0,x:754,length:20}
                ]
            }

        });




        //핸드폰 왼쪽 3번째
        this.add({group:0,name:'s_53_1',id:'_hand02',src:'new/screen/02_note3_screen01.png',type:'screen',
            styleData:{display:'block',left:'348px',top:'510px','z-index':101},
            default:{rotate:2,moveX:0,moveY:0,scaleNum:0.9,alpha:1},
            // shadow :{},
            ani :{
                startScene:170,endScene:340,
                rotate:[{startScene:238,endScene:248,value:-2,length:10}],
                scale:{startScene:265,endScene:275,value:0.11,length:10,scaleType:1},
                alpha:[{startScene:260,endScene:261,fade:true,length:2}],
                translate:[
                    {startScene:210,endScene:215,y:-1100,x:0,length:15} ,
                    {startScene:238,endScene:248,y:-60,x:39,length:10},
                    {startScene:280,endScene:295,y:75,x:-32,length:15},
                    {startScene:320,endScene:340,y:0,x:754,length:20}
                ]
            }

        });




        //핸드폰 왼쪽 4번쩨
        this.add({group:0,name:'s_53',id:'_hand01',src:'new/screen/02_note3_screen01.png',type:'screen',
            styleData:{display:'block',left:'510px',top:'494px','z-index':102},
            default:{rotate:-9,moveX:0,moveY:0,scaleNum:0.9,alpha:1},
            ani :{
                startScene:170,endScene:340,
                rotate:[{startScene:236,endScene:246,value:9,length:10}],
                scale:{startScene:265,endScene:275,value:0.11,length:10,scaleType:1},
                alpha:[{startScene:263,endScene:264,fade:true,length:2}],
                translate:[
                    {startScene:210,endScene:215,y:-1290,x:230,length:15},
                    {startScene:236,endScene:246,y:30,x:-110,length:15},
                    {startScene:280,endScene:295,y:75,x:-62,length:15},
                    {startScene:320,endScene:340,y:0,x:754,length:20}

                ]

            }
        });


        //02_right_hand_01
        this.add({group:0,name:'s_36_4',src:'new/screen/02_right_hand_01.png',type:'screen',
            styleData:{display:'block',left:'-50px',top:'132px','z-index':105},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani :{
                startScene:240,endScene:340,
                alpha:[{startScene:240,endScene:256,fade:false,length:14},{startScene:260,endScene:280,fade:true,length:10}],
                translate :[ {startScene:240,endScene:262,y:0,x:600,length:22}]     ,
            }

        });
        //남자 왼쪽 첫번째
        this.add({group:0,name:'s_36',src:'new/screen/02_note3_screen02.png',type:'screen',
            styleData:{display:'block',left:'143px',top:'98px','z-index':102},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani :{
                startScene:250,endScene:340,
                alpha:[{startScene:250,endScene:251,fade:false,length:2}],
                scale:{startScene:280,endScene:295,value:0.11,length:15,scaleType:1},
                translate :[ {startScene:280,endScene:295,y:75,x:10,length:15},{startScene:320,endScene:340,y:0,x:754,length:20}]     ,

            }

        });
        //남자  왼쪽 2번째
        this.add({group:0,name:'s_37',src:'new/screen/02_note3_screen03.png',type:'screen',
            styleData:{display:'block',left:'268px',top:'98px','z-index':102},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani :{
                startScene:250,endScene:340,
                scale:{startScene:280,endScene:295,value:0.11,length:15,scaleType:1},
                alpha:[{startScene:254,endScene:255,fade:false,length:2}],
                translate :[{startScene:280,endScene:295,y:75,x:-13,length:15},{startScene:320,endScene:340,y:0,x:754,length:20}]  ,

            }

        });


        //남자 왼쪽 3번째
        //group 2
        this.add({group:0,name:'s_38',src:'new/screen/02_note3_screen04.png',type:'screen',
            styleData:{display:'block',left:'393px',top:'98px','z-index':102},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani :{
                startScene:250,endScene:340,
                scale:{startScene:280,endScene:295,value:0.11,length:15,scaleType:1},
                alpha:[{startScene:260,endScene:261,fade:false,length:2}],
                translate :[  {startScene:280,endScene:295,y:75,x:-36,length:15},{startScene:320,endScene:340,y:0,x:754,length:20}]  ,

            }

        });
        //남자 왼쪽 4번째
        this.add({group:0,name:'s_39',src:'new/screen/02_note3_screen05.png',type:'screen',
            styleData:{display:'block',left:'520px',top:'98px','z-index':102},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani :{
                startScene:250,endScene:340,
                scale:{startScene:280,endScene:295,value:0.11,length:15,scaleType:1},
                alpha:[{startScene:261,endScene:262,fade:false,length:2}] ,
                translate:[     {startScene:280,endScene:295,y:75,x:-61,length:15},{startScene:320,endScene:340,y:0,x:754,length:20}] ,


            }

        });




        //손
        this.add({group:0,name:'s_53_hand',id:'_hand04',src:'new/screen/02_left_hand_01.png',type:'screen',
            styleData:{display:'block',left:'0px',top:'610px','z-index':100},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            // shadow :{},
            ani :{
                startScene:170,endScene:300,
                translate:[
                    {startScene:210,endScene:215,y:-1380,x:0,length:15},
                    {startScene:220,endScene:235,y:0,x:-400,length:15}
                ]
            }

        });



        //펜
        //380
        this.add({group:0,name:'s_34',src:'new/screen/02_object(pen).png',type:'screen',
            styleData:{display:'block',left:'220px',top:'880px','z-index':101},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani :{
                startScene:170,endScene:280,
                translate:[
                    {startScene:210,endScene:215,y:-1450,x:0,length:15},
                    {startScene:270,endScene:280,y:300,x:100,length:10}
                ]
            }

        });
        //이어
        //200
        this.add({group:0,name:'s_33',src:'new/screen/02_object(mp3).png',type:'screen',

            styleData:{display:'block',left:'585px',top:'700px','z-index':100},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani :{
                startScene:170,endScene:280,
                translate:[
                    {startScene:210,endScene:215,y:-1450,x:0,length:15} ,
                    {startScene:270,endScene:280,y:300,x:100,length:10}
                ]
            }
        });



        //파란색 타이틀 multi vision
        //group 2
        this.add({group:0,name:'s_44',src:'new/screen/02_title.png',type:'screen',

            styleData:{display:'block',left:'230px',top:'-100px','z-index':100},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani :{
                startScene:280,endScene:340,
                translate:[
                    {startScene:280,endScene:295,y:150,x:0,length:15} ,
                    {startScene:320,endScene:340,y:0,x:754,length:20}
                ]
            }

        });
        //group 2
        this.add({group:0,name:'s_43',src:'new/screen/02_subtitle.png',type:'screen',
            styleData:{display:'block',left:'220px',top:'-100px','z-index':100},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani :{
                startScene:280,endScene:340,
                translate:[
                    {startScene:280,endScene:295,y:200,x:0,length:15} ,
                    {startScene:320,endScene:340,y:0,x:754,length:20}
                ]
            }

        });
        //group 2
        this.add({group:0,name:'s_31',src:'new/screen/02_bodyscript.png',type:'screen',
            styleData:{display:'block',left:'190px',top:'-130px','z-index':100},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani :{
                startScene:280,endScene:340,
                translate:[
                    {startScene:280,endScene:295,y:260,x:0,length:15} ,
                    {startScene:320,endScene:340,y:0,x:754,length:20}
                ]
            }

        });




        this.add({group:0,name:'s_31_1',src:'new/screen/height_transition_shadow.png',type:'screen',
            styleData:{display:'block',left:'-5px',top:'0px','z-index':121},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani :{
                startScene:280,endScene:340,
                alpha:[{startScene:340,endScene:341,fade:false,length:2}] ,
                translate:[

                    {startScene:320,endScene:340,y:0,x:754,length:20}
                ]
            }

        });

        //## 세번째 장면


        this.add({group:0,name:'s_45',src:'new/screen/03_bg_01.png',type:'screen',
            styleData:{display:'block',left:'-754px',top:'0px','z-index':120},
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani :{
                startScene:320,endScene:420,
                translate:[

                    {startScene:320,endScene:340,y:0,x:754,length:20}
                ] ,
                alpha:[{startScene:416,endScene:417,fade:true,length:2}] ,
            }
        });






         //운동하는 남자
        this.add({group:0,name:'s_group_1',src:'new/screen/03_man.png',type:'screen',
            styleData:{display:'block',left:'320px',top:'-660px','z-index':120},  //-430px + 300
            default:{rotate:0,moveX:0,moveY:0,scaleNum:0.221,alpha:1},
            ani :{
                startScene:330,endScene:420,
                translate:[
                    {startScene:335,endScene:350,y:0,x:-240,length:15}
                    ,{startScene:355,endScene:390,y:350,x:80,length:15}

                ] ,
                alpha:[{startScene:416,endScene:417,fade:true,length:2}] ,
                scale:[{startScene:355,endScene:390,value:0.72,length:25,scaleType:2}],
            }

        });

//운동하는 남자의 핸드폰
        this.add({group:0,name:'s_52_11',src:'new/screen/03_note3_02_1.png',type:'screen',

            styleData:{display:'block',left:'195px',top:'-810px','z-index':124},  //-692px + 300
            default:{rotate:0,moveX:0,moveY:0,scaleNum:0.221,alpha:1},
            ani :{
                startScene:330,endScene:450,
                translate:[
                    {startScene:335,endScene:350,y:0,x:-240,length:15},
                    {startScene:355,endScene:390,y:885,x:140,length:35},
                    //  {startScene:435,endScene:440,y:50,x:0,length:5}
                ] ,
                // rotate:[{startScene:420,endScene:430,value:26,length:10}],
                alpha:[{startScene:335,endScene:350,fade:false,length:15},{startScene:412,endScene:413,fade:true,length:2}] ,
                scale:[
                    {startScene:355,endScene:390,value:0.72,length:25,scaleType:2},
                    //  {startScene:420,endScene:430,value:0.08,length:10,scaleType:1}
                ],
            }
        });



        //삼각형 큰 배경
        this.add({group:0,name:'s_46',src:'new/screen/03_bg_02.png',type:'screen',

            styleData:{display:'block',left:'-1094px',top:'0px','z-index':122},  //-692px + 300
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani :{
                startScene:400,endScene:450,
                translate:[
                    {startScene:400,endScene:420,y:0,x:1100,length:20},

                ] ,
                alpha:[{startScene:430,endScene:440,fade:true,length:10}] ,
            }
        });
        //주먹 손
        this.add({group:0,name:'s_51',src:'new/screen/03_lefthand.png',type:'screen',
            styleData:{display:'block',left:'-900px',top:'120px','z-index':122},  //-692px + 300
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani : {
                startScene:400,endScene:450,
                translate:[
                    {startScene:400,endScene:415,y:0,x:650,length:15},
                    {startScene:416,endScene:430,y:400,x:350,length:14},

                ]
            }

        });

        //자전거
//        this.add({group:0,name:'s_56',src:'new/screen/03_screen_01.png',type:'screen',
//            styleData:{display:'block',left:'432px',top:'64px','z-index':125},  //-692px + 300
//            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
//            ani :{
//                startScene:330,endScene:450,
////                translate:[
////
////                    {startScene:435,endScene:440,y:50,x:0,length:5}
////                ] ,
//                alpha:[{startScene:391,endScene:400,fade:false,length:9}] ,
//             //   rotate:[{startScene:420,endScene:430,value:26,length:10}],
//                scale:[
//
//                    {startScene:420,endScene:430,value:0.08,length:10,scaleType:1}
//                ],
//            }
//        });

        //손목 시계
        this.add({group:0,name:'s_48',src:'new/screen/03_gear.png',type:'screen',
            styleData:{display:'block',left:'-380px',top:'160px','z-index':123},  //80px + 300
            default:{rotate:-5,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani : {
                startScene:400,endScene:450,
                translate:[
                    {startScene:400,endScene:415,y:0,x:480,length:15},
                    {startScene:416,endScene:430,y:0,x:250,length:14},
                   //{startScene:431,endScene:441,y:0,x:-200,length:10},

                ],
               // rotate:[{startScene:430,endScene:440,value:26,length:10,notMove:true}],
                scale:[
                      {startScene:420,endScene:430,value:0.08,length:10,scaleType:1}
                ],
                alpha:[{startScene:419,endScene:420,fade:true,length:2}]
            }
        });


        //4명의 가수
        this.add({group:0,name:'s_note3_111',src:'new/screen/03_note3_03_2.png',type:'screen',

            styleData:{display:'block',left:'424px',top:'46px','z-index':125},  //80px + 300
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0,debug:true},
            ani :{
                startScene:390,endScene:500,
                alpha:[{startScene:412,endScene:413,fade:false,length:2},{startScene:435,endScene:439,fade:true,length:4}] ,
                rotate:[{startScene:416,endScene:430,value:26,length:14}],

                scale:[

                    {startScene:416,endScene:430,value:0.08,length:14,scaleType:1}
                ]
            }

        });
        //손목시케를 손가락으로 클릭하는 손....이미지
        this.add({group:0,name:'s_48_9',src:'new/screen/01_right_hand_02.png',type:'screen',
            styleData:{display:'block',left:'80px',top:'500px','z-index':300},  //left 80 + top 200
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani : {
                startScene:400,endScene:450,
                translate:[
                    {startScene:405,endScene:410,y:-280,x:-20,length:5},
                    {startScene:412,endScene:428,y:300,x:500,length:15},
                 //   {startScene:416,endScene:430,y:0,x:250,length:14},
                    //{startScene:431,endScene:441,y:0,x:-200,length:10},

                ]

            }
        });




        //손목시계 새로운 1
        this.add({group:0,name:'s_48_1',src:'new/screen/03_gear.png',type:'screen',
            styleData:{display:'block',left:'347px',top:'98px','z-index':123},  //80px + 300
            default:{rotate:-5,moveX:0,moveY:0,scaleNum:0.840,alpha:0},
            ani : {
                startScene:400,endScene:500,
                alpha:[{startScene:419,endScene:420,fade:false,length:2},{startScene:453,endScene:454,fade:true,length:2}]  ,
                rotate:[{startScene:430,endScene:440,value:26,length:10}],
                translate:[
                    {startScene:440,endScene:450,y:28,x:58,length:10},
                ]

            }
        });
        //손목시계 새로운 2
        this.add({group:0,name:'s_351111',src:'new/screen/04_gear_1.png',type:'screen' ,
            styleData:{display:'block',left:'386px',top:'170px','z-index':123},  //80px + 300
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani :{
                startScene:400,endScene:500,
                alpha:[{startScene:450,endScene:470,fade:false,length:20}]  ,
            }



        });

//





          //마지막 핸드폰
        this.add({group:0,name:'s_32_1',src:'new/screen/04_note3_front2.png',type:'screen',
            styleData:{display:'block',left:'487px',top:'82px','z-index':124},  //80px + 300
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},

            ani :{
                startScene:430, endScene:500,
                alpha:[{startScene:430,endScene:431,fade:false,length:2}] ,
                translate:[{startScene:440,endScene:450,y:30,x:30,length:10}],
            }

        });



        this.add({group:0,name:'s_32_2',src:'new/screen/03_script_bg02.png',type:'screen',
            styleData:{display:'block',left:'795px',top:'260px','z-index':122},  //595px
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani :{
                startScene:430,endScene:500,
                translate :[{startScene:430,endScene:440,y:0,x:-160,length:10}]


            }
        });
        this.add({group:0,name:'s_32_3',src:'new/screen/03_note3_undershadow.png',type:'screen',
            styleData:{display:'block',left:'518px',top:'361px','z-index':122},  //595px
            default:{rotate:0,moveX:0,moveY:0,scaleNum:0.94,alpha:0},
            ani :{
                startScene:430,endScene:500,
                alpha:[{startScene:430,endScene:431,fade:false,length:2}] ,
            }

        });


        this.add({group:0,name:'s_32_4',src:'new/screen/03_gear_shadow.png',type:'screen',
            styleData:{display:'block',left:'400px',top:'366px','z-index':122},  //595px
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:0},
            ani :{
                startScene:430,endScene:500,
                alpha:[{startScene:430,endScene:431,fade:false,length:2}] ,
            }

        });



        this.add({group:0,name:'s_32_5',src:'new/screen/03_script_bg01.png',type:'screen',
            styleData:{display:'block',left:'-385px',top:'20px','z-index':122},  //25px 380
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani :{
                startScene:430,endScene:500,
             //   alpha:[{startScene:430,endScene:431,fade:false,length:2}] ,
                translate :[{startScene:430,endScene:450,y:0,x:405,length:20}]
            }

        });


        this.add({group:0,name:'s_32',src:'new/screen/03_title.png',type:'screen',

            styleData:{display:'block',left:'60px',top:'-500px','z-index':123},  //163 -500
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani :{
                startScene:430,endScene:500,
                //   alpha:[{startScene:430,endScene:431,fade:false,length:2}] ,
                translate :[{startScene:430,endScene:450,y:670,x:0,length:20}]
            }



        });




        this.add({group:0,name:'s_58',src:'new/screen/03_subtitle.png',type:'screen',

            styleData:{display:'block',left:'60px',top:'600px','z-index':123},  //255 600
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani :{
                startScene:430,endScene:500,
                translate :[{startScene:430,endScene:450,y:-345,x:0,length:20}]
            }

        });


        this.add({group:0,name:'s_47',src:'new/screen/03_bodyscript.png',type:'screen',

            styleData:{display:'block',left:'60px',top:'625px','z-index':123},  //280 -500
            default:{rotate:0,moveX:0,moveY:0,scaleNum:1,alpha:1},
            ani :{
                startScene:430,endScene:500,
                translate :[{startScene:430,endScene:450,y:-345,x:0,length:20}]
            }


        });























    }

    Galaxy.Data.prototype = {
        add : function(image) {
            DB.push(image);
            if (image.type) {
                switch(image.type) {
                    case 'menu':
                        MENU[image.name] = image;
                        break;
                    case 'screen':
                        if (!SCREEN[image.group]) SCREEN[image.group] = {};
                        SCREEN[image.group][image.name]  = image;
                        break;
                    case 'background':
                        BACKGROUND.push(image);
                        break;

                }
            }
        } ,

        length: function() {
            return DB.length;
        } ,
        getMenu: function() {
            return MENU;
        },
        getScreen: function(){
            return SCREEN;
        },
        getBackground: function(){
            return BACKGROUND;
        },
        get: function() {
            return DB;
        },
        _preLoadImage: function(image,controller) {


            var self=this;

            var img = new Image();
            var url = controller.basePath +'/'+image.src;
            var img_obj = img;


            $(img).bind('load error', function(e)
            {

                dataLoaded.push(img_obj);
                image.data = img_obj;
                if (dataLoaded.length>=DB.length) {

                    controller.makeWrap(true);
                }

                // $(this).unbind('load error');
            });

            img.src = url;

        },
        //read: function (imgs,callback) {
        read: function (callback,controller) {
            var scope = this;
            $.each(DB,function(i,image){

                scope._preLoadImage(image,controller);
            })

        }
    }
}).call(this);
