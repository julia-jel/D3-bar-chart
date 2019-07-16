// prints "hi" in the browser's dev tools console
console.log('hi');

var dataset;

const w = 1000;
const h = 600;
const padding = 50;

const chart = function(dataset) {  
  const gdp = dataset.map((arr) => arr[1]);
  const date = dataset.map((arr) => arr[0]);
  const years = date.map((item) => new Date(item));
  const writtenData = function(d){
    var quarter;
    switch(d[0].slice(5,7)) {
      case "01": 
        quarter = "Q1";
        break;
      case "04":
        quarter = "Q2";
        break;
      case "07":
        quarter = "Q3";
        break;
      case "10":
        quarter = "Q4";
        break;
    }
    return d[0].slice(0,4) + " " + quarter + "<br>" + "$" + d[1] + " Billion"
  }
  
  const xScale = d3.scaleTime()
                   .domain([d3.min(years), d3.max(years)])
                   .range([padding, w-padding]);
  
  const yScale = d3.scaleLinear()
                   .domain([0, d3.max(gdp)])
                   .range([h-padding, padding]);
  
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  
  const rectWidth = (w - 2*padding) / gdp.length;
  
  const svg = d3.select("#graphic-area")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
  
  const tooltip = d3.tip()
                    .attr("id", "tooltip")
                    .attr("data-date", "(d) => d[0]")
                    .html(function(d) {
                      d3.select("#tooltip").attr("data-date", d[0]);
                      return writtenData(d);
})
                    .style('transform', 'translateX(60px)');
  
  svg.call(tooltip);
  
  svg.selectAll("rect")
     .data(dataset)
     .enter()
     .append("rect")
     .attr("class", "bar")
     .attr("x", (d, i) => xScale(years[i]))
     .attr("y", (d, i) => yScale(d[1]))
     .attr("width", rectWidth)
     .attr("height", (d) => h - padding - yScale(d[1]))
     .attr("fill", "olive")
     .attr("data-date", (d) => d[0])
     .attr("data-gdp", (d) => d[1])
  
     .on("mouseover", tooltip.show)
     .on("mouseout", tooltip.hide)
     
  svg.append("g")
     .attr("id", "x-axis")
     .attr("transform", "translate(0, " + (h - padding) + ")")
     .call(xAxis);
  
  svg.append("g")
     .attr("id", "y-axis")
     .attr("transform", "translate(" + padding + ", 0)")
     .call(yAxis); 
  
  svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("x", -400)
     .attr("y", 70)
     .text("Gross Domestic Product, billion $")
  
  return svg;
};

document.addEventListener('DOMContentLoaded', function(){
  var req=new XMLHttpRequest();
  req.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
  req.send();
  req.onload=function(){
    var json=JSON.parse(req.responseText);
    dataset=json.data;
    chart(dataset);
  };
})
