import { CloudFrontRequest, CloudFrontRequestEvent } from 'aws-lambda'
export const handler = async (event: CloudFrontRequestEvent): Promise<CloudFrontRequest> => {
    const request: CloudFrontRequest = event.Records[0].cf.request
    request.uri = request.uri.replace('/api', '/dev')
    return request
}
