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
	//io.addObj(grid.setStrokeStyle('silver',0.3));

	var grid2 = new iio.Grid(ltx,lty,9,9,sideLength / 9);
	io.addObj(grid2.setStrokeStyle('gray',1));

	var grid3 = new iio.Grid(ltx,lty,3,3,sideLength / 3);
	io.addObj(grid3.setStrokeStyle('black',3));

	var drawNumber = function(num){
		if (!currentCell.canEdit) {
			return;
		}
		var pos = currentCell.pos.clone();
		var coor = grid2.getCellAt(pos);
		var currentGrid;
		//判断是否草稿模式
		if(editMode == 0){
			currentGrid = grid2;
			pos.y = pos.y + Math.floor(currentGrid.res.y * 0.2);
		}else{
			currentGrid = grid;
			pos.x = pos.x - currentGrid.res.x;
			pos.y = pos.y - currentGrid.res.y;
			switch(num){
				case '1':
				case '2':
				case '3':
					pos.x = pos.x + currentGrid.res.x * (num - 1);
					break;
				case '4':
				case '5':
				case '6':
					pos.x = pos.x + currentGrid.res.x * (num - 4);
					pos.y = pos.y + currentGrid.res.y;
					break;
				case '7':
				case '8':
				case '9':
					pos.x = pos.x + currentGrid.res.x * (num - 7);
					pos.y = pos.y + currentGrid.res.y * 2;
					break;
			}
			pos.y = pos.y + Math.floor(currentGrid.res.y * 0.2);
		}
		var fontSize = Math.floor(currentGrid.res.y * 0.8);

		if(editMode == 0){
			hideEditNum();
			console.log(grid2.cells[coor.x][coor.y].numObj);
			if(typeof(grid2.cells[coor.x][coor.y].numObj) != 'undefined'){
				grid2.cells[coor.x][coor.y].numObj.setText(num);
				io.draw();
			}else{
				grid2.cells[coor.x][coor.y].numObj = new iio.Text(num,pos)
													    .setFont(fontSize+'px Consolas')
													    .setTextAlign('center')
													    .setFillStyle('#000000');
				io.addObj(grid2.cells[coor.x][coor.y].numObj);
			}
		}else{
			if (typeof(grid2.cells[coor.x][coor.y].numObj) != 'undefined') {
				return;
			}
			if (typeof(grid2.cells[coor.x][coor.y].editNumObj) == 'undefined') {
				grid2.cells[coor.x][coor.y].editNumObj = [];
				grid2.cells[coor.x][coor.y].editNumObj[num-1] = new iio.Text(num,pos)
													    .setFont(fontSize+'px Consolas')
													    .setTextAlign('center')
													    .setFillStyle('#000000');
				io.addObj(grid2.cells[coor.x][coor.y].editNumObj[num-1]);
			} else if (typeof(grid2.cells[coor.x][coor.y].editNumObj[num-1]) == 'undefined'){
				grid2.cells[coor.x][coor.y].editNumObj[num-1] = new iio.Text(num,pos)
													    .setFont(fontSize+'px Consolas')
													    .setTextAlign('center')
													    .setFillStyle('#000000');
				io.addObj(grid2.cells[coor.x][coor.y].editNumObj[num-1]);
			} else {
				io.rmvObj(grid2.cells[coor.x][coor.y].editNumObj[num-1]);
				grid2.cells[coor.x][coor.y].editNumObj[num-1] = undefined;
				io.draw();
			}
		}
		
	};
	var hideEditNum = function(){
		var pos = currentCell.pos.clone();
		var coor = grid2.getCellAt(pos);

		var loop = grid2.cells[coor.x][coor.y].editNumObj;
		if(typeof(loop) != 'undefined'){
			grid2.cells[coor.x][coor.y].forzen = [];
			for (var i = 0; i < loop.length; i++) {
				if(typeof(loop[i]) != 'undefined'){
					io.rmvObj(loop[i]);
					grid2.cells[coor.x][coor.y].forzen.push(loop[i].text);
					loop[i] = undefined;
					//loop[i].setFillStyle('#FFFFFF');
				}
			};
			grid2.cells[coor.x][coor.y].editNumObj = undefined;
		}
		console.log(grid2);
		io.draw();
	};

	var showEditNum = function(){
		if (!currentCell.canEdit) {
			return;
		}
		
		editMode = 1;
		var pos = currentCell.pos.clone();
		var coor = grid2.getCellAt(pos);

		if (typeof(grid2.cells[coor.x][coor.y].numObj) != 'undefined') {
			io.rmvObj(grid2.cells[coor.x][coor.y].numObj);
			grid2.cells[coor.x][coor.y].numObj = undefined;
			io.draw();
		}
		var loop = grid2.cells[coor.x][coor.y].forzen;
		if (typeof(loop) != 'undefined') {
			for (var i = 0; i < loop.length; i++) {
				console.log(loop[i]);
				drawNumber(loop[i]);
			};
			grid2.cells[coor.x][coor.y].forzen = undefined;
		}
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
		console.log(iio.getKeyString(event));
	});
	window.addEventListener('keypress',function(event){
		if (iio.keyCodeIs('space',event)) {
			editMode = editMode == 0 ? 1 : 0;
			return;
		}
		if (iio.keyCodeIs(['1','2','3','4','5','6','7','8','9'],event)) {
			drawNumber(iio.getKeyString(event));
			return;
		}
		if (iio.keyCodeIs('c',event)) {
			showEditNum();
			return;
		}
		
	});
	window.addEventListener('keyup',function(event){
		
	});
	io.canvas.addEventListener('mousedown', function(event){

	});
	io.canvas.addEventListener('click', function(event){
		var pos = grid2.getCellAt(io.getEventPosition(event));
		if(pos && !grid2.cells[pos.x][pos.y].readonly){
			pos = grid2.getCellCenter(pos,false,true);
    		changeEditPos(pos);
		}
	});
	io.canvas.addEventListener('mouseup', function(event){
    	
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