/*
* Mmenu jQuery plugin init
*/
$(".header .menu").clone().appendTo(".menu-mobile");

$(".menu-mobile").mmenu({
  navbar: {
    title: "Школа пилотов"
  }
});

var API = $(".menu-mobile").data( "mmenu" );

$(".menu-toggle").click(function() {
   API.open();
});

/*
* Comment
*/
$('.comment-form-comment textarea').on('change', function()
{
  if($(this).val())
    $(this).addClass('comment-dirty');
  else
    $(this).removeClass('comment-dirty');
});

/*
* Fancybox
*/

// set rel attribute

$('.gallery').each(function(index)
{
	var id = $(this).attr('id');
	$(this).find('a').attr('rel', id);
});

// init

$('.gallery a').fancybox(
{
	padding : 0,
	beforeShow : function() 
	{
    var alt = this.element.find('img').attr('alt');
    this.inner.find('img').attr('alt', alt);
    this.title = alt;
  },
  helpers : 
  {
    overlay : 
    {
      css : 
      {
        'background' : 'rgba(32, 32, 60, 0.85)'
      }
    }
  }
});

/*
* Gallery fold
*/

$('.gallery').each(function(idx, gallery)
{
  if($(gallery).find('.gallery-item').length > 9)
  {
    console.log('Need fold');
  }
});

/*
* Min Width Shadow jQuery plugin
*/

