# BreederDAO Back End Assessment

- [BreederDAO Back End Assessment](#breederdao-back-end-assessment)
  - [Prerequisites](#prerequisites)
  - [Database Setup](#database-setup)
    - [Database Setup in Localhost](#database-setup-in-localhost)
  - [Environment Variables to Configure](#environment-variables-to-configure)
  - [Running the project](#running-the-project)
  - [Technologies Used](#technologies-used)
  - [APIs](#apis)
    - [Register API](#register-api)
    - [Login API](#login-api)
    - [Retrieve and Store Axies API](#retrieve-and-store-axies-api)
    - [Retrieve Axies GraphQL API](#retrieve-axies-graphql-api)
    - [Call Axie Contract Method API](#call-axie-contract-method-api)

## Prerequisites

Ensure the following are installed and set up on your machine:

- Git
- Node installed on your machine.
- MongoDB
- MongoDB Compass

[Back to Top](#breederdao-back-end-assessment)

## Database Setup

### Database Setup in Localhost

1. Ensure MongoDB Compass is installed on your machine.

   For Windows: Here's the download link: https://downloads.mongodb.com/compass/mongodb-compass-1.44.6-win32-x64.exe

   For Mac: Here's the download link: https://downloads.mongodb.com/compass/mongodb-compass-1.44.6-darwin-x64.dmg

2. Once successfully installed, open MongoDB Compass and create a new database. You can name it whatever you like, and create your first collection.

   ![alt text](./assets/image.png)

3. After successfully creating a new database, you will see this on the sidebar

   ![alt text](./assets/image-1.png)

[Back to Top](#breederdao-back-end-assessment)

## Environment Variables to Configure

```.env
PORT=3000
DB_USERNAME=<MONGODB_ATLAS_USER>
DB_PASSWORD=<MONGODB_ATLAS_PASSWORD>
DB_DATABASE_NAME=<DATABASE_NAME>
ACCESS_TOKEN_SECRET_KEY=<SECRET_KEY>
INFURA_ID=<INFURA_PROJECT_ID>
AXIE_CONTRACT_ADDRESS=<AXIE_CONTRACT_ADDRESS>
```

[Back to Top](#breederdao-back-end-assessment)

## Running the project

1. Clone this repository: https://github.com/adriandotdev/breederdao-assessment.

   ![alt text](./assets/image-2.png)

2. After successfully cloning the repository, navigate to the new created folder.

   ```bash
   cd /breederdao-assessment
   ```

3. Install dependencies.

   ```bash
   npm install
   ```

4. After successfully installing all the dependencies, run the app.

   ```bash
   npm run dev
   ```

5. Once you successfully setup the database and the app, you will see this in the console.

   ![alt text](./assets/image-3.png)

[Back to Top](#breederdao-back-end-assessment)

## Technologies Used

- NodeJS
- ExpressJS
- GraphQL
- MongoDB

[Back to Top](#breederdao-back-end-assessment)

## APIs

### Register API

**Endpoint**: `/api/v1/accounts/register`

**HTTP Method**: `POST`

**Content Type**: `application/json`

**Request Body**

```json
{
	"username": "username",
	"password": "password"
}
```

**Response**

```json
{
	"statusCode": 201,
	"data": {
		"username": "username1",
		"password": "$2a$10$C.kPrbcGPc602x4uYjEiouOuv5aovLcyuHqhyEl1ceaqC0vdEcNh2",
		"_id": "67340bcffbb11987af752612",
		"__v": 0
	},
	"status": "Created"
}
```

[Back to Top](#breederdao-back-end-assessment)

### Login API

**Endpoint**: `/api/v1/accounts/login`

**HTTP Method**: `POST`

**Content Type**: `application/json`

**Request Body**

```json
{
	"username": "username1",
	"password": "password"
}
```

**Response**

```json
{
	"statusCode": 200,
	"data": {
		"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoidXNlcm5hbWUyIiwidXNlcklkIjoiNjczMzA4MWI4YThmYzljZmEzNjQxYzg3In0sImp0aSI6IjliYmZiNWYxLTI5ZjgtNGJiMS1hMzY3LTlkOWQzYzdjNTEwYSIsImF1ZCI6ImF1ZGllbmNlIiwiaXNzIjoiaXNzdWVyIiwiaWF0IjoxNzMxNDY0NjExLCJ0eXAiOiJCZWFyZXIiLCJleHAiOjE3MzE0NjU1MTEsInVzciI6InNlcnYifQ.qblpl_ZxlR8vz8LwTYGCywKHTB-g9SnhLMKq12xG4D0"
	},
	"status": "OK"
}
```

[Back to Top](#breederdao-back-end-assessment)

### Retrieve and Store Axies API

**Endpoint**: `/api/v1/axies`

**HTTP Method**: `POST`

**Authorization**: `Bearer ACCESS_TOKEN`

**Response**

```json
{
	"statusCode": 200,
	"data": [],
	"status": "OK"
}
```

[Back to Top](#breederdao-back-end-assessment)

### Retrieve Axies GraphQL API

**Endpoint**: `/graphql`

**Authorization**: `Bearer ACCESS_TOKEN`

**Query**

```graphql
query Axies {
	axies {
		aquatic {
			id
			name
			stage
			class
		}
		beast {
			id
			name
			stage
			class
		}
		bird {
			id
			name
			stage
			class
		}
		bug {
			id
			name
			stage
			class
		}
		dusk {
			id
			name
			stage
			class
		}
		mech {
			id
			name
			stage
			class
		}
		plant {
			id
			name
			stage
			class
		}
		reptile {
			id
			name
			stage
			class
		}
		dawn {
			id
			name
			stage
			class
		}
	}
}
```

**Response**

```json
{
	"data": {
		"axies": {
			"aquatic": [], // List of Aquatic class
			"beast": [], // List of Beast class
			"bird": [], // List of Bird class
			"bug": [], // List of Bug class
			"dusk": [], // List of Dusk class
			"mech": [], // List of Mech class
			"plant": [], // List of Plant class
			"reptile": [], // List of Reptile class
			"dawn": [] // List of Dawn class
		}
	}
}
```

[Back to Top](#breederdao-back-end-assessment)

### Call Axie Contract Method API

**Endpoint**: `/api/v1/axies/contract`

**HTTP Method**: `GET`

**Response**

```json
{
	"statusCode": 200,
	"data": "0xf4FfE2ff12cafeAb7034589d676c1DE6af637484", // The method that we called is geneManager()
	"message": "OK"
}
```

[Back to Top](#breederdao-back-end-assessment)
