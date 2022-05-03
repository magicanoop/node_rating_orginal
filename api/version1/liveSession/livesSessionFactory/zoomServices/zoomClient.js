
class ZoomAPIClient {

    constructor(zoomConfig, axios, baseUrl) {
        this.zoomConfig = zoomConfig;
        let service = axios.create({
            baseURL: baseUrl,
            headers: {
                'User-Agent': 'Zoom-api-Jwt-Request',
                'content-type': 'application/json',
                Authorization: `Bearer ${this.zoomConfig.getToken()}`
            },
            json: true
        });
        this.service = service;
        this.service.interceptors.response.use(this.handleSuccess, (error) => {
            return this.handleError(error)
        });
    }

    handleSuccess(response) {
        return { data: response.data, code: response.status };
    }
    handleError(error) {
        let code = error.response.status;
        let message = "Zoom API error"
        switch (error.response.status) {
            case 401:
                message = "Client not authorized"
                // const originalRequestConfig = error.config;
                // delete originalRequestConfig.headers["Authorization"];
                // originalRequestConfig.headers["Authorization"] = this.zoomConfig.getToken();
                // return this.service.request(originalRequestConfig);
                break;
            case 400:
                message = "Bad request"
                break;
            case 404:
                message = "API / Service Not found"
                break;
            case 409:
                message = "Conflict on zoom databse"
                break;
            case 429:
                message = "Zoom server is busy"
                break;
            default:
                break;
        }
        return { code, message }
    }
}
module.exports = { ZoomAPIClient };