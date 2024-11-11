## Prerequisites

Ensure the following are installed and set up on your machine:

- Git.
- Node installed on your machine.
- MongoDB

## How to Test this Server Locally

1. Clone this repository

```
git clone https://github.com/adriandotdev/breederdao-assessment.git
```

1. Navigate to the project folder

```
cd /breederdao-assessment
```

3. Install dependencies

```
npm install
```

4. Run the application

```
npm run dev
```

## Environment Variables

These are the environment variables needed to run the application.

```env
PORT=<PORT>
DB_USERNAME=<USERNAME>
DB_PASSWORD=<PASSWORD>
DB_DATABASE_NAME=<DB_NAME>
ACCESS_TOKEN_SECRET_KEY=<SECRET_KEY>
INFURA_ID=<INFURA_ID>
AXIE_CONTRACT_ADDRESS=<CONTRACT_ADDRESS>
```

- PORT - running port number of the application.
- DB_USERNAME - username of the MongoDB Atlas database.
- DB_PASSWORD - password of the MongoDB Atlas database.
- DB_NAME - name of the MongoDB Atlas database.
- ACCESS_TOKEN_SECRET_KEY - secret key for authentication.
- INFURA_ID - Infura ID project ID.
- AXIE_CONTRACT_ADDRESS - Axie's contract address.

## Database Setup

1. Sign up for MongoDB Atlas

   Visit MongoDB Atlas and create an account.

2. Create a Cluster

   Follow the MongoDB Atlas instructions to set up a new cluster.

3. Update Environment Variables

   Ensure your app is configured to connect to the MongoDB cluster. Update the .env file with your connection string:

   ```env
   DB_USERNAME=<USERNAME>
   DB_PASSWORD=<PASSWORD>
   DB_DATABASE_NAME=<DB_NAME>
   ```
