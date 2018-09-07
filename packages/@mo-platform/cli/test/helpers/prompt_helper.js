module.exports = function(child_process, answers, last_answer) {
  let answer = true;
  let result = '';
  let error = '';

  return new Promise(function(resolve, reject) {
    child_process.stdout.on('data', function(d) {
      let shift = '';
      if ((''+d).match(/username/gi)) {
        shift = answers['username'] || '';
      }
      if (('' + d).match(/api/gi)) {
        shift = answers['api_key'] || '';
      }

      if(answer) {
        child_process.stdin.write(shift + "\n");
      } else {
        result += d
      }

      if(d === last_answer) {
        answer = false
        child_process.stdin.end();
      }
    })

    child_process.stderr.on('data', function(d) {
      error += d
    })

    child_process.on('exit', function() {
	    if (error.length) {
		    return resolve(error)
	    } else {
        return resolve(result)
	    }
    })
	})
}
