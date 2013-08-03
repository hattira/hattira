function showMap(address) {
  var pos, mapOptions, map, marker;
  pos = new google.maps.LatLng(address.latitude, address.longitude);
  mapOptions = {
    zoom: 7,
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
  $('#startDate').datetimepicker({ format: 'yyyy-mm-dd hh:ii' });
  $('#endDate').datetimepicker({ format: 'yyyy-mm-dd hh:ii' });

  $('#citySearch').typeahead({
    source: function (query, process) {
      return $.get('/cities/search/'+query, function(data) {
        return process(data)
      })
    }
  })
});
