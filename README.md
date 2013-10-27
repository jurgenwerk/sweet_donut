Sweet Donut
===========

A simple jQuery plugin for making sweet ass donut charts on HTML5 Canvas elements! Unfortunately, it does not include a legend/annotations YET, so you'll have to code it by yourself. 

Written in CoffeeScript, but there is also a plain JS version for those who don't believe in CoffeeScript's magical powers.


It is certainly not very hard to use this plugin.


1. Stick a canvas element somewhere in your code:

```
  <canvas id="donut-chart" width="300" height="300"></canvas>
```

2. Define some data and draw the donut on your canvas:

```
$(document).ready(function() {
	  var props;
	  props = {
	    "data": [2,7,4,5,10, 2,6,5],
	    "shade_factor": "-14", // OPTIONAL. It defines the color shadiness on the inner donut edge.
	    "shade_area_percent": "0.31", //OPTIONAL. It defines the width of shady area.
	    "inner_area_factor": "0.5" //OPTIONAL. It defines how big the inner blank circle is. 
	  };

	  $('#donut-chart').drawDonut(props);
	});
```
3. ???
4. Profit!

Here are some examples of rendered donuts:

![](https://raw.github.com/matixmatix/sweet_donut/master/rendered%20examples/1.PNG)
![](https://raw.github.com/matixmatix/sweet_donut/master/rendered%20examples/2.PNG)
![](https://raw.github.com/matixmatix/sweet_donut/master/rendered%20examples/3.PNG)
![](https://raw.github.com/matixmatix/sweet_donut/master/rendered%20examples/4.PNG)
