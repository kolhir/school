
/*
* метод вывода текста
*/
function printAt(context, text, x, y, fitWidth,  lineHeight)
{
	if(text!=null){
		fitWidth = fitWidth || 0;
		
		if (fitWidth <= 0)
		{
			 context.fillText( text, x, y );
			return;
		}
		
		for (var idx = 1; idx <= text.length; idx++)
		{
			var str = text.substr(0, idx);
			//console.log(str, context.measureText(str).width, fitWidth);
			if (context.measureText(str).width > fitWidth)
			{
				context.fillText( text.substr(0, idx-1), x, y );
				printAt(context, text.substr(idx-1), x, y + lineHeight, fitWidth,  lineHeight);
				return;
			}
		}
		context.fillText( text, x, y );
	}
}

/*
* Class:: GUI который выводит меню на экран
*/
function Menu(options, game){
	let self = this;
	let items = [];
	let canvasOpt = options['canvas'];
	let canvas = canvasOpt['canvas'];
	initiateMenu();
	

	/*Инициация меню*/
	function initiateMenu(){
		let btnOpt={
			'text':'',
			'x':canvasOpt['width']*0.05,
			'y':100,
			'w':canvasOpt['width']*0.9,	
			'h':40,
			'canvas': canvas,
		}
		for(let i = 0; i<6; i++){
			items.push(new Button(btnOpt));
			items[i].isEnable=false;
			btnOpt.y+=60;
		}
		
	}
	/*Показать меню*/
	self.showMenu = function showMenu(itemsOpt){
		for(let i = 0; i<itemsOpt.length; i++){
			items[i].onclick= function (){
				//заблокируем все кнопки меню
				for(let i = 0; i<6; i++){
					items[i].isEnable=false;
				}
				game.goTo(itemsOpt[i]['to']);
				game.execScript();
			};
			items[i].text = itemsOpt[i].text;
			items[i].isEnable=true;
			items[i].draw();
		}
	}
}

/*
* Class:: GUI выводящий кнопку на канву, и обрабатывающий нажатия
*/
function Button(options){
	let self = this;
	self.onclick=options['onclick'];
	self.isEnable = true;
	self.isVisible = true;
	let x = options['x'];
	let y = options['y'];
	let w = options['w'];
	let h = options['h'];
	self.text = options.text;
	canvas = options.canvas;

	function canClick(event) {
		if(isHover(event.clientX, event.clientY)){
			self.onclick({
				'target':self,
				'x': event.clientX,
				'y': event.clientY
			});
		}
	}
	function isHover(mx,my){
		mx-=canvas.offset().left;
		my-=canvas.offset().top;
		if(self.isEnable && mx>x && mx<(x+w) && my>y && my<(y+h)){
			return true;
		}
		return false;
	}
	canvas.bind('click', canClick);
	canvas.bind('mousemove', function(event) {
		if(self.isEnable && self.isVisible){
			
			if(isHover(event.clientX, event.clientY)){
				var ctx = canvas[0].getContext("2d");
				ctx.fillStyle = "#999";
				ctx.fillRect(x, y, w, h);
				ctx.fillStyle = "black";
				ctx.font = "12px Comic Sans MS";
				ctx.fillStyle = "#FFF";
				printAt(ctx, self.text, x+20, y+25, w, 15);
			}else{

				var ctx = canvas[0].getContext("2d");
				ctx.fillStyle = "#555";
				ctx.fillRect(x, y, w, h);
				ctx.fillStyle = "black";
				ctx.font = "12px Comic Sans MS";
				ctx.fillStyle = "#FFF";
				printAt(ctx, self.text, x+20, y+25, w, 15);
			}
		}
	});
	self.delete = function(){
		canvas.unbind('click', canClick);
	}
	self.draw = function (){
		if(self.isVisible){
			var ctx = canvas[0].getContext("2d");
			ctx.fillStyle = "#555";
			ctx.fillRect(x, y, w, h);
			ctx.fillStyle = "black";
			ctx.font = "12px Arial";
			ctx.fillStyle = "#FFF";
			printAt(ctx, self.text, x+20, y+25, w, 15);
		}
	}
}

/*
* Class:: для изображения элиментов интерфейса
*/
function TanInterface(options, tanEngine){
	let self = this; 
	self.items ={};
	initiate();
	//инициация интерфейса
	function initiate(){
		p=40;
		m=20;
		width = options['canvas']['width']-p*2;
		height = options['bubble']['height'];
		x = p;
		y = options['canvas']['height']-(height+p);

		self.items['nextBtn']=new Bubble(options);
		self.items['nextBtn'].click(function (){
			tanEngine.execScript();
		});
	}
	// вывод интерфейса на канву
	self.show = function(){
		for(item in self.items){
			self.items[item].draw()
		}
	}
	self.disable = function(){
		for(item in self.items){
			self.items[item].disable();
		}
	}
	self.enable = function(){
		for(item in self.items){
			self.items[item].enable();
		}
	}
}

