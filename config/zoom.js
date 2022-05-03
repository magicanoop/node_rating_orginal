const jwt = require('jsonwebtoken');
const { ZOOM_API_KEY, ZOOM_SECRET } = process.env;


exports.getToken = ()=>{
    const payload = {
        iss: ZOOM_API_KEY,
        exp: ((new Date()).getTime() + 50000)
    };
    const token = jwt.sign(payload, ZOOM_SECRET);
    return token
}
