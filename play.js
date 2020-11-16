jQuery(function () {
  var area = $('#area');
  var predelBottomHeight = area.height();
  var predelRightWidth = area.width();
  var boxColor = ['red', 'yellow', 'blue', 'green'];
  var boxWidth = 50; //px
  var boxHeight = 50; //px
  var seconds, stop;
  $('.boxes').each(function () {
    var scaleSize = Math.floor(Math.random() * 2) + 1;
    var posLeft = predelRightWidth - boxWidth * scaleSize;
    var posTop = predelBottomHeight - boxHeight * scaleSize;
    $(this).attr("points", scaleSize ).css({
      top: Math.floor(Math.random() * posTop),
      left: Math.floor(Math.random() * posLeft),
      width: boxWidth * scaleSize,
      height: boxHeight * scaleSize,
    });
  });

  function drag(event, ui) {
    var predelTopHeight = -$(this).height();
    var predelLeftWidth = -$(this).width();
    var points = $(this).attr("points");
    var point = parseInt( $('.result span').text() ) + parseInt( $(this).attr("points") );
    if (predelTopHeight > ui.position.top) {
      cutBox($(this));
      seconds = seconds + parseInt(points);
      $('.result span').text(point);
    }
    if (predelBottomHeight < ui.position.top) {
      cutBox($(this));
      seconds = seconds + parseInt(points);
      $('.result span').text(point);
    }
    if (predelLeftWidth > ui.position.left) {
      cutBox($(this));
      seconds = seconds + parseInt(points);
      $('.result span').text(point);
    }
    if (predelRightWidth < ui.position.left) {
      cutBox($(this));
      seconds = seconds + parseInt(points);
      $('.result span').text(point);
    }
  }

  $('#area .boxes').draggable({ drag })

  function cutBox(item) {
    let scaleSize = Math.floor(Math.random() * 2) + 1;
    let boxRandomColor = Math.floor(Math.random() * boxColor.length);
    let posLeft = predelRightWidth - boxWidth * scaleSize;
    let posTop = predelBottomHeight - boxHeight * scaleSize;
    item.remove();
    $('<div class="boxes" color="' + boxColor[boxRandomColor] + '" points="' + scaleSize + '"></div>')
      .css({
        top: Math.floor(Math.random() * posTop),
        left: Math.floor(Math.random() * posLeft),
        width: boxWidth * scaleSize,
        height: boxHeight * scaleSize,
      })
      .insertAfter('.boxes:last-child');
    $('#area .boxes').draggable({ drag });
  }
  

  $('.start_button').on( "click", function timer(){
      if( $('.result span').text() == '' || $('.seconds').text() == '0' ) { $('.result span').text(0); }
      $(this).prop("disabled", true);
      $('.end').hide();
      $('.stop_button').removeAttr("disabled");
      if( area.hasClass("start") ){ area.removeClass("start")}
      if( area.hasClass("shadow") ){area.removeClass("shadow")}
      
      if( $('.stop_seconds' ).text() !== '' && $('.stop_seconds' ).text() !== '0' ){
          seconds = parseInt( $('.stop_seconds').text() )
          $('.stop_seconds').text('')
          $('.seconds').text(stop)
      } else { 
          $('.seconds').text(5)
          seconds = parseInt($('.seconds').text() )
      }
      var int;
      int = setInterval(function() {
        if (seconds > 0) {
          seconds--;
          $('.seconds').text(seconds);
        } else {
          clearInterval(int);
          if( $('.stop_seconds').text() == '' ){$('.end').show();$('.end span').text('Ваш результат:' + $('.result span').text());}
          $('.start_button').removeAttr("disabled");
          $('.stop_button').prop("disabled", true);
          area.addClass("start");
        }
      }, 1000);
      $('.sub_form').removeAttr( "disabled" );
  });
  
    $('.stop_button').on( "click", function(){
        $('.start_button').removeAttr("disabled");
        $(this).prop("disabled", true);
        stop = parseInt($('.seconds').text())
        seconds = 0;
        $('.seconds').text('');
        $('.stop_seconds' ).text(stop);
        area.addClass("shadow");
    });
    $('.stop_button').prop("disabled", true);
    $('.table_res').hide();
  
    $('.sub_form').on( "click", function(){
        let s_pat = /^[a-zA-Z]+$/;
        if( $('input[type="text"]').val() == '' ){
            $('input[type="text"]').parent().addClass("empty");
        } else if( !s_pat.test( $('input[type="text"]').val() ) ) {
            $('input[type="text"]').parent().addClass("error_mes");
        }else{
            let ck = 'use';
            let cName = $('input[type="text"]').val();
            let cPoint = parseInt( $('.result span').text() );
            let cook = $.cookie( ck );
            if( cook ){
                let cr = cook.split('.');
                let cook_len = cook.length;
                let naw = false;
                let posName = 0;
                let new_res;
                $.each( cr, function(index,value){
                    let crv  = value.split('-');
                    let crvi = parseInt(crv[1]);
                    if( crvi < cPoint ) {
                        let pos_crvi = cook.indexOf(crv[0] + '-' + crvi);
                        if( pos_crvi == 0 ) {new_res = cName + '-' + cPoint + '.' + cook;}
                        if( pos_crvi > 0 ) { new_res = cook.substr(0, pos_crvi) + cName + '-' + cPoint + '.' + cook.substr(pos_crvi - cook_len); }
                        $.cookie( ck, new_res, { expires: 30, path: '/' });
                        return false;
                    } else if ( crvi == cPoint ) {
                        let pos_crvi = cook.indexOf(crv[0] + '-' + crvi);
                        new_res = cook.substr(0, pos_crvi) + cName + '-' + cPoint + '.' + cook.substr(pos_crvi - cook_len);
                    } else if ( crvi > cPoint ){
                        new_res = cook + '.' + cName + '-' + cPoint;
                        $.cookie( ck, new_res, { expires: 30, path: '/' });
                    }
                });
            } else {
                let p = cName + '-' + cPoint;
                $.cookie( ck, p, { expires: 30, path: '/' });
            }
            printRes();
            $('.end').hide();
            $('.table_res').show();
            
        }
    });
    
    $('input[type="text"]').focus( function(){
        if( $(this).parent().hasClass("empty") ) { $(this).parent().removeClass("empty"); }
        if( $(this).parent().hasClass("error_mes") ) { $(this).parent().removeClass("error_mes"); }
    });
    $.removeCookie('use');
    
    function printRes(){
        $('.table_res div').remove();
        $('.table_res').hide();
        let tabRes = $.cookie('use').split('.');
        $.each( tabRes, function(index,value){
            let tr  = value.split('-');
            $('.table_res').append( '<div class="row"><div class="col-sm-6">'+tr[0]+'</div><div class="col-sm-6">'+tr[1]+'</div></div>' );
            if( index > 8 )
                return false;
        })
    }
})

