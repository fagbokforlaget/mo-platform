module.exports = function(child_process, answers) {
  let error = '';

  return new Promise(function(resolve, reject) {
    let i = 0;
    child_process.stdout.on('data', function(d) {
      console.log(d.toString('utf8'), answers[i])
      child_process.stdin.write(answers[i] + "\n")
      i += 1;
      if (i == answers.length) {
        console.log(d.toString('utf8'), i, 'ending');
        child_process.stdin.end();
      }
    })

    child_process.stderr.on('data', function(d) {
      error += d
    })

    child_process.on('exit', function() {
	    if (error.length) {
		    return reject(error)
	    } else {
        return resolve(true)
	    }
    })
	})
}
