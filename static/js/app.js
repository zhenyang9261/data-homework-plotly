function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var metadataJson = d3.json("/metadata/"+sample);

  // Use d3 to select the panel with id of `#sample-metadata`
  metadataDiv = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
  metadataDiv.html("");

  // Use `Object.entries` to add each key and value pair to the panel
  // Append new tags for each key-value in the metadata.
  metadataJson.then(function(metadata) {
     Object.entries(metadata).forEach(([key, value]) => {
      var newline = metadataDiv.append("div");
      newline.text(key +": " + value);
    });
  });

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  var sampleJson = d3.json("/samples/"+sample);

  /*
    * Build a Bubble Chart using the sample data
    */
  sampleJson.then(function(sample) {
    
    // Assign json data to arrays
    var ids = sample.otu_ids;
    var labels = sample.otu_labels;
    var samples = sample.sample_values;
      
    var trace = {
        x: ids,
        y: samples,
        mode: 'markers',
        marker: {
          size: samples,
          color: ids
        },
        text: labels
    };
    
    var layout = {
        title: "Belly Button Biodiversity",
        showlegend: false,
        height: 400,
        width: 1000
    };
    
      Plotly.newPlot('bubble', [trace], layout);
  });

  /* 
    * Build a Pie Chart with the top 10 samples
    */
  sampleJson.then(function(sample) {
    
    // Assign json data to arrays
    var topTenIDs = sample.otu_ids;
    var topTenLabels = sample.otu_labels;
    var topTenSamples = sample.sample_values;
 
    // Sort the arrays in desc order
    //1) combine the arrays:
    var list = [];
    for (var i = 0; i < topTenIDs.length; i++) 
      list.push({'id': topTenIDs[i], 'label': topTenLabels[i], 'sample': topTenSamples[i]});

    //2) sort in desc order:
    list.sort(function(a, b) {
      return ((a.sample > b.sample) ? -1 : ((a.sample == b.sample) ? 0 : 1));
    });

    //3) separate them back out:
    for (var j = 0; j < list.length; j++) {
      topTenIDs[j] = list[j].id;
      topTenLabels[j] = list[j].label;
      topTenSamples[j] = list[j].sample;
    }

    // Plot the pie chart
    var trace = {
        type: "pie",
        labels: topTenIDs.slice(0, 10),
        values: topTenSamples.slice(0, 10),
        hovertext: topTenLabels.slice(0, 10)
    };

    var layout = {
        title: "Belly Button Biodiversity - Top 10 Sample Values",
        height: 400,
        width: 500
    };

    Plotly.newPlot("pie", [trace], layout);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
