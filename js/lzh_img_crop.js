var crop_obj = null;
function LzhImgCrop(image,canvaId,preview_canvaId,width,height){
	 this.image = image;
	 this.canvas = document.getElementById(canvaId);
	 this.ctx = this.canvas.getContext('2d');
	 this.preview_canvas = document.getElementById(preview_canvaId);
	 this.preview_ctx = this.preview_canvas.getContext('2d');
	 this.x = 0;
	 this.y = 0;
	 this.width = width;
	 this.height = height;
	 this.preview_width = 200;
	 this.preview_height = 200;
	 this.mousedown = false;
	 this.mouseup = false;
	 this.selection = new Selection(0,0,0,0);
	 crop_obj = this;
	 this.canvas.width = this.width;
	 this.canvas.height = this.height;
	 this.preview_canvas.width = this.preview_width;
	 this.preview_canvas.height = this.preview_height;
	 
	 this.canvas.onmousedown= this.CanvasMouseDown;
	 this.canvas.onmousemove= this.CanvasMouseMove;
	 this.canvas.onmouseup= this.CanvasMouseUp;
	 this.canvas.onmouseout=this.CanvasMouseOut;

	 this.drawImg();
}

LzhImgCrop.prototype.drawImg = function(){
	this.ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
}

LzhImgCrop.prototype.drawPreImg = function(){
	var reduce_x = this.selection.x1 - this.selection.x2
	var reduce_y = this.selection.y1 - this.selection.y2
	var start_x = 0;
	var start_y = 0;
	if (reduce_x<=0){
		start_x = this.selection.x1
	}else{
		start_x = this.selection.x2
	}
	if(reduce_y<=0){
		start_y = this.selection.y1
	}else{
		start_y = this.selection.y2
	}
	this.preview_ctx.drawImage(this.image,start_x,start_y,Math.abs(reduce_x),Math.abs(reduce_y),this.x,this.y,Math.abs(reduce_x),Math.abs(reduce_y))
}


LzhImgCrop.prototype.CanvasMouseUp = function(e){
	console.log("up")
	if(crop_obj.mousedown){
		crop_obj.mousedown = false;
		crop_obj.selection.x2 = e.offsetX;
		crop_obj.selection.y2 = e.offsetY;
		crop_obj.drawPreImg();
	}
}

LzhImgCrop.prototype.CanvasMouseDown = function(e){
	console.log("down")
	if(crop_obj.selection.is_select){
		crop_obj.selection.ClearSelection();
	}else{

	}
		crop_obj.mousedown = true;
		crop_obj.selection.x1 = e.offsetX;
		crop_obj.selection.y1 = e.offsetY;
}

LzhImgCrop.prototype.CanvasMouseMove = function(e){
	console.log("move")
	if(crop_obj.mousedown){
		
	}
}

LzhImgCrop.prototype.CanvasMouseOut = function(e){
	console.log("out")
	if(crop_obj.mousedown && !crop_obj.mouseup){

	}
	// alert(crop_obj.selection.x1)
	// alert(crop_obj.selection.y1)
	// alert(crop_obj.selection.x2)
	// alert(crop_obj.selection.y2)
}

LzhImgCrop.prototype.GetResultData = function(){
	var data=this.preview_canvas.toDataURL();
	data=data.split(',')[1];
	data=window.atob(data);
	var ia = new Uint8Array(data.length);
	for (var i = 0; i < data.length; i++) {
    	ia[i] = data.charCodeAt(i);
	};
	var blob=new Blob([ia], {type:"image/png"});
	return blob;
}

function Selection(x1,y1,x2,y2){
	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;
	this.is_select = false;
}

Selection.prototype.ClearSelection = function(){

}