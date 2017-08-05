/*

 * 妹子图(www.mmjpg.com)下载器
 * npm install
 * node meizi.js <Id>

 */

const fs = require('fs');
const request = require("request");
const cheerio = require("cheerio");
const baseUrl = "http://www.mmjpg.com/mm/";

function downloadImg(url,dirName){
	var fName = /\d*\.jpg/.exec(url)[0];
	console.log(url);
	//解决妹子图防盗链
	var options = {
      	uri: url,
      	headers: {
        	'Referer': 'http://www.baidu.com'
      	}
    };
	request(options).pipe(fs.createWriteStream(`${dirName}/${fName}`));
}

function download(url){
	request(url, function(error, response, body){
		   if(!error && response.statusCode == 200) {
			   var $ = cheerio.load(body);
			   var maxNum = $("#page a").eq(-2).text();
			   var dirName = "meizi/"+/(\d*)$/.exec(url)[0]+"_"+$(".article h2").text();
			   var imgBaseUrl = $("#content img").attr("src").replace(/\/\d*\.jpg/,"");
			   if(!fs.existsSync(dirName)){
				   fs.mkdir(dirName, 0777, function(err){
					   if(err){
						   console.log(err);
					   }else{
							dImgs();
					   }
				   });
			   }else{
				   dImgs();
			   }
			   function dImgs(){
				   for(var i=1;i<=maxNum;i++){
					   downloadImg(`${imgBaseUrl}/${i}.jpg`,dirName);
				   }
			   }

		   }
	   });
};

const param = process.argv.splice(2);
param && function(){
	param.forEach(function(t,i){
		var url = /^(http)/.test(t) ? t : baseUrl+t;
		download(url);
	});
}();
