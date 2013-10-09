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
		var I = sudokulogic.initDate;
		var grid2res = grid2.res.y;
		var fontSize = Math.floor(grid2res * 0.8);
		for(var i = 0 ; i < I.length ; i++){
			if(I[i] !== 0){
				var x = i % 9,
					y = Math.floor(i / 9);
				var pos = grid2.getCellCenter(x,y);
				//number bg
				io.addObj(new iio.SimpleRect(pos,grid2res - 5)
                               .setFillStyle('silver'));
				//number
				pos.y = pos.y + Math.floor(grid2res * 0.2);
				io.addObj(new iio.Text(I[i],pos)
				    .setFont(fontSize+'px Consolas')
				    .setTextAlign('center')
				    .setFillStyle('#000000'));
				
			}
		}
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
		this.initDate = [0,1,0,0,0,0,0,0,0,
						 2,0,0,0,0,0,0,0,0,
						 0,0,6,0,0,0,0,0,0,
						 0,0,0,0,0,0,0,0,0,
						 0,0,0,0,0,0,0,0,0,
						 0,0,0,0,0,0,5,0,0,
						 0,0,0,0,8,0,0,0,0,
						 0,0,0,0,0,0,0,0,0,
						 0,0,0,0,0,0,0,5,0];
	},
	checkRepeat:function(){

	},
	checkWin:function(){

	}
};