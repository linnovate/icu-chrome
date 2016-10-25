var express = require('express');
var app = express();
var shell = require('shelljs');
var exec = require('child-process-promise').exec;
 



function openWCAndSaveGallery(cb){
    shell.exec('br -gui -algorithm "AgeGenderDemo" -enroll 0.webcam test.gal', function(code) {
    if (code) {
    	console.log('ppppppp',code);
    	cb();
    };
  });
}


function convertGalToXml(){
    shell.exec('br -convert Gallery test.gal test.xml', function(code) {
    if (code) return console.log('ppppppp',code);
     });
}

function compareImgToGal(){
	 shell.exec('br -algorithm FaceRecognition -compare test.gal img/11.jpg match_scores.csv', function(code) {
    if (code) return console.log('ppppppp',code);
     });
}

app.post('/test', function (req, res) {
	compareImgToGal();
	 
  res.send('rerewr');
});


/*br -algorithm FaceRecognition -compare meds.gal img/baby2.jpg match_scores.csv
*/app.post('/openbr', function (req, res) {
	exec('br -gui -algorithm "AgeGenderDemo" -enroll 0.webcam test1.gal')
    .then(function (result) {
    	console.log('uuuuuuuuuuu',result)
    	var Converter = require("csvtojson").Converter;

var fs=require("fs"); 
var csvFileName="./match_scores.csv";

 csvConverter=new Converter({});
var d = 0;
on("end_parsed",function(jsonObj){
	jsonObj = jsonObj[0];
   for(var i = 0  in jsonObj){
  	if(jsonObj[i].jpg > 0){
   		console.log(jsonObj[i].jpg,'i',i)
   		d =1;
   	}
   }
   if(d == 0)
   	console.log('not found')
});

//read from file
fs.createReadStream(csvFileName).pipe(csvConverter);
        var stdout = result.stdout;
        var stderr = result.stderr;
        console.log('stdout: ', stdout);
        console.log('stderr: ', stderr);
    })
    .catch(function (err) {
        console.error('ERROR: ', err);
    });
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});