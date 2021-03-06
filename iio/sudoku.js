var sudoku = function (io) {
  var ltx, lty;
  var sideLength = 600;
  var editMode = 0; // 0 插入模式  1  草稿模式
  var currentCell = new iio.SimpleRect(0, 0, sideLength / 9).setStrokeStyle('#ff7e00', 3); //当前编辑格
  var currentData = sudokulogic.generateInitData();
	sudokulogic.printData(currentData);
	//cal lt(left top)
	ltx = io.canvas.center.x - sideLength / 2;
	lty = io.canvas.center.y - sideLength / 2;

	//canvas color
	io.setBGColor('rgba(0, 186, 255, 0.4)');

	//background ,white color
	var bg = new iio.SimpleRect(io.canvas.center, sideLength);
	io.addObj(bg.setFillStyle('white'));
	//three layer
	var grid = new iio.Grid(ltx, lty, 27, 27, sideLength / 27);
	//io.addObj(grid.setStrokeStyle('silver',0.3));

	var grid2 = new iio.Grid(ltx, lty, 9, 9, sideLength / 9);
	io.addObj(grid2.setStrokeStyle('gray', 1));

	var grid3 = new iio.Grid(ltx, lty, 3, 3, sideLength / 3);
	io.addObj(grid3.setStrokeStyle('black', 3));

	// HELP TEXT
	var helpText1 = new iio.Text('Change Mode : Space', bg.pos.x - bg.width / 2 - 220, bg.pos.y)
		.setFont('20px Consolas')
		.setTextAlign('center')
		.setFillStyle('#00baff');
	io.addObj(helpText1);
	var helpText2 = new iio.Text('Clear : C or c', bg.pos.x - bg.width / 2 - 247, bg.pos.y + 50)
		.setFont('20px Consolas')
		.setTextAlign('center')
		.setFillStyle('#00baff');
	io.addObj(helpText2);

	var drawNumber = function(num) {
		if (!currentCell.canEdit) {
			return;
		}
		var pos = currentCell.pos.clone();
		var coor = grid2.getCellAt(pos);
		var currentGrid;
		//判断是否草稿模式
		if (editMode == 0) {
			currentGrid = grid2;
			pos.y = pos.y + Math.floor(currentGrid.res.y * 0.2);
		} else {
			currentGrid = grid;
			pos.x = pos.x - currentGrid.res.x;
			pos.y = pos.y - currentGrid.res.y;
			switch (num) {
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

		if (editMode == 0) {
			hideEditNum();
			if (typeof(grid2.cells[coor.x][coor.y].numObj) != 'undefined') {
				grid2.cells[coor.x][coor.y].numObj.setText(num);
				io.draw();
			} else {
				grid2.cells[coor.x][coor.y].numObj = new iio.Text(num, pos)
					.setFont(fontSize + 'px Consolas')
					.setTextAlign('center')
					.setFillStyle('#000000');
				io.addObj(grid2.cells[coor.x][coor.y].numObj);
			}
			currentData = sudokulogic.setData(coor, num, currentData);
			checkWin(currentData);
		} else {
			if (typeof(grid2.cells[coor.x][coor.y].numObj) != 'undefined') {
				return;
			}
			if (typeof(grid2.cells[coor.x][coor.y].editNumObj) == 'undefined') {
				grid2.cells[coor.x][coor.y].editNumObj = [];
				grid2.cells[coor.x][coor.y].editNumObj[num - 1] = new iio.Text(num, pos)
					.setFont(fontSize + 'px Consolas')
					.setTextAlign('center')
					.setFillStyle('#000000');
				io.addObj(grid2.cells[coor.x][coor.y].editNumObj[num - 1]);
			} else if (typeof(grid2.cells[coor.x][coor.y].editNumObj[num - 1]) == 'undefined') {
				grid2.cells[coor.x][coor.y].editNumObj[num - 1] = new iio.Text(num, pos)
					.setFont(fontSize + 'px Consolas')
					.setTextAlign('center')
					.setFillStyle('#000000');
				io.addObj(grid2.cells[coor.x][coor.y].editNumObj[num - 1]);
			} else {
				io.rmvObj(grid2.cells[coor.x][coor.y].editNumObj[num - 1]);
				grid2.cells[coor.x][coor.y].editNumObj[num - 1] = undefined;
				io.draw();
			}
		}

	};
	var hideEditNum = function() {
		var pos = currentCell.pos.clone();
		var coor = grid2.getCellAt(pos);

		var loop = grid2.cells[coor.x][coor.y].editNumObj;
		if (typeof(loop) != 'undefined') {
			grid2.cells[coor.x][coor.y].forzen = [];
			for (var i = 0; i < loop.length; i++) {
				if (typeof(loop[i]) != 'undefined') {
					io.rmvObj(loop[i]);
					grid2.cells[coor.x][coor.y].forzen.push(loop[i].text);
					loop[i] = undefined;
					//loop[i].setFillStyle('#FFFFFF');
				}
			};
			grid2.cells[coor.x][coor.y].editNumObj = undefined;
		}
		io.draw();
	};

	var showEditNum = function() {
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

			currentData = sudokulogic.setData(coor, 0, currentData);
			checkWin(currentData);
		}
		var loop = grid2.cells[coor.x][coor.y].forzen;
		if (typeof(loop) != 'undefined') {
			for (var i = 0; i < loop.length; i++) {
				drawNumber(loop[i]);
			};
			grid2.cells[coor.x][coor.y].forzen = undefined;
		}
		editMode = 0;
	};

	var changeEditPos = function(pos) {
		if (!iio.intersects(bg, currentCell)) {
			currentCell.setPos(pos);
			currentCell.canEdit = true;
			io.addObj(currentCell);
		}
		currentCell.setPos(pos.x, pos.y);
		io.draw();
	};

	var checkWin = function(currentData){
		var repeats = sudokulogic.checkRepeat(currentData);
		for (var i = 0; i < grid2.cells.length; i++) {
			for (var j = 0; j < grid2.cells[i].length; j++) {
				if (typeof(grid2.cells[i][j].numObj) != 'undefined') {
					grid2.cells[i][j].numObj.setFillStyle('#000000');
				}
			};
		};
		if (repeats.length > 0) {
			if (repeats[0] == 'error') {
				sudokulogic.error('数据错误,将重置..');
			}
			for (var i = 0; i < repeats.length; i++) {
				grid2.cells[repeats[i]['x']][repeats[i]['y']].numObj.setFillStyle('red');
			};
		} else {
			var finished = true;
			for (var fin = 0; fin < currentData.length; fin++) {
				if (currentData[fin] == 0) {
					finished = false;
					break;
				}
			};
			if (finished) {
				sudokulogic.win();
			}
		}
		io.draw();
	};
	//draw init number
	(function() {
		var I = currentData;
		var grid2res = grid2.res.y;
		var fontSize = Math.floor(grid2res * 0.8);
		for (var i = 0; i < I.length; i++) {
			if (I[i] !== 0) {
				var x = i % 9,
					y = Math.floor(i / 9);
				grid2.cells[x][y].num = I[i];
				grid2.cells[x][y].readonly = true;
				var pos = grid2.getCellCenter(x, y);
				//number bg
				io.addObj(new iio.SimpleRect(pos, grid2res - 5)
					.setFillStyle('silver'));
				//number
				pos.y = pos.y + Math.floor(grid2res * 0.2);
				grid2.cells[x][y].numObj = new iio.Text(I[i], pos)
												.setFont(fontSize + 'px Consolas')
												.setTextAlign('center')
												.setFillStyle('#000000');
				io.addObj(grid2.cells[x][y].numObj);

			}
		}
	})();

	window.addEventListener('keydown', function(event) {
		//console.log(iio.getKeyString(event));
	});
	window.addEventListener('keypress', function(event) {
		if (iio.keyCodeIs('space', event)) {
			editMode = editMode == 0 ? 1 : 0;
			return;
		}
		if (iio.keyCodeIs(['1', '2', '3', '4', '5', '6', '7', '8', '9'], event)) {
			drawNumber(iio.getKeyString(event));
			return;
		}
		if (iio.keyCodeIs('c', event)) {
			showEditNum();
			return;
		}

	});
	window.addEventListener('keyup', function(event) {

	});
	io.canvas.addEventListener('mousedown', function(event) {

	});
	io.canvas.addEventListener('click', function(event) {
		var pos = grid2.getCellAt(io.getEventPosition(event));
		if (pos && !grid2.cells[pos.x][pos.y].readonly) {
			pos = grid2.getCellCenter(pos, false, true);
			changeEditPos(pos);
		}
	});
	io.canvas.addEventListener('mouseup', function(event) {

	});
	// resize
	this.onResize = function(event) {
		io.draw();
	};
};
sudokulogic = {
	redPos: [],
	level: 0,  //  0 easy  1 normal   2 hard  3 impossible
	getLocalSeed : function() {
        if (typeof window.localStorage != 'undefined') {
        	if (typeof window.localStorage.sudoku != 'undefined' 
        		&& typeof window.localStorage.sudoku.seed != 'undefined') {
        		if (this.checkRepeat(window.localStorage.sudoku.seed).length == 0) {
        			return window.localStorage.sudoku.seed;
        		}
        	}
        }
        return [
					9, 7, 8, 3, 1, 2, 6, 4, 5,
					3, 1, 2, 6, 4, 5, 9, 7, 8,
					6, 4, 5, 9, 7, 8, 3, 1, 2,
					7, 8, 9, 1, 2, 3, 4, 5, 6,
					1, 2, 3, 4, 5, 6, 7, 8, 9,
					4, 5, 6, 7, 8, 9, 1, 2, 3,
					8, 9, 7, 2, 3, 1, 5, 6, 4,
					2, 3, 1, 5, 6, 4, 8, 9, 7,
					5, 6, 4, 8, 9, 7, 2, 3, 1
				];
	},
	setLocalSeed : function(data) {
        if (typeof window.localStorage != 'undefined') {
        	window.localStorage.sudoku= {seed:data};
        }
	},
	generateInitData: function() {
		var initData, virus = [], cache = [0, 0, 0, 0, 0, 0, 0, 0, 0], times = 0, dig;
		switch(this.level){
			case 1:
			    dig = Math.floor(Math.random() * 3 + 51);
			    break;
			case 2:
			    dig = Math.floor(Math.random() * 3 + 53);
			    break;
			case 3:
			    dig = Math.floor(Math.random() * 3 + 56);
			    break;
			default:
			    dig = Math.floor(Math.random()*3 + 45);
			    break;
		}
		initData = this.getLocalSeed();

		while (true) {
            var num = Math.floor(Math.random()*9 + 1);
            if (cache[num - 1] == 0) {
            	cache[num - 1] = num;
            	virus.push(num);
            	times++;
            }
            if(times == 9){
            	break;
            }
		}
        
        for (var i = 0; i < initData.length; i++) {
			initData[i] = virus[initData[i] - 1];
		};

        this.setLocalSeed(initData);

        for (var tmp = 0; tmp < virus.length; tmp++) {
        	if (virus[tmp] < 9) {
        		virus[tmp]++;
        	}else{
        		virus[tmp] = 1;
        	}
        };

		for (var i = 0; i < initData.length; i++) {
			initData[i] = virus[initData[i] - 1];
		};
        
        for (var d = 0; d < dig; d++) {
        	
        };
        while(true){
        	var hole = Math.floor(Math.random()*81);
        	if(initData[hole] != 0){
        		initData[hole] = 0;
        		dig--;
        	}
        	if(dig == 0){
        		break;
        	}
        }
		this.data = initData;
		return initData;
	},
	setData: function(index, num, data) {
		if (typeof(index.x) != 'undefined') {
			index = index.x + index.y * 9;
		}
		data[index] = parseInt(num);
		return data;
	},
	printData: function(data) {
		if (typeof console == 'undefined'){
			return false;
		}
		console.log('---------------------------------');
		for (var i = 0; i < data.length; i = i + 9) {
			var out = '';
			for (var j = 0; j < 9; j++) {
				out += data[i + j] + '   ';
			};
			console.log(out + "\n");
		};
	},
	checkRepeat: function(data) {
		if (typeof data == 'undefined') {
			return ['error'];
		}
		if (Object.prototype.toString.call(data) != '[object Array]') {
			return ['error'];
		}
		if (data.length != 81) {
			return ['error'];
		}
		var repeatCoor = []; //[{x:0,y:0},{x:1,y:1}];
		var tagData = data.slice();
		var row = [],column = [],palace = [],palacePos = [0,3,6,27,30,33,54,57,60];
		var cusPush = function (target, elm) {
			if(target.length == 0){
				target.push(elm);
				return;
			}
			var push = true;
			for (var i = 0; i < target.length; i++) {
				if ( typeof(elm.x) != 'undefined' && typeof(elm.y) != 'undefined' ){
					if(elm.x == target[i].x && elm.y == target[i].y){
						push = false;
					}
				}
			}
			if(push){
				target.push(elm);
			}
		};
		for (var i = 0; i < 9; i++) {
			row.push(tagData.slice(i * 9, i * 9 +9));
			column[i] = [];
			for (var j = 0; j < 9; j++) {
				column[i].push(tagData[j*9+i]);
			};
			palace[i] = [
							tagData[palacePos[i]],
							tagData[palacePos[i] + 1],
							tagData[palacePos[i] + 2],
							tagData[palacePos[i] + 9],
							tagData[palacePos[i] + 10],
							tagData[palacePos[i] + 11],
							tagData[palacePos[i] + 18],
							tagData[palacePos[i] + 19],
							tagData[palacePos[i] + 20],
						];
		};
		//console.log(row);
		//console.log(column);
		//console.log(palace);
		//行检查
		for (var ry = 0; ry < 9; ry++) {
			var panlRow = [];
			for (var rx = 0; rx < 9; rx++) {
				if (row[ry][rx] == 0){
					continue;
				}
				if ( typeof(panlRow[row[ry][rx]]) == 'undefined' ) {
					panlRow[row[ry][rx]] = {x:rx,y:ry};
				}else{
					cusPush(repeatCoor,{x:rx,y:ry});
					cusPush(repeatCoor,panlRow[row[ry][rx]]);
				}
			};
		};
		//列检查
		for (var cx = 0; cx < 9; cx++) {
			var panlColumn = [];
			for (var cy = 0; cy < 9; cy++) {
				if (column[cx][cy] == 0){
					continue;
				}
				if ( typeof(panlColumn[column[cx][cy]]) == 'undefined' ) {
					panlColumn[column[cx][cy]] = {x:cx,y:cy};
				}else{
					cusPush(repeatCoor,{x:cx,y:cy});
					cusPush(repeatCoor,panlColumn[column[cx][cy]]);
				}
			};
		};
		//宫检查
		for (var p = 0; p < 9; p++) {
			var panlPalace = [],offset = [0, 1, 2, 9, 10, 11, 18, 19, 20];
			for (var q = 0; q < 9; q++) {
				if(palace[p][q] == 0){
					continue;
				}
				var px = ( palacePos[p] + offset[q] ) % 9,
					py = Math.floor( ( palacePos[p] + offset[q] ) / 9 );
				if( typeof(panlPalace[palace[p][q]]) == 'undefined' ) {
					panlPalace[palace[p][q]] = {x:px,y:py};
				}else{
					cusPush(repeatCoor,{x:px,y:py});
					cusPush(repeatCoor,panlPalace[palace[p][q]]);
				}
			};
		};
		//console.log(repeatCoor);
		return repeatCoor;
	},
	checkWin: function(data) {
		var repeats = this.checkRepeat(data);
		if (repeats.length > 0) {
			return false;
		}else{
			return true;
		}
	},
    win : function(){
    	alert('win');
    	window.location.reload();
    },
    error : function(msg){
        alert(msg);
        window.location.reload();
    }
};
