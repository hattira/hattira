function showVenueMap(address) {
  var pos = new google.maps.LatLng(address.latitude, address.longitude);
  var mapOptions = {
    zoom: 13,
    center: pos,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  var marker = new google.maps.Marker({
    position: pos,
    map: map
  });

  var info = '<p><b>'+address.venue+'</b></p>';
  var infoWindow = new google.maps.InfoWindow({
    content: info
  })

  google.maps.event.addListener(marker, 'click', function() {
      infoWindow.open(map,marker);
  });
}

$(document).ready(function () {
  $('#startDate').datetimepicker();
  $('#endDate').datetimepicker();
  $('#attending').submit(function(e) {
    var id = $(this.meetup_id).val()
      , csrf = $(this._csrf).val()
    e.preventDefault()

    $.ajax({
      url: '/meetups/'+id+'/attending',
      type: 'PUT',
      data: {_csrf: csrf},
      dataType: "json",
      success: function(result) {
        var node = $('#feedback-box')
        node.html(result.message).removeClass('hide')
        if (result.status === 'ok') {
          node.addClass('alert-success')
          location.reload()
        } else {
          node.addClass('alert-danger')
        }
      }
    })
  })
});