/*
* Class:: бабл для вывода текста
*/
function Bubble(options){
	let self = this;
	self.canvasOpt = options['canvas'];
	self.bubbleOpt = options['bubble'];
	let p = 20;

	let div = $('<div>')
		.css('width',self.canvasOpt['width'] -2*p)
		.css('height',self.bubbleOpt['height']-p)
		.css('margin-top',-self.bubbleOpt['height'])
		.addClass('bubble').insertAfter(self.canvasOpt['canvas']);

	let header = $('<h4>').css('margin',p).appendTo(div);
	let height = div.height()-4*p; 
	let content = $('<div>').addClass('bubble-content').css('height',height).appendTo(div);
	

	self.isEnable = true;
	self.click = function (handler){
		div.bind('click', function(event){
			trgt = event.target;
		    if(trgt == div[0] 
		    	|| trgt == content[0]
		    	|| trgt == header[0]) {
        		handler();
    		}
		});
	}		
	self.draw = function(){
		if(self.isEnable)
		{
			div.show();
		}
		else
		{
			div.hide();
		}
	}
	self.disable = function(){
		self.isEnable = false;
		div.hide();
	}
	self.enable = function(){
		self.isEnable = true;
		div.show();
	}
	self.print = function(cmd){
		let color = (cmd['color']?cmd['color']:'red');
		content.html('<p>'+cmd['text']+'</p>');
		if(color){
			header.text(cmd['char']).css('color', color);
		}
		let codeClickPrevent = function(event){
			event.preventDefault();
		}
		let codeText = div.find('code');
		codeText.unbind(codeClickPrevent);
		codeText.bind(codeClickPrevent);
	}
}

/*
* Class:: класс для вывода доски с заданием
*/
function board(options){
	let self = this;
	self.canvasOpt = options['canvas'];
	self.bubbleOpt = options['bubble'];
	let p = 20;
	
	
	let div = $('<div>')
		.css('width',self.canvasOpt['width'] -2*p)
		.css('height',self.canvasOpt['height']- (self.bubbleOpt['height']+p))
		.css('margin-top',-self.canvasOpt['height'])
		.addClass('board').insertAfter(self.canvasOpt['canvas']);

	let header = $('<h4>').css('margin',p).appendTo(div);
	let height = div.height()-4*p; 
	let content = $('<div>').addClass('board-content').css('height',height).appendTo(div);
	

	self.isEnable = true;
	self.click = function (handler){
		div.bind('click', handler);
	}		
	self.draw = function(){
		if(self.isEnable)
		{
			div.show();
		}
		else
		{
			div.hide();
		}
	}
	self.disable = function(){
		self.isEnable = false;
		div.hide();
	}
	self.enable = function(){
		self.isEnable = true;
		div.show();
	}
	self.print = function(cmd){
		let color = (cmd['color']?cmd['color']:'red')
		if(cmd['color']==null)
		content.html(cmd['text']);
		header.text(cmd['char']).css('color', color);
	}
}


/*
* Класс персонажа
*/
function character(){
	
}

