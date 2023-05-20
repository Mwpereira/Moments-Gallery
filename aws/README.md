    # Cloud Services

## Pre-requisites 
### GoDaddy
#### Receiving domain
1. Navigate to GoDaddy
2. Purchased the following domain:
<a>momentsimagegallery.site</a>
3. (Complete after creating Route53 Hosted Zone below) Set the namespace servers as the Route53 namespace servers for the corresponding hosted zone.

### Netlify
#### Creating client webapp 
1. Navigate to Netlify
2. Create a new project by clicking `Add new site` -> `Importing an existing project`
3. Connect your Github Account
4. Choose the Moments Repository
5. Set the base directory as `/client/`
6. Set the build command to be `react-scripts build`
7. Set the publish directory as `/client/build`

## AWS Cloud Services
### 1. Route53
#### Connecting domain from GoDaddy to AWS
1. Navigate to Route53
2. Create hosted zone by clicking `Create hosted zone`
3. Enter the domain name `momentsimagegallery.site`
4. Leaving everything else default and click `Create hosted zone`
5. Enter hosted zone and click look for the NS record and copy all four values.
6. Navigate to GoDaddy -> My Domains -> Domain Settings and click `Change Nameservers` -> `Enter my own nameservers (advanced)`
7. Paste each line from the namespaces you copied.

#### Connecting domain from GoDaddy to Netlify
1. Within the hosted zone for moments, click `Create record`
2. Create an `A` type record with the record name being as its default and the value being `75.2.60.5`

### 2. Certificate Manager
#### Allow Cloudfront to use our secure domain by receiving a valid certificate
1. Navigate to Certificate Manager
2. Click `Request`
3. Leave the default selection and click `Next`
4. Enter the name of the site, in this case `momentsimagegallery.site` and click `Request`
5. Once the status changes to *Issued* you may proceed

### 3. EC2
#### Set up credentials to use for the EC2 instance
1. Navigate to EC2 > Key Pairs
2. Click `Create key pair`
3. Give a name for the credentials (you will use this for the ec2 cloudformation template)
4. Continue with the default and click `Create key pair`

#### Create security group for the EC2 instance
1. Navigate to EC2 > Security Group
2. Click `Create security group`
3. Give this group a name and description (you will use this group for the ec2 cloudformation template)
4. For inbound rules, click `Add Rule` and add the following:

These allow the server to accept incoming requests to a designated port, we will use port `5000` in this case:
- Protocol: TCP, Port range: 5000, Source: ::/0
- Protocol: TCP, Port range: 5000, Source: 0.0.0.0/0

5. Finish off by clicking `Create Security Group`

### 4. Cloudformation 
Once the yml files for the AWS resources are ready, ensure to deploy the resources using the `serverless deploy` or `npm run deploy`.
This will create the Cloudformation/Stack for all the resources to be used.

## Creating new API route
### Covers providing a new route in api-gateway for the API to become available
*Remember to do the following*
- Consider tab indents
- Give block properties unique names (e.g apiGatewayTestResource, apiGatewayTestMethod)

These properties refer to the `serverless-configs/resources/api-gateway.yml` file.

Example Resource: 
```  
  apiGatewayTestResource:
    Type: "AWS::ApiGateway::Resource"
    Properties:
      ParentId: !GetAtt "apiGateway.RootResourceId"
      PathPart: 'test'
      RestApiId: !Ref "apiGateway"
```
The properties which are most commonly changed for methods are:
- PathPart (eg. test, login, register, etc...)

Also requires:
```
  apiGatewayTestMethod:
    Type: "AWS::ApiGateway::Method"
    Properties:
      ApiKeyRequired: false
      AuthorizationType: "NONE"
      HttpMethod: "GET"
      MethodResponses:
        - ResponseModels:
            application/json: !Ref "apiGatewayModel"
          ResponseParameters:
            method.response.header.Access-Control-Allow-Origin: true
          StatusCode: 200
      Integration:
        RequestTemplates:
          application/json: |
            {"statusCode": 200}
        Type: "HTTP_PROXY"
        IntegrationHttpMethod: "ANY"
        Uri: !Join [ '', [ !Ref domainHost, '/test' ] ]
        TimeoutInMillis: 29000
      ResourceId: !Ref "apiGatewayTestResource"
      RestApiId: !Ref "apiGateway"
```
The properties which are most commonly changed for methods are:
- HttpMethod (eg. GET, POST, PUT)
- Uri (eg. /test, /login, /register)
- ResourceId (refers to corresponding resource)

After you have completed adding this to the correct file, run `serverless deploy`.
Following this make sure to deploy the new APIs by deploying the resources under API Gateway in the AWS console.
