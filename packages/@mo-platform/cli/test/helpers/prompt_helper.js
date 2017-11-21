module.exports = function(child_process, answers, last_answer) {
	var answer = true,
		result = '', error = '';

	return new Promise(function(resolve, reject) {
      child_process.stdout.on('data', function(d) {
        var _d = (''+d).split(':')[0];

        var shift = answers[_d];

        if(shift === null) {
          shift = ''
        }

        if(answer) {
        	child_process.stdin.write(shift + "\n");
        } else {
        	result += d
        }

        if(_d === last_answer) {
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
