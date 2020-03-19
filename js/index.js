$(function () {

  //基础路径
  var baseUrl = './images/';

  //配置天气图标
  var weatherIcons = {

    yun: {
      title: '多云',
      icon: 'yun.png'
    },

    qing: {
      title: '晴',
      icon: 'qing.png'
    },

    lei: {
      title: '雷阵雨',
      icon: 'lei.png'
    },

    yu: {
      title: '小雨',
      icon: 'xiao.png'
    },

    //未知天气的默认图标
    default: {
      title: '未知',
      icon: ''
    }
  }

  //获取天气数据
  function getWeatherData(city) {

    var data = {
      appid: '34761866',
      appsecret: 'WbfE5Kn6',
      version: 'v6',
    };

    if (city !== undefined) {
      data.city = city;
    }

    $.ajax({
      type: 'GET',
      url: 'https://www.tianqiapi.com/api',
      data: data,
      dataType: 'jsonp',
      success: function (data) {
        // console.log('data ==> ', data);
        //获取定位位置
        $('.location-city').text(data.city);

        //绑定实况天气数据
        var weatherData = ['date', 'week', 'tem', 'wea', 'air_level', 'win', 'win_speed', 'win_meter'];

        for (var i = 0; i < weatherData.length; i++) {
          if (weatherData[i] === 'wea') {
            $('.' + weatherData[i]).css({
              backgroundImage: 'url(' + baseUrl + (weatherIcons[data.wea_img] == undefined ? weatherIcons.default : weatherIcons[data.wea_img]).icon + ')',
            });
          } else {
            $('.' + weatherData[i]).text(weatherData[i] === 'tem' ? data[weatherData[i]] + '℃' : data[weatherData[i]]);
          }

        }


        //获取24小时天气和未来6天天气
        var params = {
          appid: '34761866',
          appsecret: 'WbfE5Kn6',
          version: 'v9'
        };

        if (city !== undefined) {
          params.city = city;
        }

        $.ajax({
          type: 'GET',
          url: 'https://www.tianqiapi.com/api',
          data: params,
          dataType: 'jsonp',
          success: function (result) {
            console.log('result ==> ', result);

            //绑定24小时天气数据
            var hoursWeatherData = result.data[0].hours;

            $.each(hoursWeatherData, function (i, v) {

              var $li = $(`<li>
                      <div>${v.hours}</div>
                      <div class="hours-weather-icon" style="background-image: url('${baseUrl + (weatherIcons[v.wea_img] == undefined ? weatherIcons.default : weatherIcons[v.wea_img]).icon}')"></div>
                      <div>${v.tem}℃</div>
                      <div>${v.win}</div>
                    </li>`);
              $('#hoursWeather').append($li);
            })

            //未来6天天气
            var futureWeatherData = result.data.slice(1);

            console.log('futureWeatherData ==> ', futureWeatherData);

            $.each(futureWeatherData, function (i, v) {
              var $li = $(`<li class="clearfix">
                        <span>${v.day.replace(/（星期[一二三四五六日]）/, '')}</span>
                        <span>
                          <i class="future-weather-icon" style="background-image: url('${baseUrl + (weatherIcons[v.wea_img] == undefined ? weatherIcons.default : weatherIcons[v.wea_img]).icon}')"></i>
                        </span>
                        <span>${v.tem2 + '℃ ~' + v.tem1 + '℃'}</span>
                        <span class="w-dir">${v.win[1]}</span>
                      </li>`);
              $('#futureWeather').append($li);
            })

          }
        })

      }
    })
  }

  getWeatherData();

  //搜索
  $('.search-icon').on('click', function () {
    //获取搜索城市
    var city = $('.search-ipt').val();

    if (city == undefined || city.trim() == '') {
      return;
    }

    console.log(city);

    $('#hoursWeather,#futureWeather').empty();

    getWeatherData(city);

  })
})