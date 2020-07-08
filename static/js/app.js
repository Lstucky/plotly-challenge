

// optionChanged function will update plotly when value in dropdown menu changes
function optionChanged(id) {
    d3.json("data/samples.json")
    .then(bellyData => {
        // **sort if data is not already sorted**
        // var bellyData = Object.entries(bellyData).sort((a, b) => {
        //     return (a.sample_values - b.sample_values)

        // take the first item of the samples as the default data
        // filter to whatever id is selected
        var sampleData = bellyData.samples.filter(d => d.id == id)[0];
        console.log('sampleData', sampleData);


        var sampleValues = sampleData.sample_values
        var otuIDs = sampleData.otu_ids
        var otuLabels = sampleData.otu_labels

        // default horizontal bar chart
        // slice to take the top ten and reverse order
        // use map function to convert out)ids to label strings 
         initialData = [{
            x: sampleValues.slice(0,10).reverse(),
            y: otuIDs.slice(0,10).map(d => `OTU ${d}`).reverse(),
            text: otuLabels.slice(0,10).reverse(),
            orientation: 'h',
            type: 'bar'
        }]

        var barLayout = {
            title: 'Top 10 Microbes',
        };

        Plotly.newPlot('bar', initialData, barLayout);


        //default bubble chart
        initialData = [{
            x: otuIDs,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuIDs,
                colorscale: 'Portland',
            }  
        }]
        var bubbleLayout = {
            title: 'Microbes and Prevalence'
        }

        Plotly.newPlot('bubble', initialData, bubbleLayout);


        // Demographic Info
        var demoInfo = bellyData.metadata.filter(d => d.id == id)[0];
        console.log('demo info', demoInfo);

        
        // select panel body element, and set to empty
        var sampleMeta = d3.selectAll("#sample-metadata").html('') 

        // extract key: value pair from metadata and append panel
        Object.entries(demoInfo).map(([k,v]) => {
            sampleMeta.append("div").text(`${k}: ${v}`);
        })


        console.log('wfreq', demoInfo.wfreq)

        // gauge chart
        initialData = [{ 
            values: [ 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81],
            rotation: 90,
            text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
            direction: 'clockwise',
            textinfo: "text",
            textposition: "inside",
            marker: {
              colors: ["#59AD00", "#02AD00", '#02AD00', '#00ADAA', '#0059AD', '#0002AD', '#5300AD', '#AA00AD', '#AD0059', 'white']
            },
            hole: .5,
            type: "pie",
            showlegend: false,
            hoverinfo: 'none'
          }]

        //   var degrees = 50, radius = .9
        //   var radians = degrees * Math.PI / 180
        //   var x = -1 * radius * Math.cos(radians) * 10
        //   var y = radius * Math.sin(radians)

        // needle
          var gaugeLayout = {
            shapes: [{
              type: 'line',
              x0: 0.5,
              y0: 0.5,
              x1: 0.6,
              y1: 0.8,
              line: {
                color: 'black',
                width: 3
              }
            }],
            title: 'Belly Button Washing Frequency',
            xaxis: {visible: false, range: [-1, 1]},
            yaxis: {visible: false, range: [-1, 1]}
          }
      
          Plotly.newPlot('gauge', initialData, gaugeLayout)
      });
};

// read in data, select the select element and append an option element for each id in names.
// add id value to each
d3.json("data/samples.json")
    .then(bellyData => {
        // console.log(bellyData);
        var names = bellyData.names;
        var option = d3.select('#selDataset');
        names.forEach(d => {
            option.append("option").text(d).property("value", d);
    })

    optionChanged(names[0]);
    });

