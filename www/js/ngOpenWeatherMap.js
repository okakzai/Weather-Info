/* globals angular */

angular.module("ngOpenWeatherMap", [])

.factory("owmApi", function($http, $q) {
    var url = "http://api.openweathermap.org/data/2.5/forecast";
    
    function getForecast5Days(city, units, appId){
        var params = { 
            q: city, 
            units: units 
        };
        
        if (appId) {
            params.APPID = appId;
        
        }else{
			params.APPID ='7281b3bbc99896e5db79c8aed22af4cf';
		}
        
        return $http.get(url, { params : params } );
    }
    
    return {
        getForecast5Days : getForecast5Days   
    };
});