var express = require('express');
var app = express();
var shell = require('shelljs');
var exec = require('child-process-promise').exec;
var fs=require("fs"); 




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
	exec('br -gui -algorithm "SaveMat(original)+Cvt(Gray)+Cascade(FrontalFace)+Expand+FaceClassificationRegistration+<FaceClassificationExtraction>+<AgeRegressor>/<GenderClassifier>+Discard+RestoreMat(original)+Draw(inPlace=true)+DrawPropertiesPoint([Age,Gender],Affine_0,inPlace=true)+SaveMat(original)+Discard+Contract+RestoreMat(original)+FPSCalc+Show(false,[AvgFPS,Age,Gender])+Discard:Dist(L2)" -enroll 0.webcam rivka.gal')
	.catch(function (err) {
		console.error('ERROR: ', err);
	});
	console.log('ppppppppp')
	var timer = setInterval(function() {
		console.log('in interval')
		fs.stat('./rivka.gal', function(err, fileStat) {
			if (err) {
				if (err.code == 'ENOENT') {
					console.log('Does not exist.');
				}
			} else {
				console.log('fileStat',fileStat)
				if (fileStat.isFile()) {
					console.log('File found.');
					clearInterval(timer);
					exec('br -convert Gallery rivka.gal rivka.xml');
					exec('br -convert Gallery rivka1.gal rivka1.xml');
					exec('br -compare rivka.gal rivka1.gal rivka3.mtx')
					exec('br -makeMask rivka.xml rivka1.xml MEDS.mask');
					exec('br -eval rivka3.mtx MEDS.mask enddd.csv')
					// exec('-plot enddd.csv MEDS')
/*					exec("ps aux | grep algorithm | awk '{print $2}' | xargs kill");
*/					
					.then(function (result) {
		console.log('uuuuuuuuuuu')
		/*var Converter = require("csvtojson").Converter;
        var csvFileName="./rivka2.csv";
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
		console.log('stderr: ', stderr);*/
	})
				} else if (fileStat.isDirectory()) {
					console.log('Directory found.');
				}
			}
		});
	}, 10000 );
	res.send('Hello World!');
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});