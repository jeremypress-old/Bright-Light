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
});
