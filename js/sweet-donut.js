var DonutGrapher;

$.fn.drawDonut = function(props) {
  var donutGrapher;
  donutGrapher = new DonutGrapher($(this), props);
  return donutGrapher.drawDonutChart();
};

DonutGrapher = (function() {
  var degreesToRadians, shadeColor, sumTo;

  function DonutGrapher(canvas, props) {
    var color;
    this.canvas = canvas[0];
    this.props = props;
    this.data = props["data"];
    this.colors = this.getProperty("colors", this.getRandomColors(this.data.length));
    this.shade_factor = parseFloat(this.getProperty("shade_factor", -12));
    this.shade_area_percent = parseFloat(this.getProperty("shade_area_percent", 0.32));
    this.colors_small = this.getProperty("colors_small", (function() {
      var _i, _len, _ref, _results;
      _ref = this.colors;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        color = _ref[_i];
        _results.push(shadeColor(color, this.shade_factor));
      }
      return _results;
    }).call(this));
    this.innerAreaFactor = parseFloat(this.getProperty("inner_area_factor", 0.5));
  }

  DonutGrapher.prototype.getProperty = function(property, default_value) {
    if (this.props[property] != null) {
      return this.props[property];
    } else {
      return default_value;
    }
  };

  DonutGrapher.prototype.defaultColors = function() {
    return ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];
  };

  DonutGrapher.prototype.getRandomColors = function(n) {
    var colorsLeftToChoose, i, randomColorIndex, randomColors;
    randomColors = [];
    colorsLeftToChoose = this.defaultColors();
    i = 0;
    while (i < n) {
      randomColorIndex = Math.floor(Math.random() * colorsLeftToChoose.length);
      randomColors.push(colorsLeftToChoose[randomColorIndex]);
      colorsLeftToChoose.splice(randomColorIndex, 1);
      i++;
    }
    return randomColors;
  };

  DonutGrapher.prototype.drawDonutChart = function() {
    var angle, center, context, data_normalized, data_sum, emptyData, i, radius, radius_small, startingAngles, _results;
    context = this.canvas.getContext("2d");
    center = radius = this.canvas.width / 2;
    radius_small = Math.round(this.shade_area_percent * radius * 2);
    data_sum = this.data.reduce(function(x, y) {
      return x + y;
    });
    emptyData = data_sum === 0;
    if (emptyData) {
      return this.drawInnerCircle(context, center, emptyData);
    } else {
      data_normalized = this.normalizeToBase360(this.data, data_sum);
      startingAngles = this.drawDonut(context, center, radius, this.colors, data_normalized);
      this.drawDonut(context, center, radius_small, this.colors_small, this.data);
      this.drawInnerCircle(context, center);
      i = 0;
      _results = [];
      while (i < startingAngles.length) {
        angle = startingAngles[i];
        context.beginPath();
        context.moveTo(center, center);
        context.lineWidth = 2;
        context.strokeStyle = '#FFFFFF';
        context.lineTo(center + radius * Math.cos(angle), center + radius * Math.sin(angle));
        context.stroke();
        _results.push(i++);
      }
      return _results;
    }
  };

  DonutGrapher.prototype.drawDonut = function(context, center, radius, colors, data) {
    var arcSize, centerX, centerY, endingAngle, i, startingAngle, startingAngles;
    startingAngles = [];
    i = 0;
    while (i < data.length) {
      context.save();
      centerX = center;
      centerY = center;
      startingAngle = degreesToRadians(sumTo(data, i));
      arcSize = degreesToRadians(data[i]);
      endingAngle = startingAngle + arcSize;
      context.beginPath();
      context.moveTo(centerX, centerY);
      context.arc(centerX, centerY, radius, startingAngle, endingAngle, false);
      startingAngles.push(startingAngle);
      context.closePath();
      context.fillStyle = colors[i];
      context.fill();
      context.restore();
      i++;
    }
    return startingAngles;
  };

  DonutGrapher.prototype.drawInnerCircle = function(context, center, emptyData) {
    if (emptyData == null) {
      emptyData = false;
    }
    context.beginPath();
    context.moveTo(center, center);
    if (emptyData) {
      context.fillStyle = "#F4F4F4";
    } else {
      context.fillStyle = "#FFFFFF";
    }
    context.arc(center, center, center * this.innerAreaFactor, 0, 2 * Math.PI, false);
    return context.fill();
  };

  sumTo = function(a, i) {
    return a.slice(0, (i - 1) + 1 || 9e9).reduce(function(x, y) {
      return x + y;
    });
  };

  degreesToRadians = function(degrees) {
    return (degrees * Math.PI) / 180;
  };

  DonutGrapher.prototype.normalizeToBase360 = function(data, sum) {
    var amount_corrected, correction_value, element, index, index_of_max, max, normalized_value, _i, _len;
    max = Math.max.apply(Math, data);
    if (max === 0) {
      return data;
    }
    correction_value = 6;
    amount_corrected = 0;
    for (index = _i = 0, _len = data.length; _i < _len; index = ++_i) {
      element = data[index];
      normalized_value = Math.round((element / sum) * 360);
      if (normalized_value < correction_value && normalized_value > 0) {
        amount_corrected += correction_value - normalized_value;
        normalized_value = correction_value;
      }
      data[index] = normalized_value;
    }
    max = Math.max.apply(Math, data);
    index_of_max = data.indexOf(max);
    data[index_of_max] -= amount_corrected;
    return data;
  };

  shadeColor = function(color, percent) {
    var B, BB, G, GG, R, RR;
    R = parseInt(color.substring(1, 3), 16);
    G = parseInt(color.substring(3, 5), 16);
    B = parseInt(color.substring(5, 7), 16);
    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);
    R = (R < 255 ? R : 255);
    G = (G < 255 ? G : 255);
    B = (B < 255 ? B : 255);
    RR = (R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16));
    GG = (G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16));
    BB = (B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16));
    return "#" + RR + GG + BB;
  };

  return DonutGrapher;

})();
