function CodeEditor(id){
	let self = this;
	let editor = ace.edit(id+"-editor");
	editor.setOptions({
	  fontFamily: "tahoma",
	  fontSize: "13pt"
	});
	self.editor = editor;
	//id задания
	self.id;
	self.name = $("#"+id+"-name");
	self.ex= $("#"+id+"-ex");
	results= $("#"+id+"-results");
	footerBtns = $("#"+id+"-buttons");
	footerProgress = $("#"+id+"-progress");

	sendBtn = $('#'+id+"-send").bind("click",_sendCode);
	editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/python");
	_progressHide();
	self.bindSkip = function(event, calback){
		$('#'+id+'-skip').bind(event, calback);
	}
	self.bindSend = function(event, calback){
		$('#'+id+'-send').bind(event, calback);
	}
	self.getCode=function(){
		return editor.getValue();
	}

	function _progressShow(){
		footerProgress.show();
		footerBtns.hide();
	}
	function _progressHide(){
		footerProgress.hide();
		footerBtns.show();
	}
	function _specSym(str){
		if(str!=null){
			str=str.replace(/\\n/g, "\n")
			.replace(/\\t/g, "\t")
			.replace(/\$qv/g, '"')
			.replace(/\\'/g, "'");
		}
		return str;
	}
	self.setCode=function(code){
		code = _specSym(code);
		return editor.setValue(code);
	}
	self.show = function(){
		$('#'+id).modal('show');
	}
	self.close = function(){
		$('#'+id).modal('close');
	}
	/*
		Отправка запроса для проверки кода.
	*/
	function _sendCode(){
		let data = {"command":"code", "id":self.id,"code":self.getCode()};
		let outPrfx = '<hr class="bg-light"/>';
		_progressShow();
		$.ajax({
			method:'POST',
			dataType: 'json',
			data:data,
			url: '/game/command/',
			success: function(data){
				if(data['status']=="success"){
					results.html(outPrfx+'<h4>Задача решена успешно, можете закрыть окно</h4>');
				}else{
					let error = _specSym(data['error_text']);
					error = outPrfx+'<h4>Ошибка!</h4><code>'+error+'</code>';
					results.html(error);
				}
			},
	 		error:function(data){
				results.text("Ошибка соединения!");
			},
			complete:function(){
				_progressHide();
			}
		});
	}
}

/*
* Сюда обращатся для работы с эдитором
*/
var editor = new CodeEditor('code');
