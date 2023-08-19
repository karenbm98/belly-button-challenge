d3.json("./samples.json").then(function(Data) {
    
    d3.select("#selDataset")
        .selectAll("option")
        .data(Data.names)
        .enter()
        .append("option")
        .text(d=>d)
        .attr("value",d=>d);

    optionChanged(d3.select("#selDataset").property("value"));
});

function BarChart(x,y,text) {
    let data = [{
        type: 'bar',
        x: x,
        y: y,
        text: text,
        orientation: 'h'
    }];
    Plotly.newPlot('bar', data);
}

function BubbleChart(x,y,text) {
    let data = [{
        x: x,
        y: y,
        text: text,
        mode: 'markers',
        marker: {size: y,color: x.map(value=>value)}
    }];
    let layout = {xaxis: {title: {text: 'OTU ID',}}};

    Plotly.newPlot('bubble', data, layout);
}

function MetaData(data) {
    let div = d3.select("#sample-metadata");
    div.html("")
    let list = div.append("ul");
    Object.entries(data).forEach(([key, value]) => {
        list.append("li").text(key + ": " + value);
     });
}

function optionChanged(value) {
    d3.json("./samples.json").then(function(Data) {
        let metadata = Data.metadata.filter(data => data.id ==value);
        console.log(metadata);

        let sample = Data.samples.filter(data => data.id ==value);
        console.log(sample);

        BarChart(sample[0].sample_values.slice(0,10).reverse(),sample[0].otu_ids.slice(0,10).reverse().map(a=>"OTU "+ a),sample[0].otu_labels.slice(0,10).reverse());
        BubbleChart(sample[0].otu_ids,sample[0].sample_values,sample[0].otu_labels);
        MetaData(metadata[0]);
    });


}