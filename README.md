# E-Commerce API Documentation

Welcome to the documentation for the E-Commerce API, an application designed to facilitate various operations related to an e-commerce platform. This API enables functionalities such as user authentication, user management, product management, cart handling, and more.

## Getting Started

To access the API endpoints, you need to understand the available routes, their functionalities, and the expected request and response formats.

### Base URL

The base URL for accessing the API is: `https://localhost.com:3000`. PORT: 3000 || as stated in the process.env.PORT

### Authentication

The API utilizes session-based authentication managed through endpoints in the `/auth` route. User sessions are stored using Redis as a session store.

### Error Handling

Global error handling is in place to capture and handle errors across the API. Errors are appropriately formatted and returned with relevant status codes.

## Endpoints

### Authentication

#### `/auth`

- **POST** `/auth/signup`
  - Register a new user.
  - Request:
    - JSON payload with user details.
  - Response:
    - Successful registration or error for invalid data.

- **POST** `/auth/login`
  - Authenticate and log in a user.
  - Request:
    - JSON payload containing username and password.
  - Response:
    - Successful login returns user data and sets a session cookie.
    - Errors are returned for invalid credentials.

- **GET** `/auth/logout`
  - Log out a user.
  - Request:
    - No payload required.
  - Response:
    - Clears the session and logs out the user.


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

- **GET** `/users/all`
  - Retrieve all users.
  - Request:
    - Pagination available using query parameters for page numbers.
  - Response:
    - List of users with pagination information.

### Product Management

#### `/products`

- **GET** `/products`
  - Endpoint to retrieve a list of products.
  - Response:
    - List of available products.

- **POST** `/products/add`
  - Endpoint to add a new product.
  - Request:
    - JSON payload with product details.
  - Response:
    - Success message or error for invalid data.

### Cart Operations

#### `/cart`

- **GET** `/cart/checkout`
  - Endpoint to view items in the cart and calculate the checkout total.
  - Requires authentication.
  - Response:
    - List of items in the cart and total checkout amount.

- **POST** `/cart/add`
  - Endpoint to add an item to the cart.
  - Request:
    - JSON payload with item details.
  - Response:
    - Success message or error for invalid data.

- **PUT** `/cart/update`
  - Endpoint to update the quantity of an item in the cart.
  - Request:
    - JSON payload with updated quantity and item ID.
  - Response:
    - Success message or error for invalid data.

- **DELETE** `/cart/remove`
  - Endpoint to remove an item from the cart.
  - Request:
    - JSON payload with item ID.
  - Response:
    - Success message or error for invalid data.
