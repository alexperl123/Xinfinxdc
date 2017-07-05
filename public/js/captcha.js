var captchaText = '';
function Captcha(){
	var alpha = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z');
	var i;
	for (i=0;i<6;i++){
		var a = alpha[Math.floor(Math.random() * alpha.length)];
		var b = alpha[Math.floor(Math.random() * alpha.length)];
		var c = alpha[Math.floor(Math.random() * alpha.length)];
		var d = alpha[Math.floor(Math.random() * alpha.length)];
		var e = alpha[Math.floor(Math.random() * alpha.length)];
		var f = alpha[Math.floor(Math.random() * alpha.length)];
		var g = alpha[Math.floor(Math.random() * alpha.length)];
	}
	var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' '+ f + ' ' + g;
	document.getElementById("mainCaptcha").innerHTML = code
	captchaText = removeSpaces(code);
}
function ValidCaptcha(){
	var string1 = captchaText;
	var string2 = document.getElementById('txtInput').value;
	if (string1 == string2){
		return true;
	}
	else{
		return false;
	}
}
function removeSpaces(string){
	return string.split(' ').join('');
}

Captcha();