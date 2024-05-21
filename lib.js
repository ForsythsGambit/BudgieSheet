function interpolate(theString, argumentArray){
	//credit: CPHPython from https://stackoverflow.com/a/31007976/13528266
    var regex = /%s/;
    var _r=function(p,c){return p.replace(regex,c);}
    return argumentArray.reduce(_r, theString);
}