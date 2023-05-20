import { CloudFrontRequest, CloudFrontRequestEvent } from 'aws-lambda'

export const handler = async (event: CloudFrontRequestEvent): Promise<CloudFrontRequest> => {
    const request: CloudFrontRequest = event.Records[0].cf.request
    if (request.uri === '/index.html' || request.uri.includes('.')) {
        return request
    } else {
        request.uri = '/index.html'
    }
    return request
}
