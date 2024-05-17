# API Documentation

# Description
Submission for technical test, this is microservices (Nodejs - Express) for CRUD operation and store in database (Mongo DB)
include: 
- CRUD Operation
- Protected endpoints using authorization jwt header
- Redis Caching
- Unit Testing
- Deployed into vercel

## API BASE URL
https://iqbal-baihaqi-betest.vercel.app/api

## Generate Token

**Description:**  
Generate a new token for a user

**Path:** `/users/token` (GET)

**Headers:**  
- Authorization: NO

**Request Body:**  
N/A

**Response:**  
```json
{
    "success": true,
    "message": "Token generated",
    "data": "{token}"
}
```
---
## Create User

**Description:**  
Create new user

**Path:**  `/users` (POST)

**Headers:**  
- Authorization: `Bearer {token}`

**Request Body:**  
```json
{
  "userName": "string",
  "accountNumber": "string",
  "emailAddress": "string",
  "identityNumber": "string"
}
```

**Response:**  
```json
{
    "success": true,
    "message": "User created",
    "data": "{user id}"
}
```
---
## Get All Users

**Description:**  
Get all users

**Path:**  `/users` (GET)

**Headers:**  
- Authorization: `Bearer {token}`

**Request Body:**  
N/A

**Response:**  
```json
{
    "success": true,
    "message": "Users Found",
    "data": [
        {
            "_id": "66472ad15baf758b9735824d",
            "userName": "john_doe",
            "accountNumber": "334",
            "emailAddress": "john_doe@gmail.com",
            "identityNumber": "88402",
            "createdAt": "2024-05-17T10:00:49.230Z",
            "updatedAt": "2024-05-17T10:00:49.230Z",
            "__v": 0
        },
        {
            "_id": "66472ad55baf758b97358250",
            "userName": "jane_smith",
            "accountNumber": "335",
            "emailAddress": "jane_smith@gmail.com",
            "identityNumber": "88403",
            "createdAt": "2024-05-17T10:00:53.749Z",
            "updatedAt": "2024-05-17T10:00:53.749Z",
            "__v": 0
        },
        {
            "_id": "66472ada5baf758b97358253",
            "userName": "bob_jones",
            "accountNumber": "336",
            "emailAddress": "bob_jones@gmail.com",
            "identityNumber": "88404",
            "createdAt": "2024-05-17T10:00:58.155Z",
            "updatedAt": "2024-05-17T10:00:58.155Z",
            "__v": 0
        },
    ]
}
```
---
## Get user by id

**Description:**  
Get user by id

**Path:**  `/users/:id` (GET)

**Headers:**  
- Authorization: `Bearer {token}`

**Request Body:**  
N/A

**Response:**  
```json
{
    "success": true,
    "message": "User found",
    "data": {
        "_id": "66472ad15baf758b9735824d",
        "userName": "john_doe",
        "accountNumber": "334",
        "emailAddress": "john_doe@gmail.com",
        "identityNumber": "88402",
        "createdAt": "2024-05-17T10:00:49.230Z",
        "updatedAt": "2024-05-17T10:00:49.230Z",
        "__v": 0
    }
}
```
---
## Get user by identity number

**Description:**  
Get user by identity number

**Path:**  `/users/identityNumber/:identityNumber` (GET)

**Headers:**  
- Authorization: `Bearer {token}`

**Request Body:**  
N/A

**Response:**  
```json
{
    "success": true,
    "message": "User found",
    "data": {
        "_id": "66472ad15baf758b9735824d",
        "userName": "john_doe",
        "accountNumber": "334",
        "emailAddress": "john_doe@gmail.com",
        "identityNumber": "88402",
        "createdAt": "2024-05-17T10:00:49.230Z",
        "updatedAt": "2024-05-17T10:00:49.230Z",
        "__v": 0
    }
}
```
---
## Get user by account number

**Description:**  
Get user by account number

**Path:**  `/users/accountNumber/:accountNumber` (GET)

**Headers:**  
- Authorization: `Bearer {token}`

**Request Body:**  
N/A

**Response:**  
```json
{
    "success": true,
    "message": "User found",
    "data": {
        "_id": "66472ad15baf758b9735824d",
        "userName": "john_doe",
        "accountNumber": "334",
        "emailAddress": "john_doe@gmail.com",
        "identityNumber": "88402",
        "createdAt": "2024-05-17T10:00:49.230Z",
        "updatedAt": "2024-05-17T10:00:49.230Z",
        "__v": 0
    }
}
```
---
## Update user by id

**Description:**  
Update user by id

**Path:**  `/users/:id` (PATCH)

**Headers:**  
- Authorization: `Bearer {token}`

**Request Body:**  
```json
{
    "userName": "john_doe_edited",
    "accountNumber": "334",
    "emailAddress": "john_doe@gmail.com",
    "identityNumber": "88402"
}
```

**Response:**  
```json
{
    "success": true,
    "message": "User updated",
    "data": "66472ad15baf758b9735824d"
}
```
---
## Delete user by id

**Description:**  
Delete user by id

**Path:**  `/users/:id` (DELETE)

**Headers:**  
- Authorization: `Bearer {token}`

**Request Body:**  
N/A

**Response:**  
```json
{
    "success": true,
    "message": "User deleted",
    "data": "66474ff4e83a15240f1cadf7"
}
```
---

