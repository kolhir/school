function CodeEditor(id){
	let self = this;
	let editor = ace.edit(id+"-editor");
	self.editor = editor;
	self.name = $("."+id+"-name");
	self.ex= $("."+id+"-ex");
	editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/python");
	self.bindSkip = function(event, calback){
		$(id+'-skip').bind(event, calback);
	}
	self.bindSend = function(event, calback){
		$(id+'-send').bind(event, calback);
	}
	self.getCode=function(){
		return editor.getValue();
	}
	self.setCode=function(code){
		return editor.setValue(code);
	}
	self.show = function(){
		$('.'+id).modal('show');
	}
	self.close = function(){
		$('.'+id).modal('close');
	}
}
/*
* Сюда обращатся для работы с эдитором
*/
var editor = new CodeEditor('code');
