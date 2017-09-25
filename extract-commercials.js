#!/usr/bin/env node 



if (  process.argv.length < 4  ) {
	console.error("Usage: node " + process.argv[1] + " labels_file [input video]" );
	console.error("Where: " );
	console.error(" [input video] path to video  " );
	console.error(" labels_file: The timings of commercials in input playlist" );
	console.error("Example labels_file: " );
	console.error("       00:28 - 00:38 = ad Nalgezin ");
	console.error("       00:39 - 00:58 = ad WellaFlex ");
	console.error("       00:59 - 01:27 = ad Coldrex   ");
	console.error("       01:28 - 01:58 = ad Huggies   ");
	console.error("       01:59 - 02:18 = ad Gemorroy  ");
	console.error("       02:19 - 02:38 = ad Aflubin   ");
	console.error("       02:39 - 02:53 = ad Volia ISP ");
	console.error("       02:54 - 03:08 = ad Pektolvan ");
	console.error(" Do not forget to npm install -g event-stream ");
	process.exit();
}

const labels = process.argv[2];
const input  = process.argv[3]; 
const utils = require('util');
const es = require('event-stream');
const exec = utils.promisify(require('child_process').exec);

console.log("Using " + labels + " as labels ");

function timetosec(str) {
 return str.split(":")
	.map( (val) => val * 1 ) 
	.map( (val, index, arr) => parseInt(val,10) * Math.pow(60, arr.length - index -1 ) )
	.reduce( (a, b) => a+b );

}


processes = []; 
require('fs').createReadStream(labels, { flags : 'r' })
	.pipe(es.split())
	.pipe(es.map( (line, cb) => {
		if ( line === "" ) {
			return cb(null, line);
		}
		var groups = {
			startTime : 1,
			endTime   : 2,
			adName    : 3
		};

		var matches = /(\d+(?::\d+)+)\s-\s(\d+(?::\d+)+)\s=\s(.*)/.exec(line); 
		var res = "";
		if (! matches ) { 
			console.error("Could not parse line `" + line + "' , ignoring ");
		} else { 
			var duration = timetosec(matches[groups.endTime]) - timetosec(matches[groups.startTime]);

			res =  [
				"ffmpeg " , 
				"-ss " + matches[groups.startTime],
				"-i " + input, 
				"-acodec copy -vcodec copy -scodec copy",
				" -t " + duration,
				matches[groups.adName].replace(/\s/g, '-') + ".mp4",
				"\n"].join(" ");
		}
		cb(null, res);
	}))
	.pipe( es.map(line => {  
		console.log(line); 
		line === "" ? void(0) : processes.push(exec(line)); 
	}));
//Promise.all(processes).then(() => console.log("finished"));

