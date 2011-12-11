// extending array with sum and max methods

Array.prototype.sum = function(){
	for(var i=0,sum=0;i<this.length;sum+=this[i++]);
	return sum;
}
Array.prototype.max = function(){
	return Math.max.apply({},this)
}
Array.prototype.first = function(){
	return this[0];
}
Array.prototype.last = function(){
	return this[this.length-1];
}