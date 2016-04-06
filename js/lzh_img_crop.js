var crop_obj = null;
function LzhImgCrop(image,canvaId,can_cover,width,height,preview_canvaId,preview_width,preview_height){
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
	 this.width_scale = image.naturalWidth / width;
	 this.height_scale = image.naturalHeight / height;
	 if (preview_canvaId){
	   this.preview_canvas = document.getElementById(preview_canvaId);
	   this.is_preview = true;
	 }else{
	 	$("<canvas id='auto_preview_canvas'></canvas>").insertAfter($(this.canvas))
	 	this.preview_canvas = document.getElementById("auto_preview_canvas"); 
	 	//this.preview_canvas.style.display="none"
	 }
	  this.preview_ctx = this.preview_canvas.getContext('2d');
	  if(preview_width){
	   this.preview_width = preview_width;
	  }else{
	  	this.preview_width = 100;
	  }
	  if(preview_height){
	  	this.preview_height = preview_height;
	  }else{
	   this.preview_height = 100;
	  }
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

	// var reduce_x = this.selection.x1 - this.selection.x2
	// var reduce_y = this.selection.y1 - this.selection.y2
	// var start_x = 0;
	// var start_y = 0;
	// if (reduce_x<=0){
	// 	start_x = this.selection.x1
	// }else{
	// 	start_x = this.selection.x2
	// }
	// if(reduce_y<=0){
	// 	start_y = this.selection.y1
	// }else{
	// 	start_y = this.selection.y2
	// }
	//var imgData = this.ctx.getImageData(this.selection.start_x,this.selection.start_y,Math.abs(this.selection.reduce_x),Math.abs(this.selection.reduce_y))
	//this.preview_ctx.putImageData(imgData,0,0,0,0,this.preview_width,this.preview_height)
	this.preview_ctx.drawImage(this.image,this.selection.start_x*this.width_scale,this.selection.start_y*this.height_scale,Math.abs(this.selection.reduce_x*this.width_scale),Math.abs(this.selection.reduce_y*this.height_scale),this.x,this.y,this.preview_width,this.preview_height)
	
}

LzhImgCrop.prototype.MoveDrawPreImg = function(){

}

LzhImgCrop.prototype.CanvasMouseUp = function(e){
	console.log("up")
	if(crop_obj.mousedown && crop_obj.selection.is_change_position){
		crop_obj.selection.is_change_position = false ;
		crop_obj.mousedown = false;
		// crop_obj.selection.x2 = e.offsetX;
		// crop_obj.selection.y2 = e.offsetY;
		// if (crop_obj.is_preview){ 
		// 	crop_obj.drawPreImg();
		// }
		 crop_obj.selection.is_select = true;
		// crop_obj.selection.drawRect();
	}else if(crop_obj.mousedown){
		crop_obj.mousedown = false;
		crop_obj.selection.is_select = true;
	}
}

LzhImgCrop.prototype.CanvasMouseDown = function(e){
	// console.log("down")
	
	if(crop_obj.selection.is_select && crop_obj.selection.IsDownInside(e)){
		console.log("down_move")
		 crop_obj.selection.RecordMoveInfo(e);
	}else if(crop_obj.selection.is_select){
		console.log("down_clear")
		crop_obj.selection.ClearSelection();
		crop_obj.selection.x1 = e.offsetX;
		crop_obj.selection.y1 = e.offsetY;
	}else{
		console.log("down")
		crop_obj.selection.x1 = e.offsetX;
		crop_obj.selection.y1 = e.offsetY;
	}
		crop_obj.mousedown = true;
		
}

LzhImgCrop.prototype.CanvasMouseMove = function(e){
	
	// var reduce_x = 0;
	// var reduce_y = 0;
	var draw = false;
	
	if(crop_obj.mousedown && crop_obj.selection.is_change_position){
		console.log("move_change")
			crop_obj.selection.move_x2 = e.offsetX;
			crop_obj.selection.move_y2 = e.offsetY;
			crop_obj.selection.CountDistance()
			crop_obj.selection.Move()
			draw = true
			// reduce_x = crop_obj.selection.move_x1 - crop_obj.selection.move_x2
			// reduce_y = crop_obj.selection.move_y1 - crop_obj.selection.move_y2
	}else if(crop_obj.mousedown){
		console.log("move_select")
		crop_obj.selection.x2 = e.offsetX;
		crop_obj.selection.y2 = e.offsetY;
		crop_obj.selection.CountDistance()
		draw = true
	}
	if (draw){
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
	//var img = this.ctx.getImageData(this.selection.start_x,this.selection.start_y,Math.abs(this.selection.reduce_x),Math.abs(this.selection.reduce_y))
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
	this.reduce_x = 0;
	this.reduce_y = 0;
	this.start_x = 0;
	this.start_y = 0;
	this.end_x = 0;
	this.end_y = 0;
	this.move_x1 = 0;
	this.move_x2 = 0;
	this.move_y1 = 0;
	this.move_y2 = 0;
	this.is_change_position = false;
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
	// var reduce_x = this.x1 - this.x2
	// var reduce_y = this.y1 - this.y2
	// var start_x = 0;
	// var start_y = 0;
	// if (reduce_x<=0){
	// 	start_x = this.x1
	// }else{
	// 	start_x = this.x2
	// }
	// if(reduce_y<=0){
	// 	start_y = this.y1
	// }else{
	// 	start_y = this.y2
		
	// }
	// this.ctx.beginPath();
	// this.ctx.moveTo(start_x,start_y);
	// this.ctx.lineTo(start_x,end_y);
	// this.ctx.lineTo(end_x,end_y);
	// this.ctx.lineTo(end_x,start_y);
	// this.ctx.closePath();
	// this.ctx.stroke();
	// this.ctx.fillStyle="green";
	// this.ctx.fill();
	this.ctx.clearRect(this.start_x,this.start_y,Math.abs(this.reduce_x),Math.abs(this.reduce_y))	
}
Selection.prototype.CountDistance = function(){
	this.reduce_x = this.x1 - this.x2
	this.reduce_y = this.y1 - this.y2
	
	if (this.reduce_x<=0){
		this.start_x = this.x1
		this.end_x = this.x2
	}else{
		this.start_x = this.x2
		this.end_x = this.x1
	}
	if(this.reduce_y<=0){
		this.start_y = this.y1
		this.end_y = this.y2
	}else{
		this.start_y = this.y2
		this.end_y = this.y1
		
	}
}
Selection.prototype.IsDownInside = function(e){
	if (e.offsetX > this.start_x && e.offsetX < this.end_x && e.offsetY > this.start_y && e.offsetY < this.end_y){
		return true;
	}
	return false;
}
Selection.prototype.RecordMoveInfo = function(e){
	this.is_change_position = true;
	this.move_x1 = e.offsetX;
	this.move_y1 = e.offsetY;
}
Selection.prototype.Move = function(){
	var reduce_x = this.move_x1 - this.move_x2
	var reduce_y = this.move_y1 - this.move_y2
	this.x1 -= reduce_x
	this.x2 -= reduce_x
	this.y1 -= reduce_y
	this.y2 -= reduce_y
	this.move_x1 = this.move_x2
	this.move_y1 = this.move_y2

}




