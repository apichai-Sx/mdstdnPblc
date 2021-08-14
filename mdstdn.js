const Pdf= require('pdfkit');
exports.xprt=(x)=>{
	let pdf= new Pdf({size: 'A4'});
	//pdf.pipe(fs.createWriteStream('mdstdn.pdf'));
	pdf.font('THSarabun.ttf');
	let dta=JSON.parse(x);
	pdf.fontSize(20);
	pdf.text("SURATTHANI HOSPITAL\nMedical Education Center\n\n",{align:'center'});
	pdf.fontSize(14);
	let cox=pdf.x;
	let lft=cox;
	let coy=pdf.y;
	let wdth=0;
	let hgt1=0;
	pdf.text("Division",cox+5,coy);if(wdth< pdf.widthOfString("Division"))wdth=pdf.widthOfString("Division");
	pdf.text(dta["divsn"]);if(wdth<pdf.widthOfString(dta["divsn"]))wdth=pdf.widthOfString(dta["divsn"]);
	hgt1=pdf.y;
	pdf.text("Attending Staff");if(wdth<pdf.widthOfString("Attending Stafff"))wdth=pdf.widthOfString("Attending Staff");
	pdf.text(dta["staff"]);if(wdth<pdf.widthOfString(dta["staff"]))wdth=pdf.widthOfString(dta["staff"]);
	pdf.moveTo(cox,hgt1).lineTo(cox+wdth+10,hgt1);
	pdf.rect(cox,coy,wdth+10,pdf.y-coy).stroke();
	cox=cox+wdth+10;wdth=0;
	pdf.text("Ward",cox+5,coy);if(wdth< pdf.widthOfString("Ward"))wdth=pdf.widthOfString("Ward");
	pdf.text(dta["wrd"]);if(wdth<pdf.widthOfString(dta["wrd"]))wdth=pdf.widthOfString(dta["wrd"]);
	pdf.text("Resident/Intern");if(wdth< pdf.widthOfString("Resident/Intern"))wdth=pdf.widthOfString("Resident/Intern");
	pdf.text(dta["senior"]);if(wdth<pdf.widthOfString(dta["senior"]))wdth=pdf.widthOfString(dta["senior"]);
	pdf.moveTo(cox,hgt1).lineTo(cox+wdth+10,hgt1);
	pdf.rect(cox,coy,wdth+10,pdf.y-coy).stroke();
	pdf.text("ชื่อผู้ป่วย "+dta["patient"], cox+wdth+60,coy);
	pdf.text("อายุ "+dta["age"]+" ปี เพศ "+dta["gender"]);
	pdf.text("HN "+dta["HN"]+" AN "+dta["AN"]);
	pdf.text("ชื่อ น.ศ.พ. "+dta["stdnName"]);
	pdf.text("รับไว้ใน รพ. วันที่ "+(new Date(dta["admitDt"])).toString().slice(4,15)+"\n\n");
	pdf.fontSize(20);
	pdf.text("Problem List",lft,pdf.y);
	pdf.fontSize(14);
	cox=pdf.x-60;
	lft=cox;
	coy=pdf.y;
	hgt1=pdf.y;
	let prblmL=["Num","Onset", "Active Problem", "Recorded", "-Inactive Problem\n-Treatment","Resolved"];
	let prblmW=[30,60,170,60,170,60];
	pdf.moveTo(cox,coy).lineTo(cox+prblmW[0]+prblmW[1]+prblmW[2]+prblmW[3]+prblmW[4]+prblmW[5],coy).stroke();
	for (let i=0;i<prblmL.length;i++){
		pdf.text(prblmL[i],cox,coy,{width:prblmW[i]});
		cox=cox+prblmW[i];
		if (hgt1<pdf.y)hgt1=pdf.y;
	}
	pdf.moveTo(lft,hgt1).lineTo(lft+prblmW[0]+prblmW[1]+prblmW[2]+prblmW[3]+prblmW[4]+prblmW[5],hgt1).stroke();
	prblmL=JSON.parse(dta["tbls"].replace(/'(?=[,\]])/g,'"').replace(/(?<=[,\[\s])'/g,'"'));//console.log(prblmL);
	cox=lft;
	coy=hgt1;
	for (let i=0;i<prblmL.length;i++){
		prblmL[i]=[i+1].concat(prblmL[i]);
		for(let j=0;j<prblmL[i].length;j++){
			if(j%2==1 && prblmL[i][j] !='')pdf.text((new Date(prblmL[i][j])).toString().slice(4,15),cox,coy,{width:prblmW[j]});
			else pdf.text(prblmL[i][j],cox,coy,{width:prblmW[j]});
			cox=cox+prblmW[j];
			if (hgt1<pdf.y)hgt1=pdf.y;
		}
	}
	pdf.addPage();
	header(pdf,dta);
	pdf.fontSize(20);
	pdf.fillColor('blue')
	pdf.text("Student Data Base");pdf.fillColor('black')
	pdf.fontSize(14);
	pdf.fillColor('blue');pdf.text("Patient Profile");pdf.fillColor('black');
	pdf.text("เพศ "+dta["gender"]+" อายุ "+dta["age"]+" ปี อาชีพ "+dta["job"]);
	pdf.text("ที่อยู่ "+dta["addr"]);
	pdf.text("สมาชิกในครอบครัว "+dta["famli"]);
	pdf.fontSize(20);
	pdf.fillColor('blue');pdf.text("History and Physical Examination");pdf.fontSize(14);
	pdf.text("Chief Complaint : ",{continued:true});pdf.fillColor('black');pdf.text(dta["CC"]);
	pdf.fillColor('blue');pdf.text("Pressent Illness : ");pdf.fillColor('black').text(dta["PI"]);
	pdf.fillColor('blue');pdf.text("Past History : ");pdf.fillColor('black').text(dta["PH"]);
	pdf.fillColor('blue');pdf.text("Personal History : ").fillColor('black').text(dta["PsnH"]);
	pdf.fillColor('blue');pdf.text("Systemic Review").fillColor('black');
	let sysrev=[["HEENT","HdNk"],["Cardiovascular","CVS"],["Respiratory","RS"],["Gastrointestinal","GI"],["Urological","KUB"],["Reproductive","Repr"],["Musculoskeleton","musc"],["Neurological\nand etc","Neuro"]];
	cox=pdf.x;
	lft=cox;
	coy=pdf.y;
	wdth=0;
	hgt1=0;
	for (let i=0;i<sysrev.length;i++){
		if(wdth< pdf.widthOfString(sysrev[i][0]))wdth=pdf.widthOfString(sysrev[i][0]);
	}
	for (let i=0;i<sysrev.length;i++){
		pdf.text(sysrev[i][0],lft,coy);
		hgt1=pdf.y;//if pdf.text() is not called, page will not inserted and pdf.y will not changed
		if(pdf.y<coy)coy=72;
		pdf.text(dta[sysrev[i][1]],lft+wdth,coy);
		if(pdf.y>hgt1){
			coy=pdf.y;
		}else {
			if(pdf.y>coy) coy=hgt1;else coy=pdf.y;
		}
	}
	pdf.moveDown();
	pdf.fontSize(20);
	pdf.fillColor('blue')
	pdf.text("Physical Examination",lft,pdf.y)
	pdf.fontSize(14);
	pdf.text("General appearance");pdf.fillColor('black');
	pdf.text(dta["GA"]);
	pdf.fillColor('blue')
	pdf.text("Vital Sign",lft,pdf.y);
	pdf.fillColor('black');
	pdf.text("BT = "+dta["BP"]+" C   BP = "+dta["BP"]+" mmHg   PR = "+dta["PR"]+" per minute   RR = "+dta["RR"]+ " per minute");
	let PE=[["HEENT","HEENT"],["Cardiovascular","cardiovascularEx"],["Respiratory","respiratoryEx"],["Abdominal","abdomnEx"],["Genitourinary","genitourinaryEx"],["musculoskeletal","musculoskeletnEx"],["neurological\nmisc.","neuroexam"]];
	cox=pdf.x;
	lft=cox;
	coy=pdf.y;
	wdth=0;
	hgt1=0;
	for (let i=0;i<PE.length;i++){
		if(wdth< pdf.widthOfString(PE[i][0]))wdth=pdf.widthOfString(PE[i][0]);
	}
	for (let i=0;i<PE.length;i++){
		pdf.text(PE[i][0],lft,coy);
		hgt1=pdf.y;
		if(pdf.y<coy)coy=72;
		pdf.text(dta[PE[i][1]],lft+wdth,coy);
		if(pdf.y>hgt1){
			coy=pdf.y;
		}else {
			if(pdf.y>coy) coy=hgt1;else coy=pdf.y;
		}
	}
	pdf.moveDown();
	pdf.fontSize(20);
	pdf.fillColor('blue')
	pdf.text("Investigation",lft,coy+40);//the lowest point below the table is coy
	pdf.fontSize(14);
	pdf.text("Laboratory Investigation");pdf.fillColor('black');
	let ivgMap={
		"complete blood count":[["Hct","percent"],["WBC","X 1000 cell per ml"],["neutrophyle","percent"],["lymphocyte","percent"],["monocyte","percent"],["Plt","X 1000 cell per ml"],["etc."," "]],
		"blood chemistry":[["BUN","mg/dL"],["Cr","mg/dL"], ["Na","mEq/L"],["K","mEq/L"],["HCO3","mEq/L"],["Cl","mEq/L"],["Ca","mEq/L"],["Mg","mEq/L"],["PO4","mEq/L"],["etc."," "]],
		"liver function test":[["globulin","g/dL"],["albumin","g/dL"],["alk. phosphatase","U/L"],["total bilirubin","mg/dL"],["direct Bilirubin","mg/dL"],["SGOT","U/L"],["SGPT","U/L"],["etc."," "]],
		"Urine Analysis":[["spgr"," "],["color"," "],["turbidity"," "],["protein"," "],["blood"," "],["RBC","cell per high power field"],["WBC","cell per high power field"],["etc."," "]],
		"stool exam":[["color"," "],["consistency"," "],["occount blood test"," "],["RBC","cell per high power field"],["WBC","cell per high power field"],["parasite"," "],["etc."," "]],
		"thyroid function test":[["TSH","mIU/L"],["T3","pmol/L"],["T4","pmol/L"],["Free T4","pmol/L"],["thyroglobulin"," "],["etc."," "]],
		"immunological examination":[["HBsAg"," "],["HBcAg"," "],["anti-HBs"," "],["anti-HBc"," "],["anti-HCV"," "],["anti-HIV"," "],["etc."," "]],
		"tumor marker":[["CA19-9"," "],["CA15-3"," "],["CEA"," "],["AFP"," "],["PSA"," "],["CA125"," "],["etc."," "]],
		"arterial blood gas":[["pO2","mmHg"],["pCO3","mmHg"],["O2sat","percent"],["pH"," "],["base excess"," "],["Hct","percent"],["etc."," "]],
		"fluid profile":[["specimen"," "],["WBC","cell per high power field"],["RBC","cell per high power field"],["pH"," "],["protein","g/dL"],["sugar","g/dL"],["Write stain"," "],["Gram stain"," "],["AFB"," "],["etc."," "]]
	};
	//"objTbl"
	let dTa=JSON.parse(dta["objTbl"].replace(/'(?=[,\]])/g,'"').replace(/(?<=[,\[\s])'/g,'"').replace(/\n/g,"\\n"));
	for (let i=0;i<dTa[0].length;i++){//icterate through every laboratory investigation
		pdf.text((new Date(dTa[0][i][0])).toString().slice(4,15),lft,pdf.y,{continued:true,underline :true});
		pdf.text("        "+dTa[0][i][1],{underline :true});
		let txt='';
		for (let j=0;j<dTa[0][i].length-2;j++){//icterate throught every item in individual laboratory investigation
			//let coy=pdf.y;
			pdf.text(ivgMap[dTa[0][i][1]][j][0],lft,pdf.y);pdf.y=pdf.y-14;
			pdf.text(dTa[0][i][j+2],lft+100,pdf.y);pdf.y=pdf.y-14;
			pdf.text(ivgMap[dTa[0][i][1]][j][1],lft+200,pdf.y);
		}
	}
	pdf.moveDown();
	pdf.fillColor('blue')
	pdf.text("Radiographic and Special Investigation",lft,pdf.y);pdf.fillColor('black');
	for (let i=0;i<dTa[1].length;i++){//icterate through every radiographic and special investigation
		pdf.text((new Date(dTa[1][i][0])).toString().slice(4,15),lft,pdf.y,{continued:true,underline :true});
		pdf.text(" "+dTa[1][i][1],{continued:true,underline :true});
		pdf.text(" "+dTa[1][i][2],{continued:true,underline :true});
		pdf.text(" of "+dTa[1][i][3],{underline :true});
		pdf.text(dTa[1][i][4]);
	}
	pdf.addPage();
	header(pdf,dta);
	pdf.fontSize(20);
	pdf.fillColor('blue');
	pdf.text("Student Initial Plan and Progress Note");
	pdf.fontSize(14);
	cox=595.28/2;
	lft=pdf.x;
	
	dTa=JSON.parse(dta["assessTbl"].replace(/'(?=[,\]])/g,'"').replace(/(?<=[,\[\s])'/g,'"').replace(/\n/g,"\\n"));
	pdf.text("Subjective");pdf.fillColor('black');
	pdf.text("Positive Finding",{continued:true,underline:true});
	pdf.text("Negative Finding",cox,pdf.y,{underline:true});
	coy=pdf.y;
	wdth=0;
	hgt1=0;
	let txt='';
	for (let i=0;i<dTa[0].length;i++){
		if(pdf.y+pdf.heightOfString(dTa[0][i],{width:(595.28-72-72)/2})>(841.89-72)){
			for(let j=0;j<dTa[1].length;j++){
				txt=txt+dTa[1][j]+"\n";
			}
			pdf.text(txt,cox,coy,{width:(595.28-72-72)/2})
			hgt1=pdf.y;
			pdf.y=72
			
		}
		pdf.text(dTa[0][i],lft,pdf.y);
		
	}
	if(txt == ''){
		for(let j=0;j<dTa[1].length;j++){
			txt=txt+dTa[1][j]+"\n";
		}
		pdf.text(txt,cox,coy,{width:(595.28-72-72)/2})
	}
	if (pdf.y<hgt1)pdf.y=hgt1;
	pdf.x=lft;
	pdf.fillColor('blue');
	pdf.text("Objective");pdf.fillColor('black');
	pdf.text("Positive Finding",{continued:true,underline:true});
	pdf.text("Negative Finding",cox,pdf.y,{underline:true});
	coy=pdf.y;
	wdth=0;
	hgt1=0;
	txt='';
	for (let i=0;i<dTa[2].length;i++){
		if(pdf.y+pdf.heightOfString(dTa[2][i],{width:(595.28-72-72)/2})>(841.89-72)){
			for(let j=0;j<dTa[3].length;j++){
				txt=txt+dTa[3][j]+"\n";
			}
			pdf.text(txt,cox,coy,{width:(595.28-72-72)/2})
			hgt1=pdf.y;
			pdf.y=72
			
		}
		pdf.text(dTa[2][i],lft,pdf.y);
		
	}
	if(txt == ''){
		for(let j=0;j<dTa[3].length;j++){
			txt=txt+dTa[3][j]+"\n";
		}
		pdf.text(txt,cox,coy,{width:(595.28-72-72)/2})
	}
	if (pdf.y<hgt1)pdf.y=hgt1;
	pdf.x=lft;pdf.moveDown();
	pdf.fillColor('blue');
	pdf.text("Provisional Diagnosis : ",{continued:true});
	pdf.fontSize(14);pdf.fillColor('black');
	pdf.text(dTa[4]);
	pdf.fillColor('blue');
	pdf.text("Differential Diagnosis");
	pdf.fontSize(14);pdf.fillColor('black');
	let num=0;
	for (let i=0;i<dTa[5].length;i++){
		pdf.text((++num)+". "+dTa[5][i][0],{underline:true});
		pdf.text("เหตุผลสนับสนุน");
		pdf.text(dTa[5][i][1],lft+20,pdf.y);pdf.x=lft;
		pdf.text("เหตุผลคัดค้าน");
		pdf.text(dTa[5][i][2],lft+20,pdf.y);pdf.x=lft;
	}
	pdf.moveDown();
	if(pdf.y>(841.89-72-40))pdf.addPage();
	pdf.fillColor('blue');
	pdf.text("Plan",{underline:true});
	pdf.moveDown();
	pdf.fontSize(14);
	dTa=JSON.parse(dta["iniPTbl"].replace(/'(?=[,\]])/g,'"').replace(/(?<=[,\[\s])'/g,'"').replace(/\n/g,"\\n"));
	pdf.fillColor('blue');
	pdf.text("for investigation");pdf.fillColor('black');
	for (let i=0;i<dTa[0].length;i++){
		pdf.text(dTa[0][i][0],{underline:true});
		pdf.text(dTa[0][i][1]);
	}
	pdf.fillColor('blue');
	pdf.text("for management");pdf.fillColor('black');
	for (let i=0;i<dTa[1].length;i++){
		pdf.text(dTa[1][i][0],{underline:true});
		pdf.text(dTa[1][i][1]);
	}
	pdf.moveDown();
	if(pdf.y>(841.89-72-40))pdf.addPage();
	pdf.fillColor('blue');
	pdf.text("Progress Note");pdf.fillColor('black');
	dTa=JSON.parse(dta["prgsTble"].replace(/'(?=[,\]])/g,'"').replace(/(?<=[,\[\s])'/g,'"').replace(/\n/g,"\\n"));
	for (let i=0;i<dTa.length;i++){
		pdf.text(new Date(dTa[i][0]).toString().slice(4,15)+" "+dTa[i][1]);
		pdf.text("S: ",{continued:true});pdf.text(dTa[i][2],pdf.x+10,pdf.y);pdf.x=lft;
		pdf.text("O: ",{continued:true});pdf.text(dTa[i][3],pdf.x+10,pdf.y);pdf.x=lft;
		pdf.text("A: ",{continued:true});pdf.text(dTa[i][4],pdf.x+10,pdf.y);pdf.x=lft;
		pdf.text("P: ",{continued:true});pdf.text(dTa[i][5],pdf.x+10,pdf.y);pdf.x=lft;
	}
	
	pdf.end();
	return pdf;
}
function header(pdf,dta){
	pdf.fontSize(20);
	pdf.text("SURATTHANI HOSPITAL\nMedical Education Center\n\n",{align:'center'});
	pdf.fontSize(14);
	let cox=pdf.x;
	let lft=cox;
	let coy=pdf.y;
	let wdth=0;
	let hgt1=0;
	pdf.text("Division",cox+5,coy);if(wdth< pdf.widthOfString("Division"))wdth=pdf.widthOfString("Division");
	pdf.text(dta["divsn"]);if(wdth<pdf.widthOfString(dta["divsn"]))wdth=pdf.widthOfString(dta["divsn"]);
	hgt1=pdf.y;
	pdf.text("Attending Staff");if(wdth<pdf.widthOfString("Attending Stafff"))wdth=pdf.widthOfString("Attending Staff");
	pdf.text(dta["staff"]);if(wdth<pdf.widthOfString(dta["staff"]))wdth=pdf.widthOfString(dta["staff"]);
	pdf.moveTo(cox,hgt1).lineTo(cox+wdth+10,hgt1);
	pdf.rect(cox,coy,wdth+10,pdf.y-coy).stroke();
	cox=cox+wdth+10;wdth=0;
	pdf.text("Ward",cox+5,coy);if(wdth< pdf.widthOfString("Ward"))wdth=pdf.widthOfString("Ward");
	pdf.text(dta["wrd"]);if(wdth<pdf.widthOfString(dta["wrd"]))wdth=pdf.widthOfString(dta["wrd"]);
	pdf.text("Resident/Intern");if(wdth< pdf.widthOfString("Resident/Intern"))wdth=pdf.widthOfString("Resident/Intern");
	pdf.text(dta["senior"]);if(wdth<pdf.widthOfString(dta["senior"]))wdth=pdf.widthOfString(dta["senior"]);
	pdf.moveTo(cox,hgt1).lineTo(cox+wdth+10,hgt1);
	if(hgt1<pdf.y)hgt1=pdf.y;
	pdf.rect(cox,coy,wdth+10,pdf.y-coy).stroke();
	pdf.text("ชื่อผู้ป่วย "+dta["patient"], cox+wdth+60,coy);
	pdf.text("HN "+dta["HN"]+" AN "+dta["AN"]);
	pdf.text("ชื่อ น.ศ.พ. "+dta["stdnName"]);
	if(hgt1<pdf.y)hgt1=pdf.y;
	pdf.text("",lft,hgt1);pdf.moveUp();pdf.moveDown();
}
