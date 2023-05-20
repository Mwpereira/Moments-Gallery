# 🖼️ Moments

## ⚒️ Pre-requisites

- Node v18
- Code IDE
- AWS Account
- MongoDB Account

## 💭 Environment Variables

Please refer to the `dev.env` files located under `./client` and `./server`. Insert variables for each file and then rename those files to `.env`.

AWS deployments require AWS credentials to be set in their respective `credentials` and `config` files. Refer to Amazon's documentation [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

## 🎨 Stack

### Front-end

- React
- TypeScript
- Node.js
- Chakra UI

### Back-end

- Node.js
- React
- TypeScript
- Express.js
- Mongoose
- MongoDB (server)

### Cloud

- AWS
- Netlify
- GoDaddy
- Github

## 📄 Scripts

### To add git hooks
```sh
npx simple-git-hooks
```

### To install packages -- this will install all packages for front-end and back-end
```sh
npm install
```

### To add a package for front-end
```sh
npm install <package-name> -w client
```

### To add a package for back-end
```sh
npm install <package-name> -w server
```

### To run front-end and back-end app
```sh
npm run start-all
```

### To run front-end ONLY
```sh
npm start -w client
```

### To build front-end
```sh
npm run build -w client
```

### To run back-end ONLY
```sh
npm start -w server
```

### To build the back-end
```sh
npm run build -w server
```

### To run cloud services ONLY
```sh
npm start -w aws
```

### To deploy cloud services
```sh
npm run deploy -w aws
```

### Lint Repository
```sh
npm run lint
```

### Lint Client
```sh
npm run lint -w client
```

### Lint Server
```sh
npm run lint -w server
```

## 🖼️ Gallery

### Landing Page
![Landing Page](./gallery/landing_page.png)

### Login Page
![Login Page](./gallery/login_page.png)

### Register Page
![Register Page](./gallery/register_page.png)

The following is showed with dark mode enabled.

### Upload Page
![Upload Page](./gallery/upload_page.png)

### Profile Page
![Profile Page](./gallery/profile_page.png)

### Explore Page
![Explore Page](./gallery/explore_page.png)
