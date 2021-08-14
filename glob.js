let kystr="";
function refil(id){
	if (id=="new")return;
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			shw(this.responseText);
			
		}
	  };
	xhttp.open("POST", "http://localhost:8000", true);
	xhttp.setRequestHeader("Content-type", "text/plain");
	xhttp.send(`"refil":"${id}","dta":"${kystr}"`);
}

function shw(x){
	let dta=JSON.parse(x.replace(/\n/g,"\\n").replace(/&/g,"\&"));//JSON does not allow new line character, so it is replaced with the literal one,"\\n"
	let kys=Object.keys(dta);
	for (let i=0;i<kys.length;i++){
		ky=kys[i];
		document.getElementById(ky).value=dta[ky];
	}
	//shwT(dta);//can't find this function
}

