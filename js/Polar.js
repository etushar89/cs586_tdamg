class Polar extends Graph{

	constructor(file){
    super(file)
  }

	plotGraph(x_axis, y_axis, x_filter_val, xOp, y_filter_val, yOp, doFilter){

	document.getElementById('chartSelection').style.visibility = 'visible'
	document.getElementById('chartDiv').style.visibility = 'visible'
	var stats = new Stats()

	  var DataFrame = dfjs.DataFrame

	  DataFrame.fromCSV(this.file).then(
    df => {
      //Chart
      var selectedDf = df.select(x_axis, y_axis)

			if (doFilter) {
				var xFDf = selectedDf.filter(row => xOp(row.get(x_axis), x_filter_val))
				selectedDf = xFDf.filter(row => yOp(row.get(y_axis), y_filter_val))
			}

      var result = selectedDf.groupBy(x_axis).aggregate(group => group.stat.sum(y_axis))/*.rename(map[x_axis], map[y_axis]);*/;
      var ctx = document.getElementById("chartArea").getContext("2d");


			var colorArray = [
								"#FF6384",
								"#36A2EB",
								"#FFCE56",
								"#00FF00"
				]

				var borColorArray = [
					'rgba(255, 99, 134, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(0, 255, 0, 1)'
				]

	  var col_count = 0
      var backgroundColorArray = []
      var borderColorArray = []
      for(var i = 0; i < result.count(); i++){
        backgroundColorArray[i] = colorArray[col_count]
        borderColorArray[i] = borColorArray[col_count]
        col_count++
        if(col_count == 3){
          col_count = 0
        }
      }

		var dataSet=[];
		var a = result.select('aggregation').toArray();
		for(var i=0;i<a.length;i++)
		{
			dataSet[i] = a[i][0];
		}

	  var myChart = new Chart(ctx,{
    type: 'polarArea',
    data: {
    labels: result.select(x_axis).toArray(),
    datasets: [
        {
            data: dataSet,
            backgroundColor: backgroundColorArray,
            hoverBackgroundColor: borderColorArray
        }]
	},
	options: {


						elements: {
							arc:{
								borderColor: "#000000"
							}
						},
						legend:{
							display: false
						},
        animation:{
            animateScale:true
	}

	}
});
	}
)
stats.findStats(x_axis, y_axis, x_filter_val, xOp, y_filter_val, yOp, doFilter, this.file);
}
}
