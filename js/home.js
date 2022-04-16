
$(function() { 
    $("#results").hide();
    requestButtonClick();
});

function requestButtonClick() {
   $('#requestButton').click(function (e) {
        e.preventDefault();

        //$("#results").hide();
        reset();
        if(!validate()) {
            $("#error").html("<div class='alert alert-danger' id='errorZip'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>Zipcode must contain 5 numbers, the Zipcode entered contains " + $("#zcode").val().toString().length);
            return;
        }

        var speedSymbol = " miles/hour";
        var tempSymbol = " &deg;F";

        if($('#units').val() == 'Metric') {
            speedSymbol = " km/hour";
            tempSymbol = " &deg;C";
        }
            $.ajax({
                type: "GET",
                url: "http://api.openweathermap.org/data/2.5/forecast?zip=" + $("#zcode").val() + "&appid=6d3a9efa3a42ac6de001c404ff76373a&units=" + $('#units').val(),
                success: function (data) {
                    $("#error").hide();
                    $("#results").show();

                    $('#conditions-left1').html('<img src="http://openweathermap.org/img/w/' + data.list[0].weather[0].icon + '.png?6d3a9efa3a42ac6de001c404ff76373a height="64px" width="64px">');
                    $('#conditions-left').html(data.list[0].weather[0].main + ': ' + data.list[0].weather[0].description);
                    $('#conditions-title').html('Current Conditions in ' + data.city.name);
                    $('#conditions-temp').html(data.list[0].main.temp + tempSymbol);
                    $('#conditions-humidity').html('<p>Humidity: <strong>' + data.list[0].main.humidity + '%</strong></p>');
                    $('#conditions-wind').html('<p>Wind: <strong>' + data.list[0].wind.speed + speedSymbol + '</strong></p>');

                    $('#forecast-title').append('Five Day Forecast');

                    var tmp_min = [];
                    var tmp_max = [];

                    var min = 1000.00;
                    var max = -1000.00;

                    var weatherIcon = [];
                    var weatherDescription = [];
                    var date = [];

                    $.each(data.list, function(index, val){
                        if(val.main.temp_max > max) {
                            max = val.main.temp_max;
                        }
                        if(val.main.temp_min < min) {
                            min = val.main.temp_min;
                        }

                        if(index % 8 === 0 || index === 0) {
                            weatherIcon.push("http://openweathermap.org/img/w/" + val.weather[0].icon + ".png?6d3a9efa3a42ac6de001c404ff76373a");
                            weatherDescription.push(val.weather[0].main);
                            tmp_min.push(min);
                            tmp_max.push(max);
                            min = 1000;
                            max = -1000;
                            var d = new Date(val.dt * 1000).toLocaleString("en-us", {month: 'long', day: 'numeric'});
                            date.push(d);
                        }
                    });

                    for(var i = 0; i < 5; i++) { 
                        $('#day' + (i + 1)).append('<hr><p>' + date[i] + '</p><hr>');
                        $('#day' + (i + 1)).append('<img src="' + weatherIcon[i] + '" height="64px" width="64px">');
                        $('#day' + (i + 1)).append(" <p>" + weatherDescription[i] + '</p>');
                        $('#day' + (i + 1)).append('<hr><p>H ' + tmp_max[i] + tempSymbol + ' L ' + tmp_min[i] + tempSymbol + '</p>');
                    }
                },
                error: function () {
                     $("#error").html("<div class='alert alert-danger' id='errorZip'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>This Zip code does not exist");
                }
           });
        });
    }

    function reset() {
        $('#forecast-title').empty();
        $('#conditions-left').empty();
        $('#conditions-right').empty();

        for(var i = 0; i < 5; i++) {
            $('div#day' + (i + 1)).empty();
        }
    }
  
    function validate() {
        if ($("#zcode").val().toString().length !== 5) {
            return false;
        }
        return true

    }

