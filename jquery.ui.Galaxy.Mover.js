/**
 * Created with JetBrains WebStorm.
 * User: Monoshift
 * Date: 13. 10. 11
 * Time: 오전 11:00
 * To change this template use File | Settings | File Templates.
 */

(function($, undefined ) {
    $.widget( "Cho.Mover", {

        controller : null,
        durationTime: null,
        transition: '200ms',
        webkit_transform:{x:'-732px',y:'0px'},
        _create: function() {
            $.extend(this,this.options);
            this.scrollWidth = 754;
            if (this.controller == null) {
                console.log('controller 가 존재 하지 않습니다.');
            }

            this.durationTime = 300;
            this.setDurationTime();
             this.element.append('<div class="mover""><img src="'+this.controller.basePath+'/galaxymusic/journey_scrollfocus.gif" alt="스크롤상태바"><div>');
             this._setDefalut();


        },
        setDurationTime: function() {

            $('.mover').css('-moz-transition-duration',this.durationTime+'ms');
            $('.mover').css('-webkit-transition-duration',this.durationTime+'ms');
            $('.mover').css('-ms-transition-duration',this.durationTime+'ms');
        },
        _setDefalut: function() {
           var scope = this;
           $('.mover').css(
               'transform','translate('+this.webkit_transform.x+','+this.webkit_transform.y+')'
           );

            this.controller.element.on("setDurationTime", function(event,setDurationTime){
                scope.durationTime =  setDurationTime;

                scope.setDurationTime();

            });
            this.controller.element.on("playScene", function(event,scene){
                scope.playScene(scene);
            });
        },
        pcel:function($n1,$n2,$hg){ //--비례식
            // --  hg비교값( 0부터 시작 ), n2변환값 , n1요청값
            //     hg가 n2 와 같다면 , n1은 몇 인가?  hg와 n1은 같은 비례이며 n2의 형식으로 구하여라.
            return  ($hg/$n2)*$n1;
        },
        playScene: function(scene){

            var smNum = this.pcel(scene,this.controller.sceneTotal,this.scrollWidth-22) - this.scrollWidth+22;

            $(".mover").css("transform","translate("+smNum+"px,0px)");
        }
    });

})(jQuery);
