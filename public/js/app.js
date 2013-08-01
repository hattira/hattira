function showMap(lat, lon) {
  var mapOptions = {
    center: new google.maps.LatLng(lat, lon),
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}

$(document).ready(function () {

  $('#startDate').datetimepicker({ format: 'yyyy-mm-dd hh:ii' });
  $('#endDate').datetimepicker({ format: 'yyyy-mm-dd hh:ii' });

  //google.maps.event.addDomListener(window, 'load', initialize);

});
