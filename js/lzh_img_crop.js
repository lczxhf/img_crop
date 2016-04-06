var crop_obj = null;
function LzhImgCrop(image,canvaId,can_cover,width,height,preview_canvaId){
		 crop_obj = this;
	 this.image = image;
	 this.canvas = document.getElementById(canvaId);
	 this.ctx = this.canvas.getContext('2d');
	 this.x = 0;
	 this.y = 0;
	 this.width = width;
	 this.height = height;
	 this.can_cover = can_cover
	 this.is_preview = false;
	 if (preview_canvaId){
	   this.preview_canvas = document.getElementById(preview_canvaId);
	   this.is_preview = true;
	 }else{
	 	$("<canvas id='auto_preview_canvas'></canvas>").insertAfter($(this.canvas))
	 	this.preview_canvas = document.getElementById("auto_preview_canvas"); 
	 	this.preview_canvas.style.display="none"
	 }
	  this.preview_ctx = this.preview_canvas.getContext('2d');
	  this.preview_width = 200;
	   this.preview_height = 200;
	   this.preview_canvas.width = this.preview_width;
	   this.preview_canvas.height = this.preview_height;

	 this.mousedown = false;
	 this.mouseup = false;
	 this.selection = new Selection(0,0,0,0);

	 this.canvas.width = this.width;
	 this.canvas.height = this.height;
	 
	 
	 this.canvas.onmousedown= this.CanvasMouseDown;
	 this.canvas.onmousemove= this.CanvasMouseMove;
	 this.canvas.onmouseup= this.CanvasMouseUp;
	 this.canvas.onmouseout=this.CanvasMouseOut;
	 this.drawImg();
}

LzhImgCrop.prototype.drawImg = function(){
	this.ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
	
	this.selection.ClearSelection();
}

LzhImgCrop.prototype.drawPreImg = function(){
	// this.preview_ctx.clearRect(this.x,this.y,this.preview_width,this.preview_height)
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
		if (crop_obj.is_preview){ 
			crop_obj.drawPreImg();
		}
		crop_obj.selection.is_select = true ;
		crop_obj.selection.drawRect();
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
		crop_obj.selection.x2 = e.offsetX;
		crop_obj.selection.y2 = e.offsetY;
		
		crop_obj.selection.ClearSelection();
		if(crop_obj.is_preview){
			crop_obj.drawPreImg();
		}
		crop_obj.selection.drawRect();
	}
}

LzhImgCrop.prototype.CanvasMouseOut = function(e){
	console.log("out")
	if(crop_obj.mousedown && !crop_obj.mouseup){
		crop_obj.CanvasMouseUp(e);
	}
	// alert(crop_obj.selection.x1)
	// alert(crop_obj.selection.y1)
	// alert(crop_obj.selection.x2)
	// alert(crop_obj.selection.y2)
}

LzhImgCrop.prototype.GetResultData = function(){
	crop_obj.drawPreImg()
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
	this.canvas = document.getElementById(crop_obj.can_cover);
	this.ctx=this.canvas.getContext("2d");
	$("#"+crop_obj.can_cover).css("top",crop_obj.canvas.offsetTop);
	$("#"+crop_obj.can_cover).css("left",crop_obj.canvas.offsetLeft);
	this.canvas.width = crop_obj.width;
	this.canvas.height = crop_obj.height
	// this.canvas.onmousedown = function(e){
	// 	alert("cover"+e.offsetX)
	// }
}

Selection.prototype.ClearSelection = function(){
	if(crop_obj.is_preview){
		crop_obj.preview_ctx.clearRect(crop_obj.x,crop_obj.y,crop_obj.preview_width,crop_obj.preview_height)
	}
	crop_obj.selection.ctx.fillStyle="gray";
	crop_obj.selection.ctx.fillRect(0,0,crop_obj.width,crop_obj.height);
}

Selection.prototype.drawRect = function(){
	var reduce_x = this.x1 - this.x2
	var reduce_y = this.y1 - this.y2
	var start_x = 0;
	var start_y = 0;
	if (reduce_x<=0){
		start_x = this.x1
	}else{
		start_x = this.x2
	}
	if(reduce_y<=0){
		start_y = this.y1
	}else{
		start_y = this.y2
		
	}
	// this.ctx.beginPath();
	// this.ctx.moveTo(start_x,start_y);
	// this.ctx.lineTo(start_x,end_y);
	// this.ctx.lineTo(end_x,end_y);
	// this.ctx.lineTo(end_x,start_y);
	// this.ctx.closePath();
	// this.ctx.stroke();
	// this.ctx.fillStyle="green";
	// this.ctx.fill();
	this.ctx.clearRect(start_x,start_y,Math.abs(reduce_x),Math.abs(reduce_y))	
}


