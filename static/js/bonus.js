/**
 * Function to display gauge chart of a given sample 
 * @param {String} sample: the sample to build the gauge chart
 */
function buildGauge (sample) {

  // Use `d3.json` to fetch the sample data for the plots
  var wfreqJson = d3.json("/wfreq/"+sample);

  /*
   * Build a Bubble Chart using the sample data
   */
  wfreqJson.then(function(wfreq) {

    // Get the frequency of wash
    var wfreqNeedle = wfreq.WFREQ;

    // Trig to calc meter point
    var degrees = 180-180*wfreqNeedle/9;
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: 
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
                    pathX = String(x),
                    space = ' ',
                pathY = String(y),
                pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ type: 'scatter',
                x: [0], y:[0],
                marker: {size: 28, color:'850000'},
                showlegend: false,
                name: 'wfreq',
                text: wfreqNeedle,
                hoverinfo: 'text+name'},
                { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
                rotation: 90,
                text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
                textinfo: 'text',
                textposition:'inside',
                marker: {colors:['rgba(14, 47, 0, .5)', 'rgba(60, 77, 0, .5)', 'rgba(90, 97, 0, .5)', 
                         'rgba(120, 127, 0, .5)', 'rgba(150, 154, 22, .5)',
                         'rgba(180, 202, 42, .5)', 'rgba(202, 189, 95, .5)',
                         'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                         'rgba(255, 255, 255, 0)']},
                labels: ['9-8', '8-7', '7-6', '6-5', '5-4', '4-3', '3-2', '2-1', '0-1', ''],
                hoverinfo: 'label',
                hole: .5,
                type: 'pie',
                showlegend: false
                }];

    var layout = {
                shapes:[{
                  type: 'path',
                  path: path,
                  fillcolor: '850000',
                  line: {
                    color: '850000'
                  } 
                }],
                title: '<b>Belly Button Washing Frequency</b><br />Scrubs Per Week',
                xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
                yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
                };

    Plotly.newPlot('gauge', data, layout);
  });
}