🧪 Playwright Automation Test Suite
This project contains an end-to-end automation test suite using Playwright with JavaScript. It covers a wide range of test scenarios for a sample e-commerce website.

📦 Tech Stack
Framework: Playwright

Language: JavaScript (Node.js)
Following test cases will be covered : 
Register User

Login User with correct email and password

Login User with incorrect email and password

Logout User

Register User with existing email

Contact Us Form

Verify Test Cases Page

Verify All Products and Product Detail Page

Search Product

Verify Subscription in Home Page

Verify Subscription in Cart Page

Add Products to Cart

Verify Product Quantity in Cart

Place Order: Register while Checkout

Place Order: Register before Checkout

Place Order: Login before Checkout

Remove Products From Cart

View Category Products

View & Cart Brand Products

Search Products and Verify Cart After Login

Add Review on Product

Add to Cart from Recommended Items

Verify Address Details in Checkout Page

Download Invoice after Purchase Order

Verify Scroll Up using 'Arrow' Button and Scroll Down Functionality

Verify Scroll Up without 'Arrow' Button and Scroll Down Functionality

📁 Project Structure
bash
Kopieren
Bearbeiten
project-root/
│
├── tests/                  # Test files
├── playwright.config.js    # Playwright configuration
├── package.json
└── README.md
📌 Notes
Make sure the target application is running and accessible before executing tests.

Customize environment settings (e.g., baseURL) in playwright.config.js if needed.

