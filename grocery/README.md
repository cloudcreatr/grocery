# Grocery App

## Overview
The Grocery App is a user-friendly application designed to provide a seamless shopping experience. It allows users to browse products, view details, and add items to their cart.

## Project Structure
The project is organized into the following main directories:

- **apps/user/app**: Contains the user-facing application code.
  - **(main)**: Main application logic and routing.
    - **product**: Product detail pages.
      - **[id].tsx**: Dynamic product page that fetches and displays product details.
    - **index.tsx**: Main entry point for the user app.
  - **_layout.tsx**: Layout component for wrapping the main content with common UI elements.

- **packages/ui**: Contains reusable UI components.
  - **components**: UI components like images, buttons, and text elements.
    - **image.tsx**: Component for displaying images with loading indicators.
    - **rn.tsx**: Contains various reusable components styled with Tailwind CSS.
  - **index.ts**: Entry point for the UI package.

## Features
- **Product Details**: Each product page displays an image, title, description, and price.
- **Add to Cart**: Users can add products to their cart with a dedicated button.
- **Responsive Design**: The app is designed to be responsive and user-friendly across devices.

## Installation
To get started with the Grocery App, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd grocery
npm install
```

## Usage
To run the application, use the following command:

```bash
npm start
```

This will start the development server and open the app in your default browser or simulator.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.