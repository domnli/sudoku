sudoku = function(io){
	var ltx,lty;
	var sideLength = 600;
	var editMode = 0; // 0 插入模式  1  草稿模式
	var currentCell = new iio.SimpleRect(0,0,sideLength/9).setStrokeStyle('#ff7e00',3); //当前编辑格

	//cal lt(left top)
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

	var drawNumber = function(num){
		var pos = currentCell.pos.clone();
		var coor = grid2.getCellAt(pos);
		var grid2res = grid2.res.y;
		var fontSize = Math.floor(grid2res * 0.8);
		pos.y = pos.y + Math.floor(grid2res * 0.2);
		//调试中
		console.log(currentCell.pos.y);
		if(typeof(grid2.cells[coor.x][coor.y].numObj) != 'undefined'){
			io.rmvObj(grid2.cells[coor.x][coor.y].numObj);
		}
		grid2.cells[coor.x][coor.y].numObj = new iio.Text(num,pos)
													    .setFont(fontSize+'px Consolas')
													    .setTextAlign('center')
													    .setFillStyle('#000000');
		io.addObj(grid2.cells[coor.x][coor.y].numObj);
	};
	var changeEditPos = function(pos){
		if(!iio.intersects(bg,currentCell)){
			currentCell.setPos(pos);
			currentCell.canEdit = true;
			io.addObj(currentCell);
		}
		currentCell.setPos(pos.x,pos.y);
		io.draw();
	};
	//draw init number
	(function(){
		if(sudokulogic.initData.length == 0){
			sudokulogic.generateInitData();
		}
		var I = sudokulogic.initData;
		var grid2res = grid2.res.y;
		var fontSize = Math.floor(grid2res * 0.8);
		for(var i = 0 ; i < I.length ; i++){
			if(I[i] !== 0){
				var x = i % 9,
					y = Math.floor(i / 9);
				grid2.cells[x][y].num = I[i];
				grid2.cells[x][y].readonly = true; 
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

	window.addEventListener('keydown',function(event){
		
	});
	window.addEventListener('keypress',function(event){
		console.log(iio.getKeyString(event));
		if(iio.keyCodeIs('space',event)){
			editMode = editMode == 0 ? 1 : 0;
			return;
		}
		if(iio.keyCodeIs(['1','2','3','4','5','6','7','8','9',],event)){
			drawNumber(iio.getKeyString(event));	
		}
		
	});
	window.addEventListener('keyup',function(event){
		//console.log(event);
	});
	io.canvas.addEventListener('mousedown', function(event){
    	console.log(event);
	});
	io.canvas.addEventListener('click', function(event){
		var pos = grid2.getCellAt(io.getEventPosition(event));
		if(pos && !grid2.cells[pos.x][pos.y].readonly){
			pos = grid2.getCellCenter(pos,false,true);
    		changeEditPos(pos);
		}
	});
	io.canvas.addEventListener('mouseup', function(event){
    	console.log(event);
	});
	// resize
	this.onResize = function(event){
		io.draw();
	};
};
sudokulogic = {
	initData:[],
	redPos:[],
	level:0,
	generateInitData:function(){
		this.initData = [0,1,0,0,0,0,0,0,0,
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