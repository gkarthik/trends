var w = 0.9 * window.innerWidth,
    h = 400,
    mx = 40,
    my = 40;
var svg = d3.select("#main-canvas").attr("height",h).attr("width",w).append("svg:g");

function renderChart(pageno, _count){
	d3.json("https://api.import.io/store/data/e7f7c0c2-2a7f-4a1e-9d5e-15435f667f5c/_query?input/webpage/url=http://stackoverflow.com/tags?page="+pageno+"&tab=popular&_user=55e04154-a64b-4b48-88a0-0eb74f0585d0&_apikey=4YbHipVFwxvzs4LbDyw%2FPkxViLY9NO3CVOz1MmRc7nOG7%2F0gGlIf%2BkR%2FlKZzb%2F9dKQjB%2FynEfWQU13bC17YYQA%3D%3D&callback=?", function(json){
		var data = json.results;
		data = data.map(function(d){
			d.count = parseInt(d.count);
			d.today = parseInt(d.today);
			d.week = parseInt(d.week);
			return d;
		});
		if(_count=="today"){
			data.sort(function(a,b){return b.today > a.today;});
		} else if(_count=="week") {
			data.sort(function(a,b){return b.week > a.week});
		}
		svg.selectAll("*").remove();
		console.log(data);
		var valueScale = d3.scale.ordinal().domain(data.map(function(d){return d.tag;})).rangeBands([0,w-(2*mx)]);
		var l = {
			lower: data[data.length-1].count,
			upper: data[0].count
		};
		if(_count == "today"){	
			l = {
				lower: data[data.length-1].today,
				upper: data[0].today
			};
		} else if(_count=="week") {	
			l = {
				lower: data[data.length-1].week,
				upper: data[0].week
			};
		}
		var frequencyScale = d3.scale.linear().domain([l.lower,l.upper]).range([h-(2*my),0]);
		var xAxis = d3.svg.axis().scale(valueScale).orient("bottom");
		var yAxis = d3.svg.axis().tickFormat(function (d) {
		    	var prefix = d3.formatPrefix(d);
		    	return prefix.scale(d) + "k";
		}).ticks(5).scale(frequencyScale).orient("left");
		svg.append("g").attr("class","xaxis axis").call(xAxis).attr("transform","translate("+mx+","+(h-my)+")");
		svg.append("g").attr("class","yaxis axis").call(yAxis).attr("transform","translate("+mx+","+my+")");
		
		var barEnter = svg.selectAll(".bar").data(data).enter().append("svg:g").attr("class","bar").append("rect").attr("width",(w-(2*mx))/70).attr("height", function(d){return (h-(2*my))-frequencyScale(d.count);}).attr("transform",function(d){return "translate("+parseFloat(mx+valueScale(d.tag)+((w-2*mx)/70)/2)+","+parseFloat(my+frequencyScale(d.count))+")"});
});
}

renderChart(1,"count");
