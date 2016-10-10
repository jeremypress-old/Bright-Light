$( document ).ready(function() {
  $('#toggle_power').on('click', function() {
    $.ajax({ //add some kind of data!
      type: "POST",
      url: '/api/toggle_power',
      data: {'data': 'power'},
      success: function (data) {
        console.log('hi')
      },
      error: function (jqXHR, textStatus, errorThrown) {
             console.log('error ' + textStatus + " " + errorThrown);
      }
    });
  });

  $('#set_timer').on('click', function() {
    var time = $('#time').val();
    //var power = $('#timer_power').val();
    console.log('clicked');
    $.ajax({ //add some kind of data!
      type: "POST",
      url: '/api/set_timer',
      data: {'time': time},
      success: function (data) {
        console.log('success');
        updateTimer(time * 60);
        $('.timer-display').text(time * 60)
      },
      error: function (jqXHR, textStatus, errorThrown) {
             console.log('error ' + textStatus + " " + errorThrown);
      }
    });
  });

  $('#set_color').on('click', function() {
      console.log('clicked');
      $.ajax({ //add some kind of data!
        type: "POST",
        url: '/api/set_color',
        data: {'color': "color"},
        success: function (data) {
          console.log('success');
        },
        error: function (jqXHR, textStatus, errorThrown) {
               console.log('error ' + textStatus + " " + errorThrown);
        }
      });

  })

  function updateTimer(time) {
    setInterval(function() {
      console.log(time)
      var timer = $('.timer-display');
      if (time === 0) {
          timer.text(0);
        clearInterval();
      } else {
          time -= 1;
          timer.text(time)
      }
    }, 1000);
  }
});
