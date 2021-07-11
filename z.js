function getCode() {
var crypto = require('crypto')
var buf = crypto.randomBytes(5) 
return refCode = 'WC' +'Aluko'+ buf.toString('hex');
}

console.log(getCode())