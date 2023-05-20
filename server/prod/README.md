# Deploying Node.js Express Server

## Pre-requisites

### Install node on the machine
We are currently using node v16

Start off by entering:
```
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash
```
then enter the following ...
```
sudo yum -y install gcc-c++ make nodejs
sudo amazon-linux-extras install epel
sudo yum install p7zip -y
sudo cp /usr/bin/7za /usr/bin/7z
```

## Deploying server to EC2 instance

### Building the express server

Run the build command from the root of the project, `npm run build-server`.

Temporarily update the `package.json` script during this process to the following: `"start": "nodemon src/index.ts",`.

### Receive credentials
A credentials .pem file is required to ssh into the ec2 instance. Please place the .pem file you have received into the `prod` folder (the current directory this README.md file is in).

## Transferring the server to the instance

## SSH into the ec2 instance
```
cd prod
ssh -i "TLGenesis.pem" ec2-user@ec2IP.compute-1.amazonaws.com
```

### Deploy the server
Now ssh into the ec2 instance by using your IDE's console and run the following:
```
rm -r *
```
Run `prepare.sh` then:

```
7z x prod.zip
cd dist
```
continuing on...
```
fuser -k 5000/tcp
```
then...
```
export AWS_ACCESS_KEY_ID=<ACCESS ID>
export AWS_SECRET_ACCESS_KEY=<ACCESS KEY>
export AWS_DEFAULT_REGION=us-east-1
npm i && screen npm run start > output.log &
```
then you can hit enter and that's all!
