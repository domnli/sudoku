/*hanoi main file*/
hanoi = function(io){
	var config = {
		apex : {
			lt : {
				x : 0,
				y : 0
			},
			lb : {
				x : 0,
				y : 0
			},
			rt : {
				x : 0,
				y : 0
			},
			rb : {
				x : 0,
				y : 0
			}
		},
		areaW : 600,
		areaH : 400,
		cylinder : {
			w : 2,
			h : 250,
			imgSrc : ''
		},
		layer : {
			minW : 15,
			minH : 15
		}
	};

	//cal config.apex
	config.apex.lt.x = io.canvas.center.x - config.areaW / 2;
	config.apex.lt.y = io.canvas.center.y - config.areaH / 2;
	config.apex.lb.x = io.canvas.center.x - config.areaW / 2;
	config.apex.lb.y = io.canvas.center.y + config.areaH / 2;
	config.apex.rt.x = io.canvas.center.x + config.areaW / 2;
	config.apex.rt.y = io.canvas.center.y - config.areaH / 2;
	config.apex.rb.x = io.canvas.center.x + config.areaW / 2;
	config.apex.rb.y = io.canvas.center.y + config.areaH / 2;
	//background
	io.setBGColor('rgba(0, 186, 255, 0.4)');

	var sampleRect = new iio.SimpleRect(io.canvas.center,config.areaW,config.areaH);
	io.addObj(sampleRect.setFillStyle('white'));

	//three cylinder
	var cylinderS,cylinderTMP,cylinderD,
		cylw = config.cylinder.w,cylh = config.cylinder.h,cylImg = config.cylinder.imgSrc,
		cyly = config.apex.lb.y - cylh / 2,
		cylSx = config.apex.lb.x + config.areaW / 4 - cylw / 2,
		cylTMPx = config.apex.lb.x + 2 * config.areaW / 4 - cylw / 2,
		cylDx = config.apex.lb.x + 3 * config.areaW / 4 - cylw / 2;
	cylinderS = new iio.SimpleRect(cylSx,cyly,cylw,cylh);
	cylinderTMP = new iio.SimpleRect(cylTMPx,cyly,cylw,cylh);
	cylinderD = new iio.SimpleRect(cylDx,cyly,cylw,cylh);

	io.addObj(cylinderS.setFillStyle('gray'));
	io.addObj(cylinderTMP.setFillStyle('gray'));
	io.addObj(cylinderD.setFillStyle('gray'));

	//layers init
	var layerAmount = typeof pageConf == 'object' ? pageConf.num == undefined ? 3 : pageConf.num : 3;
	layerAmount = layerAmount > 10 ? 10 : layerAmount;
	var layerInS = [],layerInTMP = [],layerInD = [];
	var layerMinW = config.layer.minW,layerMinH = config.layer.minH;
	for(var i = layerAmount - 1; i >= 0; i--){
		var layer = {};
		layer.level = i;
		var posX = cylinderS.left() + config.cylinder.w,
			posY = cylinderS.bottom() - layerMinH / 2 - layerMinH * (layerAmount - i - 1),
			W = layerMinW + layerMinW * i,H = layerMinH;
		layer.layer = new iio.SimpleRect(posX,posY,W,H).setFillStyle('black');
		layerInS.push(layer);
		io.addObj(layer.layer);
	}

	//mouse listener
	var moveLayer,keepMouseDown = false;
	io.canvas.addEventListener('mousedown',function(e){
		keepMouseDown = true;
		var layer = getClickLayer(io.getEventPosition(e));
		if(!layer){
			return;
		}
		moveLayer = layer;
	});
	io.canvas.addEventListener('mousemove',function(e){
		if(moveLayer && keepMouseDown){
			moveLayer.layer.setPos(io.getEventPosition(e));
			io.draw();
		}
	});
	io.canvas.addEventListener('mouseup',function(e){
		keepMouseDown = false;
		if(moveLayer != undefined){
			checkLayerMove(moveLayer);	
		}
		moveLayer = undefined;
		if(checkWin()){
			if(typeof win == 'function'){
				win();
			}else{
				alert('win');
			}
		}
	});

	//function : get mouse click layer
	function getClickLayer(pos){
		var layer = false;
		if(layerInS[layerInS.length - 1] && layerInS[layerInS.length - 1].layer.contains(pos)){
			layer = layerInS[layerInS.length - 1];
			layer.from = layerInS;
			layer.originalPos = layer.layer.pos;
		}else if(layerInTMP[layerInTMP.length - 1] && layerInTMP[layerInTMP.length - 1].layer.contains(pos)){
			layer = layerInTMP[layerInTMP.length - 1];
			layer.from = layerInTMP;
			layer.originalPos = layer.layer.pos;
		}else if(layerInD[layerInD.length - 1] && layerInD[layerInD.length - 1].layer.contains(pos)){
			layer = layerInD[layerInD.length - 1];
			layer.from = layerInD;
			layer.originalPos = layer.layer.pos;
		}else{

		}
		return layer;
	}

	//function : check can the layer move to another cylinder,if could then move
	function checkLayerMove(layer){
		if(iio.rectXrect(layer.layer,cylinderS)){
			if(layer.from != layerInS){
				if(!layerInS[layerInS.length - 1] || layer.level < layerInS[layerInS.length - 1].level){
					layer.layer.pos = getLastPos('S');
					layerInS.push(layer.from.pop());
				}else{
					layer.layer.setPos(moveLayer.originalPos);
				}
			}else{
				layer.layer.setPos(moveLayer.originalPos);
			}
		}else if(iio.rectXrect(layer.layer,cylinderTMP)){
			if(layer.from != layerInTMP){
				if(!layerInTMP[layerInTMP.length - 1] || layer.level < layerInTMP[layerInTMP.length - 1].level){
					layer.layer.pos = getLastPos('TMP');
					layerInTMP.push(layer.from.pop());
				}else{
					layer.layer.setPos(moveLayer.originalPos);
				}
			}else{
				layer.layer.setPos(moveLayer.originalPos);
			}
		}else if(iio.rectXrect(layer.layer,cylinderD)){
			if(layer.from != layerInD){
				if(!layerInD[layerInD.length - 1] || layer.level < layerInD[layerInD.length - 1].level){
					layer.layer.pos = getLastPos('D');
					layerInD.push(layer.from.pop());
				}else{
					layer.layer.setPos(moveLayer.originalPos);
				}
			}else{
				layer.layer.setPos(moveLayer.originalPos);
			}
		}else{
			layer.layer.setPos(moveLayer.originalPos);
		}
		io.draw();
	}

	//function : calculate the last layer's pos in array
	function getLastPos(X){
		switch(X){
			case 'S':
				var x = cylinderS.left() + config.cylinder.w,
					y = cylinderS.bottom() - layerMinH / 2 - layerMinH * layerInS.length;
				return new iio.Vec(x,y);
				break;
			case 'TMP':
				var x = cylinderTMP.left() + config.cylinder.w,
					y = cylinderTMP.bottom() - layerMinH / 2 - layerMinH * layerInTMP.length;
				return new iio.Vec(x,y);
				break;
			case 'D':
				var x = cylinderD.left() + config.cylinder.w,
					y = cylinderD.bottom() - layerMinH / 2 - layerMinH * layerInD.length;
				return new iio.Vec(x,y);
				break;
		}
	}
	//function : check win
	function checkWin(){
		if(layerAmount == layerInD.length){
			return true;
		}
		return false;
	}

	// resize
	this.onResize = function(event){
		io.draw();
	};

}