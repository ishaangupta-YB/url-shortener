# URL-Shortener

A Node.js URL shortener with Express.js and MongoDB, featuring a full authentication system and a user dashboard.

**Note: I initially built this project in 2020 during my 1st year and am now uploading it after bumping up dependencies that were deprecated. Contributions are welcomed and appreciated.**

## Demo
[![Demo](https://github.com/ishaangupta-YB/url-shortener/assets/52467684/4c9d9313-dfa0-4eb9-b227-939146aeac4e)](https://github.com/ishaangupta-YB/url-shortener/assets/52467684/4c9d9313-dfa0-4eb9-b227-939146aeac4e)

## Features

- **Full Authentication System:** Users can register, log in, and log out securely.
- **User Dashboard:** Provides a user-friendly dashboard for managing shortened URLs.
- **Custom Shortcodes:** Shortcodes are generated using the nanoID npm package, with an option for custom shortcodes of 8 characters.
- **Custom Expiry Date:** Users can set a custom expiry date for their shortened URLs.
- **History:** Users can view, edit expiry and shortcodes, and delete URLs from their history.

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

2. **Install npm packages:**

    ```bash
    npm install
    ```

3. **Create a `.env` file and configure it according to the `config.js` file.**

4. **Run the application:**

    ```bash
    npm start
    ```

## Usage

This URL shortener allows users to create short links for their URLs. Users can customize the shortcode and set an expiry date. The user dashboard provides an overview of created URLs, allowing users to manage and modify them easily.

## API Routes

### Dashboard

- **Method:** GET
- **Route:** `/user/dashboard`
- **Middleware:** `authMiddleware`
- **Controller:** `userController.dashboard`
- **Description:** Retrieve user dashboard information.

### Shorten URL

- **Method:** POST
- **Route:** `/user/shorten`
- **Middleware:** `authMiddleware`
- **Controller:** `userController.shorten`
- **Description:** Shorten a URL.
  #### Request
  ```json
  {
    "originalURL": "https://example.com",
    "expiryDate": "2024-12-31",
    "shortcode": "customShortCode"
  } 
  ```
  #### Response (Success)
  ```json
  {
    "urlId": "customShortCode",
    "origUrl": "https://example.com",
    "shortUrl": "http://your-api-base-url/customShortCode",
    "clicks": 0,
    "date": "2024-01-01T12:00:00.000Z",
    "email": "user@example.com",
    "expiresAt": "2024-12-31T00:00:00.000Z"
  }
  ```

### Get User Data

- **Method:** GET
- **Route:** `/user/getData`
- **Middleware:** `authMiddleware`
- **Controller:** `userController.getData`
- **Description:** Retrieve all user url-short data.

### Delete Link

- **Method:** DELETE
- **Route:** `/user/delete`
- **Middleware:** `authMiddleware`
- **Controller:** `userController.deleteLink`
- **Description:** Delete a shortened link.
- #### Request
  ```json
  {
    "shortUrl": "http://your-api-base-url/generatedId123"
  } 
  ```
  #### Response (Success)
  ```json
  {
    "msg": "Deleted successfully"
  }
  ```

### Edit Link

- **Method:** PUT
- **Route:** `/user/edit`
- **Middleware:** `authMiddleware`
- **Controller:** `userController.edit`
- **Description:** Edit a shortened link.
   ```json
  {
    "originalshortCode": "generatedId123",
    "shortCode": "updatedShortCode",
    "expiryDate": "2025-12-31"
  } 
  ```
  #### Response (Success)
  ```json
  {
    "msg": "Updated Successfully"
  }
  ```

## License

This project is open for contributions. Feel free to fork and make improvements. By contributing, you agree to abide by the terms of the [MIT License](LICENSE).
