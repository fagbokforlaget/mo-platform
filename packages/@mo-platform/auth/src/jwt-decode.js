const b64DecodeUnicode = (str) => {
  return decodeURIComponent(
    atob(str).replace(/(.)/g, function(m, p) {
      var code = p.charCodeAt(0).toString(16).toUpperCase()
      if (code.length < 2) {
        code = "0" + code
      }
      return "%" + code
    })
  )
}

const base64_url_decode = (str) => {
  var output = str.replace(/-/g, "+").replace(/_/g, "/")
  switch (output.length % 4) {
    case 0:
      break
    case 2:
      output += "=="
      break
    case 3:
      output += "="
      break
    default:
      throw "Illegal base64url string!"
  }

  try {
    return b64DecodeUnicode(output)
  } catch (err) {
    return atob(output)
  }
}

const jwtDecode = (token, options) => {
  if (typeof token !== "string") {
    throw new Error("Invalid token specified")
  }

  options = options || {};
  var pos = options.header === true ? 0 : 1
  try {
    return JSON.parse(base64_url_decode(token.split(".")[pos]))
  } catch (e) {
    throw new Error("Invalid token specified: " + e.message)
  }
}

export default jwtDecode