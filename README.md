# School Canteen Ordering System (FRONTEND)

This repository contains the frontend side of the School Canteen project, developed using Next.js and Tailwind CSS. The application provides an intuitive interface for users to interact with the school's canteen services. It communicates with the backend API in the [School Canteen API Repository](https://github.com/justpiple/school-canteen-api).

## Features

- **Menu Display**: Browse the daily menu offerings.
- **Order Placement**: Place orders directly through the application.
- **Order Tracking**: Monitor the status of your orders in real-time.
- **User Authentication**: Secure login and registration system.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/justpiple/school-canteen-frontend.git
   cd school-canteen-frontend
   ```

2. **Set environment variables**:

   Create a `.env` file in the root directory and add the following:

   ```bash
   NEXT_PUBLIC_API_URL=<API_BASE_URL>
   ```

   Replace `<API_BASE_URL>` with the base URL of the backend API. For example:

   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

   Use the backend provided in [School Canteen API](https://github.com/justpiple/school-canteen-api), set it accordingly.

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Start the development server**:

   ```bash
   npm run dev
   ```

   The application will be accessible at `http://localhost:3000`.

## Usage

After setting up the project:

- Navigate to `http://localhost:3000` in your browser.
- Register a new account or log in with existing credentials.
- Browse the menu, place orders, and track them through the user dashboard.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

We appreciate the contributions of the open-source community and the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
