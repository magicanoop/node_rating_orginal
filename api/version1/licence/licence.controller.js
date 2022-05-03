const {
    createLicence,
    updateLicence,
    deleteLicence,
    listAll,
    licenceDetails
} = require('./licence.service');

exports.createLicence = async (httpRequest) => {
    const created = await createLicence(httpRequest.body)
    return {
        statusCode: 201,
        data: { created },
        message: 'Licence created successfully'
    }
}

exports.updateLicence = async (httpRequest) => {
    const { body, params } = httpRequest;
    const created = await updateLicence(params.id, body);
    return {
        statusCode: 200,
        data: { created },
        message: 'Licence updated successfully'
    }
}

exports.deleteLicence = async (httpRequest) => {
    await deleteLicence(httpRequest.params.licenceId);
    return {
        statusCode: 200,
        message: 'Licence deleted successfully'
    }
}

exports.listAll = async (httpRequest) => {
    const { body, query } = httpRequest;
    const response = await listAll({ ...body, ...query });
    return {
        statusCode: 200,
        data: response,
        message: 'Data retrievedsuccessfully'
    }
}

exports.licenceDetails = async (httpRequest) => {
    const response = await licenceDetails(httpRequest.params.id);
    return {
        statusCode: 200,
        data: response,
        message: 'Data retrievedsuccessfully'
    }
}