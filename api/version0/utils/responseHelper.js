exports.createSuccessResponse = (message, data) => {
    let response = {
        httpcode: 200,
        message: message,
    }

    if(data){
        response['data'] = data;
    }
    return response;
}

exports.createCustomResponse = (code, message, data) => {
    let response =  {
        httpcode: code,
        message: message,
    }
    if(data){
        response['data'] = data;
    }
    return response
}

exports.processModelValidationMessage = (errors, firstOneOnly) => {
    if(typeof firstOneOnly==undefined) firstOneOnly = false;
    let message = "";
    for (const key in errors) {
        if (errors.hasOwnProperty(key)) {
            const err = errors[key];
            message += `${err.message}\n`;
        }

        if(firstOneOnly) break;
    }

    return message;
}