/*
* Class:: движка. Инкапсулирует в себе все компоненты игры и обрабатывает их.
*/
function TanEngine(options){
	let scriptStr = 0;
	let self = this;
	let script;
	
	//записываем настройки
	self.canvasOpt = options['canvas'];
	self.bubbleOpt = options['bubble'];
	//вытащим канву
	let canvas = self.canvasOpt['canvas'];
	//загрузим изображения
	self.imgResources={};
	//текущая сцена
	self.sceneImg;
	//метки для перехода
	let labels = {};
	//меню
	let menu= new Menu(options, self);
	
	self.interface = new TanInterface(options, self);
	
	//персонажи
	var chars = {'left':null, 'center':null, 'right':null};
	
	canvas.attr('width',self.canvasOpt['width']);
	canvas.attr('height',self.canvasOpt['height']);
	self.context = canvas[0].getContext("2d");
	
	self.context.fillStyle = self.canvasOpt['color'];
	self.context.fillRect(0, 0, self.canvasOpt['width'], self.canvasOpt['height']);
	
	/*
	* Выводит персонажа на экран, в уазанном положении
	* ToDo:: Стоит вынести персонажа в отдельный класс
	*/
	function drawCharacter(animation = 'none'){
		let context = self.context;
		let canvasOpt = self.canvasOpt;
		let bubbleOpt = self.bubbleOpt;


		if(chars['left']!=null){
			img = self.imgResources[chars['left']];
			let imgWidth = img.width;
			let imgHeight = img.height;
			let offY = canvasOpt['height']-imgHeight;
			offX = canvasOpt['width']*0.02;
			context.drawImage(img,offX, offY);
		}
		
		if(chars['center']!=null){
			img = self.imgResources[chars['center']];
			let imgWidth = img.width;
			let imgHeight = img.height;
			let offY = canvasOpt['height']-imgHeight;
			offX = canvasOpt['width']*0.5 - imgWidth*0.5;
			context.drawImage(img,offX, offY);
		}
		
		if(chars['right']!=null){
			img = self.imgResources[chars['right']];
			let imgWidth = img.width;
			let imgHeight = img.height;
			let offY = canvasOpt['height']-imgHeight;
			offX = canvasOpt['width']*0.98 - imgWidth;
			context.drawImage(img, offX, offY );
		}

		
	}
	
	/*
	* Выводит сцену на экран
	*/
	function drawScene(filter='none',animation = 'none'){
		sceneImg = self.imgResources[self.sceneImg];
		if(sceneImg!=null){
			self.context.drawImage(sceneImg,0,0);
		}
	}
	
	/*
	* Выводит реч персонажа на экран
	*/
	/*
	PS:: закоменчено до лучших времен
	function charSay(options){
		//padding
		p=40;
		m=20;
		context = self.context;
		width = self.canvasOpt['width']-p*2;
		height = self.bubbleOpt['height'];
		context.font = "15px Arial";

		x = p;
		y = self.canvasOpt['height']-(height+p);
		
		var grd = context.createLinearGradient(x,y, width, height);
		grd.addColorStop(0, "#8Af");
		grd.addColorStop(1, "#fff");
		context.fillStyle = grd;
		context.fillRect(x,y, width, height);
		context.fillStyle = 'black';
		context.rect(x,y, width, height);
		context.stroke();
		if(options['color']!=null){
			context.fillStyle = options['color'];
		}else{
			context.fillStyle = 'red';
		}
		
		printAt(context, options['char'], x+p,y+p, width-p,  height-p);
		context.fillStyle = 'black';
		printAt(context, options['text'], x+p,y+p*2, width-p*2, 20);
		context.font = "12px Arial";
	}*/
	function charSay(cmd){

		self.interface.items['nextBtn'].print(cmd);
	}
	
	//грузит изображения
	function loadImages(imgs){
		countOfUnloaded=Object.keys(imgs).length;
		for(var imgName in imgs){
			self.imgResources[imgName] = new Image();
			self.imgResources[imgName].src = imgs[imgName];
			self.imgResources[imgName].onload= function (){
				countOfUnloaded--;
				if(countOfUnloaded==0){
					self.execScript();
				}
			}
		}		
	}
	
	/*
	* Метод перехода к метке
	*/
	function goTo(label){
		if(labels[label]!=null){
			scriptStr = labels[label];
		}else{
			for(i=script.length-1; i>=0; i--){
				if(script[i][0]=='label'){
					let tmpLabel = script[i][1];
					labels[tmpLabel]=i;
					if( tmpLabel == label){
						scriptStr = i;
						i = 0;
					}
				}
			}
		}
	}
	self.goTo = goTo;
	
	/*
	* Запуск игры
	*/
	self.start = function (scriptOptions){
		script=scriptOptions['script']
		loadImages(scriptOptions['resources']['imgs']);
	}
	
	/*
	* Метод интерпритатор
	*/
	self.execScript = function (){
		for(scriptStr; scriptStr<script.length;scriptStr++){
			instruction = script[scriptStr][0];
			cmd = script[scriptStr][1];
			switch(instruction){
				case 'char':{
					chars[cmd['position']] = cmd['img'];
				}break;
				case 'scene':{
					self.sceneImg = cmd['img'];
					chars={};
				}break;
				case 'say':{
					let items = self.interface.items;
					items['nextBtn'].enable();
					charSay(cmd);
					scriptStr++;
					return;
				}break;
				case 'board':{
					let items = self.interface.items;
					items['nextBtn'].enable();
					items['board'].enable();
					charSay(cmd);
					scriptStr++;
					return;
				}break;
				case 'menu':{
					self.interface.disable();
					menu.showMenu(cmd);
					return;
				}break;
				case 'to':{
					goTo(cmd);
				}break;
				case 'stop':{//добавлено для асинхронных команд
					return; 
				}break;
				case 'label':{
					labels[cmd] = scriptStr; 
				}break;
			}
			let castomInstuctions = options['castomInstuctions'];
			if(castomInstuctions!=null && castomInstuctions[instruction]!=null){
				castomInstuctions[instruction](cmd,self);
			}
			self.interface.disable();
			drawScene();
			drawCharacter();
			self.interface.show();
		}
	}
}

