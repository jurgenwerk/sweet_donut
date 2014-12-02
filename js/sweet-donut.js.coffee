$.fn.drawDonut = (props) ->
  donutGrapher = new DonutGrapher($(this), props)
  donutGrapher.drawDonutChart()

class DonutGrapher

  constructor: (canvas, props) ->
    @canvas = canvas[0]
    @props = props

    @data = props["data"]
    @colors = @getProperty("colors", @getRandomColors(@data.length))
    @shade_factor = parseFloat(@getProperty("shade_factor", -12))
    @shade_area_percent = parseFloat(@getProperty("shade_area_percent", 0.32))
    @colors_small = @getProperty("colors_small", shadeColor(color, @shade_factor) for color in @colors)
    @innerAreaFactor = parseFloat(@getProperty("inner_area_factor", 0.5));

  getProperty: (property, default_value) ->
    if @props[property]? then @props[property] else default_value

  defaultColors: ->
    ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#27ae60", "#2980b9", "#8e44ad",
    "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"]

  getRandomColors: (n) ->
    randomColors = []
    colorsLeftToChoose = @defaultColors()

    i = 0
    while i < n
      randomColorIndex = Math.floor(Math.random() * colorsLeftToChoose.length)
      randomColors.push colorsLeftToChoose[randomColorIndex]
      colorsLeftToChoose.splice randomColorIndex, 1
      i++

    randomColors

  drawDonutChart: ->
    context = @canvas.getContext("2d")
    center = radius = @canvas.width/2
    radius_small = Math.round(@shade_area_percent*radius*2)

    data_sum = @data.reduce (x,y) -> x + y
    emptyData = data_sum == 0

    if emptyData
      @drawInnerCircle context, center, emptyData
    else
      data_normalized = @normalizeToBase360(@data, data_sum)
      startingAngles = @drawDonut context, center, radius, @colors, data_normalized
      @drawDonut context, center, radius_small, @colors_small, @data
      @drawInnerCircle context, center

      # Chunk dividers
      i = 0
      while i < startingAngles.length
        angle = startingAngles[i]
        context.beginPath()
        context.moveTo(center, center)
        context.lineWidth = 2
        context.strokeStyle = '#FFFFFF'
        context.lineTo(center + radius * Math.cos(angle), center + radius * Math.sin(angle))
        context.stroke()
        i++

  drawDonut: (context, center, radius, colors, data) ->
    startingAngles = []
    i = 0
    while i < data.length
      context.save()
      centerX = center
      centerY = center
      startingAngle = degreesToRadians(sumTo(data, i))
      arcSize = degreesToRadians(data[i])
      endingAngle = startingAngle + arcSize
      context.beginPath()
      context.moveTo centerX, centerY
      context.arc centerX, centerY, radius, startingAngle, endingAngle, false
      startingAngles.push startingAngle
      context.closePath()
      context.fillStyle = colors[i]
      context.fill()
      context.restore()
      i++
    startingAngles

  drawInnerCircle: (context, center, emptyData = false) ->
    context.beginPath()
    context.moveTo(center, center)

    if emptyData
      context.fillStyle = "#F4F4F4"
    else
      context.fillStyle = "#FFFFFF"

    context.arc(center, center, center * @innerAreaFactor, 0, 2 * Math.PI, false)
    context.fill()

  sumTo = (a, i) ->
    a[0..i-1].reduce (x, y) -> x + y

  degreesToRadians = (degrees) ->
    (degrees * Math.PI) / 180

  normalizeToBase360: (data, sum) ->
    max = Math.max.apply(Math, data)
    return data if max == 0

    # If some value is significantly smaller than others, then it's not rendered properly due to small percentage
    # We must increase them a little bit so they can be seen

    correction_value = 6 # Experimental value
    amount_corrected = 0

    for element, index in data
      normalized_value = Math.round((element/sum)*360)

      if normalized_value < correction_value and normalized_value > 0
        amount_corrected += correction_value - normalized_value
        normalized_value = correction_value

      data[index] = normalized_value

    max = Math.max.apply(Math, data)
    index_of_max = data.indexOf(max)
    data[index_of_max] -= amount_corrected

    data

  shadeColor = (color, percent) ->
    R = parseInt(color.substring(1, 3), 16)
    G = parseInt(color.substring(3, 5), 16)
    B = parseInt(color.substring(5, 7), 16)
    R = parseInt(R * (100 + percent) / 100)
    G = parseInt(G * (100 + percent) / 100)
    B = parseInt(B * (100 + percent) / 100)
    R = (if (R < 255) then R else 255)
    G = (if (G < 255) then G else 255)
    B = (if (B < 255) then B else 255)
    RR = ((if (R.toString(16).length is 1) then "0" + R.toString(16) else R.toString(16)))
    GG = ((if (G.toString(16).length is 1) then "0" + G.toString(16) else G.toString(16)))
    BB = ((if (B.toString(16).length is 1) then "0" + B.toString(16) else B.toString(16)))
    "#" + RR + GG + BB
