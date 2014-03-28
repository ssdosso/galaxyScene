
(function($, undefined ) {



    $.widget( "Cho.Galaxy", {
        basePath: '',
        sceneMng: null,
        sceneTotal: 470,
        randered:false,
        winEvent: false,
        popup: false,
        _create: function() {
           $.extend(this,this.options);
             var scope = this;
            if(!$.isArray(this.images)) {
                console.log('로딩 이미지 옵션이 잘못 되었습니다.')
            }


            this.element.css({'width':this.width});
            this.element.css({'height':this.height});



            scope.crateCanvas();

            $('.close').click(function(){
                $('.journeyContent').append($(".journeyGroup"));
            });
            $('.journeyImg').click(function(){

                $('.popBg').fadeIn();
                $('.pop_journey').show();

                $('.pop_journey .wrap').append($(".journeyGroup"));
                scope.popup = true;
                $(".journeyGroup").show();
            });

            $(window).resize(function(){
                var w = $(window).width();
                if (w <= 1024) {

                } else {


                }
            });

        },

        crateCanvas: function() {
            this.randered = true;
            var width = $('.journeyContent').width();

            var loadingBar = "<div id='div_loading1' style='position: absolute;  background-color: #323232; z-index: 1000000;"+
                "width: " + this.width + "px; height: 100%;text-align: center;'></div>";

            var loadingBar = "<div id='div_loading1' style='position: absolute;  background-color: #323232; z-index: 1000000;"+
                "width: " + this.width + "px; height: 559px;text-align: center;'></div>";

            this.element.append(loadingBar);

            var position = {left:this.width/2,top:this.height/2}
            var loadimge = "<img src='"+this.basePath+"/ajax-loader.gif' style='position: absolute; left: " + position.left + "px; top:"  + position.top + "px;/'>";

            $('#div_loading1').append(loadimge);

            this._preResourcesLoad();

        },
        getBackground: function(){

            return this._galaxyData.getBackground();
        },
        getScreen: function(){
            return this._galaxyData.getScreen();
        },
        getMenu: function() {
          return this._galaxyData.getMenu();
        },
        _preResourcesLoad : function(){
            var self = this;
            this._galaxyData = new Galaxy.Data({});
            this._galaxyData.read(function(){},this);


          //  $.each(images,function(index,image){

                     //self._imgpreload(this.basePath+'/'+image,function(){
                   // self._makeWrap();

           // });

        },
        setDurationTime: function(durationTime) {
            this.element.trigger('setDurationTime',[durationTime]);
        },
        playMovie: function(start,end) {
           this.sceneMng.playMovie(start,end);
        },
        /**
         * 어떤 이유에서든지 해당 스크롤 이벤트 혹은 클릭 이벤트 발생시 발생하게 했다.
         * @param sceneNumber
         */
        selectScene: function(sceneNumber,scrollType,scollChangeEvent){
            // this.bind

             this.element.trigger('playScene',[sceneNumber,scrollType,scollChangeEvent]);
        },
        makeWrap: function(dateload){

            //데이터를 모두 처리되고 기본 layout 을 잡는다.
            var groupElement = 'journeyGroup';
            $( "#div_loading1" ).remove();


            this.element.append('<div class="'+groupElement+'" id="ie9_next"><div class="scrollArea" style="height:438px"><div class="screen"></div></div></div>');
            $('.'+groupElement).append('<div class="scrollFocus"></div>');
            $('.'+groupElement).append('<ul class="navi"></ul>');
            $('.scrollFocus').Mover(
                {
                    controller:this
                }
            );
            $('.navi').Navigation({
                controller: this
            });

            $('.screen').GalaxyCanvas({
                controller:this
            });

            this.sceneMng = new Galaxy.Scene(
                {
                    sceneTotal : this.sceneTotal, // 씬 총길이는 200
                    controller: this
                }

            );

        }






    });



})( jQuery );

















