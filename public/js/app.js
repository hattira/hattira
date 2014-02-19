function showVenueMap(address) {
  var pos, mapOptions, map, marker;
  pos = new google.maps.LatLng(address.latitude, address.longitude);
  mapOptions = {
    zoom: 8,
    center: pos,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  marker = new google.maps.Marker({
    position: pos,
    map: map,
    title: address.venue
  });
}

$(document).ready(function () {
  $('#startDate').datetimepicker();
  $('#endDate').datetimepicker();
  $('#marketing').carousel({interval: 5000})

  $('#citySearch').typeahead({
    remote: {
      replace: function() {
        return '/cities/search/'+ $('#citySearch').val()
      }
    },
    limit: 10
  })

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

  $('#share').submit(function(e) {
    var id = $(this.meetup_id).val()
      , csrf = $(this._csrf).val()
    e.preventDefault();

    $.ajax({
      url: '/meetups/'+id+'/share',
      type: 'PUT',
      data: {_csrf: csrf},
      dataType: "json",
      success: function(result) {
        var node = $('#feedback-box')
        node.removeClass('hide')
        if (result.status === 'ok') {
          node.html("Updated Facebook successfully").addClass('alert-success')
        } else {
          node.html(result.message.message).addClass('alert-danger')
        }
      }
    })
  })
});
