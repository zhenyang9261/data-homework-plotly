function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    var sampleJson = d3.json("/samples/"+sample);

    // @TODO: Build a Bubble Chart using the sample data

    // Build a Pie Chart with the top 10 samples
    sampleJson.then(function(sample) {
    
      // Choose first 10 data
      var topTenIDs = sample.otu_ids;
      var topTenLabels = sample.otu_labels;
      var topTenSamples = sample.sample_values;
      
      //console.log(topTenIDs);
      //console.log(topTenLabels);
      //console.log(topTenSamples);

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

      console.log(topTenIDs.slice(0, 10));
      console.log(topTenLabels.slice(0, 10));
      console.log(topTenSamples.slice(0, 10));

      var data = {
        type: "pie",
        name: "Belly Button Biodiversity",
        labels: topTenIDs.slice(0, 10),
        values: topTenSamples.slice(0, 10),
        hovertext: topTenLabels.slice(0, 10)
      };

      var layout = {
        title: "Belly Button Biodiversity",
        height: 400,
        width: 500
      };

      Plotly.newPlot("pie", [data], layout);
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
