# API Documentation

## Table of Contents

1. [Generate Token](#generate-token)
2. [Create User](#create-user)
3. [Get All Users](#get-all-users)
4. [Get User by ID](#get-user-by-id)
5. [Get User by Identity Number](#get-user-by-identity-number)
6. [Get User by Account Number](#get-user-by-account-number)
7. [Update User by ID](#update-user-by-id)
8. [Delete User by ID](#delete-user-by-id)

---

## Generate Token

**Description:**  
Generate a new token for a user

**Path:**  
`/users/token` (GET)

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

**Path:**  
`/users` (POST)

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
