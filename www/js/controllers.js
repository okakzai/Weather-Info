/* globals angular */

angular.module("openweather.controllers", ["ngOpenWeatherMap", "ngGeoLocation"])

.controller("AppCtrl", function($scope) {

  $scope.openLink = function(url) {
    if (typeof navigator !== "undefined" && navigator.app) {
        // Mobile device.
        navigator.app.loadUrl(url, {openExternal: true});
    } else {
        // Possible web browser
        alert(url);
        window.open(url, "_blank");
    }
  };

  
})

.controller('HomeCtrl', function($scope, owmApi, $localstorage) {

  $scope.options = null;
  $scope.loading = false;
  $scope.error = null;
  $scope.location = null;

  $scope.doRefresh = function() {
    $scope.loading = true;
    $scope.error = null;

    var options = $localstorage.getObject("options")
      || { city : "New York", units: "metric" };
    $scope.options = options;
    
    owmApi.getForecast5Days(options.city, options.units, options.appId).
      success(function(data, status, headers, config) {
        
        $scope.location = data.city;
        var grouped = {};
        
        var utcOffsetMs = (new Date()).getTimezoneOffset() * 60000;
        
        angular.forEach(data.list, function(dataItem) {
          dataItem.wind.speedKmH = dataItem.wind.speed * 3600 / 1000;
          // dt is a unix time with UTC/GMT time zone
          dataItem.date = new Date(dataItem.dt * 1000 + utcOffsetMs);
          dataItem.day = new Date(dataItem.dt * 1000 + utcOffsetMs);
          dataItem.day.setHours(0,0,0,0);
          
          var hours = dataItem.date.getHours();
          
          if (hours >= 0 && hours < 6){
              dataItem.dayPeriod = "NIGTH";
          }
          else if (hours >= 6 && hours < 12){
              dataItem.dayPeriod = "MORNING";
          }
          else if (hours >= 12 && hours < 18){
              dataItem.dayPeriod = "AFTERNOON";
          }
          else if (hours >= 18 && hours < 24){
              dataItem.dayPeriod = "EVENING";
          }

          grouped[dataItem.day] = grouped[dataItem.day] || {items: [], dayDate: dataItem.day};
          grouped[dataItem.day].items.push(dataItem);
        });
        
        $scope.days = [];
        angular.forEach(grouped, function(value, key) {
          $scope.days.push(value);
        });
        
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        $scope.error = data;
      })
      .finally(function() {
         // Stop the ion-refresher from spinning
         $scope.$broadcast('scroll.refreshComplete');
         $scope.loading = false;
       });
  };
  
  $scope.doRefresh();
})

.controller('OptionsCtrl', function($scope, $log, $localstorage, $state, geoLocation) {
  
  $scope.options =
    $localstorage.getObject("options")
    || { city : "New York", units: "metric" };
  
  $scope.save = function() {
    $localstorage.setObject("options", $scope.options);
    
    $state.go('app.home', {}, {location: 'replace', reload: true});
  };
  
  $scope.setCurrentLocation = function() {
    geoLocation.getCity()
    .then(function(city){
      $scope.options.city = city;
    },
    function(err){
      alert(err);
    });
  };
  
})

.controller('AboutCtrl', function($scope, $log, $localstorage, $state) {
  

});

