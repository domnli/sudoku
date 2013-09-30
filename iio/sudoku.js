sudoku = function(io){
	var ltx,lty;
	var sideLength = 600;

	//cal lt
	ltx = io.canvas.center.x - sideLength / 2;
	lty = io.canvas.center.y - sideLength / 2;

	//canvas color
	io.setBGColor('rgba(0, 186, 255, 0.4)');

	//background ,white color
	var bg = new iio.SimpleRect(io.canvas.center,sideLength);
	io.addObj(bg.setFillStyle('white'));

	//three layer
	var grid = new iio.Grid(ltx,lty,27,27,sideLength / 27);
	io.addObj(grid.setStrokeStyle('silver',0.3));

	var grid2 = new iio.Grid(ltx,lty,9,9,sideLength / 9);
	io.addObj(grid2.setStrokeStyle('gray',1));

	var grid3 = new iio.Grid(ltx,lty,3,3,sideLength / 3);
	io.addObj(grid3.setStrokeStyle('black',3));

	//draw init number
	(function(){
		if(sudokulogic.initDate.length == 0){
			sudokulogic.generateInitDate();
		}
		...
	})();

	// resize
	this.onResize = function(event){
		io.draw();
	};
};
sudokulogic = {
	initDate:[],
	redPos:[],
	level:0,
	generateInitDate:function(){

	},
	checkRepeat:function(){

	},
	checkWin:function(){

	}
};