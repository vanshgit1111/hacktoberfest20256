# TextUtils-WordLabs

WordLabs is a web-based text utility application built with React.  
It allows users to perform a wide range of operations on sentences and words — including text formatting, encoding/decoding, and case transformations — in a fast and user-friendly interface.

**Live Demo:** [https://wordlabs.netlify.app/](https://wordlabs.netlify.app/)  
**Repository:** [https://github.com/Yash-Bandal/WordLabs](https://github.com/Yash-Bandal/WordLabs)

<br>

## Features

- **Text Formatting & Case Conversion** (bold, italic, uppercase, lowercase, etc.)  
- **Encoding/Decoding** (Base64, URL, HTML entities)  
- **Text Cleanup** (remove spaces, symbols, count words/lines)  
- **Utilities** (reverse, sort, find & replace, word frequency)  
- **Responsive UI** (light/dark mode, clean Tailwind CSS design)

<br>

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Yash-Bandal/WordLabs.git
cd WordLabs
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Application
```bash
npm run dev
```

Then open your browser and navigate to **http://localhost:5173** (if using Vite) or **http://localhost:3000** (if using Create React App).


<br>


## Project Structure

```
WordLabs/
├── public/                     # Static assets served directly (favicon, logos, redirects)
│   ├── logo-wp.png
│   └── _redirects
│
├── src/                        # React source code
│   ├── assets/                 # Local images and icons
│   │   ├── logo-wp.png
│   │   ├── logo.PNG
│   │   └── react.svg
│   │
│   ├── components/             # Reusable UI components
│   │   ├── About.jsx
│   │   ├── Alert.jsx
│   │   ├── Navbar.jsx
│   │   └── TextForm.jsx
│   │
│   ├── App.css                 # Main App styling
│   ├── App.jsx                 # Root React component
│   ├── index.css               # Global CSS (Tailwind imports)
│   └── main.jsx                # Application entry point
└── README.md                   # Project documentation
```

### Preview
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/505923f8-69e6-43e4-973c-488f48a1891d" />



<br>

## Deployment

The project is deployed using Netlify.

To deploy manually:
```bash
npm run build
```
Then upload the contents of the `dist` or `build` folder to Netlify.

<!-- <br>

## Contributing

Contributions are welcome!  
To contribute:

1. Fork the repository  
2. Create a new branch: `git checkout -b feature-name`  
3. Make your changes and commit them: `git commit -m "Add feature"`  
4. Push to your fork and open a pull request -->

<br>

## Author

**Yash Bandal**  
[GitHub Profile](https://github.com/Yash-Bandal)

<br>

## License

This project is licensed under the **MIT License**.  



<br>

##  Connect
* Author: [@Yash-Bandal](https://github.com/Yash-Bandal)

<br>

## A YB Productions original. 💝
