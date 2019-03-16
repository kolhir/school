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
	self.setCode=function(code){
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
		data = {"command":"code", "id":self.id,"code":self.getCode()};
		$.ajax({
			method:'POST',
			dataType: 'json',
			data:data,
			url: 'http://127.0.0.1:5000/game/command/',
			success: function(data){
				if(data['status']=="success"){
					results.html('<h4>Задача решена успешно, можете закрыть окно</h4>');
				}else{
					let error = data['error']
					results.html('<h4>Ошибка!</h4><code>'+error+'</code>');
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
