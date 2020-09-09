# Data

The data include daily bike rental counts (by members and casual users) of Capital Bikeshare in Washington, DC in 2011 and 2012 as well as weather information on these days.

The original data sources are http://capitalbikeshare.com/system-data and http://www.freemeteo.com.

The codebook is below:

| Variable name    | Description 
|:--------|:-------------------------------------------------------------
| `instant`		| record index
| `dteday` 		| date
| `season` 		| season (1:winter, 2:spring, 3:summer, 4:fall)
| `yr` 		    | year (0: 2011, 1:2012)
| `mnth` 		  | month (1 to 12)
| `holiday` 	| whether day is holiday or not (extracted from http://dchr.dc.gov/page/holiday-schedule)
| `weekday` 	| day of the week
| `workingday`| if day is neither weekend nor holiday is 1, otherwise is 0.
| `weathersit`| 1: Clear, Few clouds, Partly cloudy, Partly cloudy
|             | 2: Mist + Cloudy, Mist + Broken clouds, Mist + Few clouds, Mist
|             | 3: Light Snow, Light Rain + Thunderstorm + Scattered clouds, Light Rain + Scattered clouds
|             | 4: Heavy Rain + Ice Pallets + Thunderstorm + Mist, Snow + Fog
| `temp` 			| Normalized temperature in Celsius. The values are divided by 41 (max)
| `atemp`			| Normalized feeling temperature in Celsius. The values are divided by 50 (max)
| `hum` 			| Normalized humidity. The values are divided by 100 (max)
| `windspeed`	| Normalized wind speed. The values are divided by 67 (max)
| `casual`		| Count of casual users
| `registered`| Count of registered users
| `cnt` 		  | Count of total rental bikes including both casual and registered