(function ( $ ) {

  function refresh(element)
  {
    var wrapper = element.closest('.shdwtab__wrap'),
        wrapperWidth = wrapper.width(),
        table = wrapper.children(),
        tableWidth = table.width(),
        leftShadow = wrapper.siblings('.shdwtab__shad_lt'),
        rightShadow = wrapper.siblings('.shdwtab__shad_rt'),
        scrollLeft = wrapper.scrollLeft(),
        scrollRight = tableWidth - scrollLeft - wrapperWidth,
        visibleClass = 'shdwtab__shad_visible';

    // Left shadow
    if(scrollLeft > 5){
      leftShadow.addClass(visibleClass)
      leftShadow.css({'opacity' : scrollLeft / 100})
    }else{
      leftShadow.removeClass(visibleClass)
      leftShadow.css({'opacity' : ''})
    }

    // Right shadow
    if(scrollRight > 5){
      rightShadow.addClass(visibleClass)
      rightShadow.css({'opacity' : scrollRight / 100})
    }else{
      rightShadow.removeClass(visibleClass)
      rightShadow.css({'opacity' : ''})
    }
  }

  var methods = 
  {
    init: function()
    {
      return this.each(function()
      {
        var $this = $(this),
            data = $this.data('shadow');

        if(data) return true;

        /* Template */
        var shadowWrap =  '<div class="shdwtab">'
                            + '<div class="shdwtab__shad shdwtab__shad_lt"></div>'
                            + '<div class="shdwtab__shad shdwtab__shad_rt"></div>'
                            + '<div class="shdwtab__wrap"></div>'
                        + '</div>';
        
        /* Add template */
        $(shadowWrap)
          .insertBefore($this)
          .find('.shdwtab__wrap')
          .on('scroll', function() 
          { 
            refresh($this); 
          })
          .append($this);
        
        // TODO: this init one and global
        $(window).on('resize', function() 
        {
          refresh($this);
        });  

        /* Init */
        refresh($this.closest('.shdwtab__wrap'));

        $this.data('shadow', {
          target: $this
        });
      })
    },
    refresh: function()
    {
      return this.each(function()
      {
        var $this = $(this),
            data = $this.data('shadow');
            refresh($this);
      });
    }
  }

  /*
  * jQuery interface
  */

  $.fn.minWidthShadow = function(method)
  {
    if(methods[method])
    {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else if(typeof method === 'object' || ! method)
    {
      return methods.init.apply(this, arguments);
    }
    else
    {
      $.error('The method ' + method + ' does not exist on jQurey.minWidthShadow');
    }
  };
}( jQuery ));

$('table').minWidthShadow();

/*
* Fly plavces
*/

function widgetRender(element)
{
  var config = element.data('widgets');

  if(config && config.rendered) return;

  for(name in config)
  {
    switch(name)
    {
      case 'meteo':
        var widget_meteo = $('<a href=' + config[name].link + ' title="Подробный прогноз погоды" target="_blank"><img src=' + config[name].img + 'alt="" width="120" height="60" border="0" /></a>');

        widget_meteo.appendTo('#' + $(element).data('place') + ' .places-contents-widget__item_' + name);

        break;

      case 'winguru':
        var id = $(element).data('place') + '-winguru';
        var widget_winguru = $('<div style="min-width:724px" class="winguru"><div id="' + id + '"></div></div>');

        widget_winguru.appendTo('#' + $(element).data('place') + ' .places-contents-widget__item_' + name);

        WgWidget(config[name], id);

        widget_winguru.minWidthShadow();

        var timer = setInterval(function() 
        {
          if($(widget_winguru).find('.wgfcst')) 
          {
            widget_winguru.minWidthShadow('refresh'); 
            clearInterval(timer);
          }
        }, 100);

        break;

      case 'gismeteo':
        if(!window.is_init_gismeteo)
        {
          window.is_init_gismeteo = true;
          $("head").append($('<link rel="stylesheet" type="text/css" href="https://nst1.gismeteo.ru/assets/flat-ui/legacy/css/informer.min.css">'));
        }

        var gmHash = config[name].hash,
            gmUrl = config[name].url,
            gmId = 'gsInformerID-' + gmHash,
            gmName = element.find('span').text()

        var widget_gismeteo = '<div id="' + gmId + '" class="gsInformer" style="width:275px;height:174px"><div class="gsIContent"><div id="cityLink"><a href="https://www.gismeteo.ru/' + gmUrl + '/" target="_blank">Погода в ' + gmName + '</a></div><div class="gsLinks"><table><tr><td><div class="leftCol"><a href="https://www.gismeteo.ru/" target="_blank"><img alt="Gismeteo" title="Gismeteo" src="https://nst1.gismeteo.ru/assets/flat-ui/img/logo-mini2.png" align="middle" border="0" /><span>Gismeteo</span></a></div><div class="rightCol"><a href="https://www.gismeteo.ru/' + gmUrl + '/2-weeks/" target="_blank">Прогноз на 2 недели</a></div></td></tr></table></div></div></div>';
        var widget_gismeteo_script = '<script async src="https://www.gismeteo.ru/api/informer/getinformer/?hash=' + gmHash + '" type="text/javascript"></script>';

        $(widget_gismeteo + widget_gismeteo_script).appendTo('#' + $(element).data('place') + ' .places-contents-widget__item_' + name);

        break;
    }
  }

  config = {};
  config.rendered = true;

  element.data('widgets', config);
}

if($('#fly-places'))
{
  var hash = getHash();

  if(hash['place'])
  {
    setPlace($('.places-tabs__item[data-place="' + hash['place'] + '"]'));
  }
  else
  {
    setPlace($('.places-tabs__item_active'));
  }

  $('.places-tabs__item').on('click', function()
  {
    setPlace($(this));
  });
}

function setPlace(place)
{
  if(place.hasClass('places-tabs__item_active') && place.data('widgets').rendered) return;

  widgetRender(place);

  var hash = getHash(),
      placeId = place.data('place');

  $.extend(
    hash, 
    {
      'place': placeId
    });
  
  setHash(hash);

  $('.places-tabs__item').removeClass('places-tabs__item_active');
  place.addClass('places-tabs__item_active');

  $('.places-contents__item').removeClass('places-contents__item_active');
  $('#' + place.data('place')).addClass('places-contents__item_active');
}

function setHash(properties)
{
  var hash = [];

  for(var key in properties)
  {
    hash.push(key + '=' + properties[key]);
  }

  hash = '#' + hash.join('&');
  location.hash = hash;

  return properties;
}

function getHash()
{
  var unSerialize = {},
      hashString = location.hash.substr(1),
      hashArray = hashString.split('&');

  for(index in hashArray)
  {
    var hash = hashArray[index].split('=');

    if(hash[0] && hash[1])
    {
      unSerialize[hash[0]] = hash[1];
    }
  }

  return unSerialize;
}

