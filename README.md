# Authentication

**User Table**

| Column   | Type |
| -------- | ---- |
| username | TEXT |
| name     | TEXT |
| password | TEXT |
| gender   | TEXT |
| email    | TEXT |
| location | TEXT |
| age      | INT  |
| dod      | DATE |
| gender   | TEXT |
| adders   | TEXT |

|location|TEXT|

### API 1

#### Path: `/register`

#### Method: `POST`

**Request**

```
{
  "email":"aranggkg@gmail.com",
  "password": "richard_567",

}
```

- **Scenario 1**

  - **Description**:

    If the username already exists

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      User already exists
      ```

- **Scenario 2**

  - **Description**:

    If the registrant provides a password with less than 5 characters

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      Password is too short
      ```

- **Scenario 3**

  - **Description**:

    Successful registration of the registrant

  - **Response**
    - **Status code**
      ```
      200
      ```
    - **Status text**
    ```
    User created successfully
    ```

### API 2

#### Path: `/login`

#### Method: `POST`

**Request**

```
{
  "email":"aranggkg@gmail.com",
  "password": "richard_567",

}
```

- **Scenario 1**

  - **Description**:

    If an unregistered user tries to login

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      Invalid user
      ```

- **Scenario 2**

  - **Description**:

    If the user provides incorrect password

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      Invalid password
      ```

- **Scenario 3**

  - **Description**:

    Successful login of the user

  - **Response**
    - **Status code**
      ```
      200
      ```
    - **Status text**
      ```
      Login success!
      ```

### API 3

#### Path: `/change-password`

#### Method: `PUT`

**Request**

```
{
  "email":"aranggkg@gmail.com",
  "password": "richard_567",
  "newPassword": "richard@123"
}
```

- **Scenario 1**

  - **Description**:

    If the user provides incorrect current password

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      Invalid current password
      ```

- **Scenario 2**

  - **Description**:

    If the user provides new password with less than 5 characters

  - **Response**
    - **Status code**
      ```
      400
      ```
    - **Status text**
      ```
      Password is too short
      ```

- **Scenario 3**

  - **Description**:

    Successful password update

  - **Response**
    - **Status code**
      ```
      200
      ```
    - **Status text**
      ```
      Password updated
      ```

<br/>

**Use Common JS module syntax.**