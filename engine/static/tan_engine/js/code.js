function CodeEditor(id){
	let self = this;
	let editor = ace.edit(id+"-editor");
	self.editor = editor;
	//id задания
	self.id;
	self.name = $("#"+id+"-name");
	self.ex= $("#"+id+"-ex");
	results= $("#"+id+"-results");
	sendBtn = $('#'+id+"-send").bind("click",_sendCode);
	editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/python");
	self.bindSkip = function(event, calback){
		$('#'+id+'-skip').bind(event, calback);
	}
	self.bindSend = function(event, calback){
		$('#'+id+'-send').bind(event, calback);
	}
	self.getCode=function(){
		return editor.getValue();
	}
	function _specSym(str){
		return str.replace(/\\n/g, "\n")
			.replace(/\\t/g, "\t")
			.replace(/$$qv/g, '"')
			.replace(/\\'/g, "'");
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
		$.ajax({
			method:'POST',
			dataType: 'json',
			data:data,
			url: 'http://127.0.0.1:5000/game/command/',
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
			}
		});
	}
}

/*
* Сюда обращатся для работы с эдитором
*/
var editor = new CodeEditor('code');
