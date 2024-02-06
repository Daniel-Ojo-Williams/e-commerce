# E-Commerce API Documentation

Welcome to the documentation for the E-Commerce API, an application API designed to facilitate various operations related to an e-commerce platform. This API enables functionalities such as user authentication, user management, product management, cart handling, and more.

## Getting Started

To access the API endpoints, you need to haave redis and postgresql installed and running, you can also use containers or cloud services for this (might require some reworking).

Install npm dependencies.
```
npm install
```

### Base URL

The base URL for accessing the API is: `https://localhost.com:3000`. PORT: 3000 || as stated in the process.env.PORT

### Authentication

The API utilizes access_token and refresh_token based authentication managed through endpoints in the `/auth` route.

### Error Handling

Global error handling is in place to capture and handle errors across the API. Errors are appropriately formatted and returned with relevant status codes.

## Endpoints

### Authentication

#### `/auth`

- **POST** `/auth/signup`
  - Register a new user.
  - Request:
    - JSON payload with user details.

    ```json
    {
      first_name: "Wonka",
      last_name: "Wonka",
      email: "wonka@gmail.com",
      username: "willyWonka",
      password: "Willywonks123@"
    }
    ```
  - Response:
    - 201 (created): Successful registration
    - 400 (Bad request): Error for invalid data, i.e. Password muust be at least 6 characters long, contain at least one uppercase letter, one special character and digit.

- **POST** `/auth/login`
  - Authenticate and log in a user.
  - Request:
    - JSON payload containing email and password.
    
    ```json
    {
      email: "wonka@gmail.com",
      password: "Willywonks123@"
    }
    ```
  - Response:
    - 200 (Ok) Successful login returns user data and sets a session cookie.
    - 400 (Bad request) Errors are returned for invalid credentials.

- **GET** `/auth/logout`
  - Log out a user.
  - Request:
    - No payload required.
  - Response:
    - session id cleared, access_tokens and refresh_tokens revoked


### User Management

#### `/users`

- **GET** `/users/:userId`
  - Retrieve a single user's profile.
  - Request:
    - User ID as a parameter.
  - Response:
    - User details for the specified user ID.

- **PUT** `/users/:userId`
  - Update user information.
  - Request:
    - User ID as a parameter and JSON payload with updated user details.
  - Response:
    - Updated user details or error for invalid data.

- **DELETE** `/users/:userId`
  - Delete a user.
  - Request:
    - User ID as a parameter.
  - Response:
    - Success message on user deletion.

- **GET** `/users/all?page=1`
  - Retrieve all users.
  - Request:
    - Pagination available using query parameters for page numbers.
  - Response:
    - List of users with pagination information.
    - Error response if page query is not added.

### Product Management

#### `/products`

- **GET** `/products/allProducts`
  - Endpoint to retrieve a list of products.
  - Add query for pagination i.e. page=1, will return BIGINT error without the query
  - Response:
    - List of available products.

- **POST** `/products/new`
  - Endpoint to add a new product.
  - Request:
    - JSON payload with product details.
  - Response:
    - Success message or error for invalid data.

- **PUT** `/products/{productId}`
  - Endpoint to update an existing product.
  - Request:
    - JSON payload with product details.
  - Response:
    - Success message or error for invalid data.

- **DELETE** `/products/{productId}`
  - Endpoint to remvoe a product from the database.
  - Request:
    - JSON payload with product details.
  - Response:
    - Success message or error for invalid data.

### Cart Operations

#### `/cart`
- A new cart is automatically created for each user upon user creation.

- **GET** `/cart`
  - Endpoint to view items in the cart and calculate the checkout total.
  - Requires authentication.
  - Response:
    - List of items in the cart and total checkout amount.

- **POST** `/cart`
  - Endpoint to add an item to the cart.
  - Request:
    - JSON payload with item details.
  - Response:
    - Success message or error for invalid data.

- **PUT** `/cart/increaseQuantity`
  - Endpoint to increase (+1) the quantity of an item in the cart.
  - Request:
    - JSON payload with item ID.
  - Response:
    - Success message or error for invalid data.

- **PUT** `/cart/decreaseQuantity`
  - Endpoint to decrease (-1) the quantity of an item in the cart.
  - Request:
    - JSON payload with item ID.
  - Response:
    - Success message or error for invalid data.

- **DELETE** `/cart`
  - Endpoint to remove an item from the cart.
  - Request:
    - JSON payload with item ID.
  - Response:
    - Success message or error for invalid data.

### Reset Password

#### `/cart`
- A new cart is automatically created for each user upon user creation.

- **POST** `/sendOTP`
  - Endpoint to get a one-time-password to reset password.
  - Request:
    - JSON payload with valid email.
  - Response:
    - Sends a mail with one-time-password (expires in 60 seconds) to the email if a valid email is found is the database.
- **POST** `/verifyOTP`
  - Endpoint to verify the one-time-password sent to reset password.
  - Request:
    - JSON payload with the OTP sent to the earlier provided email.
  - Response:
    - Success if OTP is valid and not expired.
- **POST** `/resetPassword`
  - Endpoint to create a new create a new password and replace the old one.
  - Request:
    - JSON payload with the new password.
  - Response:
    - Success if password meets the requirement.


**jwtExpired Error**
- When access_token expires, the server returns jwtExpired Error
- The client has to send the refresh_token to get a new access_token and refresh_token
- **GET** `/auth/refresh`
  - Endpoint to get new access_token and refresh_token
  - Request: 
    - It gets the refresh_token from the cookie housing it.
  - Response: 
    - Sends a new access_token through the res header['authorization'] and new refresh_token throough secure cookie that only returns to this endpoint.

