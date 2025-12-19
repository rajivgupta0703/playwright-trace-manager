# 🎭 Playwright Trace Manager

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NPM version](https://img.shields.io/npm/v/playwright-trace-manager.svg)](https://www.npmjs.com/package/playwright-trace-manager)

A powerful, privacy-first web interface to manage and view multiple Playwright traces simultaneously. 

The official Playwright Trace Viewer is excellent but limited to viewing **one trace file at a time**. This tool solves that by allowing you to upload an entire archive of traces and navigate between them instantly.

## 🚀 Quick Start

No installation required! Use it directly in your browser or run it locally via npx.

- **Web Version**: [https://rajivgupta0703.github.io/playwright-trace-manager/](https://rajivgupta0703.github.io/playwright-trace-manager/)
- **Local (npx)**: 
  ```bash
  npx playwright-trace-manager
  ```

---

## ✨ Features

- 📁 **Multi-Trace Support**: Upload a `.zip` archive containing dozens of nested trace files.
- 🚀 **Lazy Loading**: Efficiently handles large archives (tested up to 3GB+) by extracting traces on-demand.
- 📂 **Sidebar Navigation**: Quickly switch between different test runs or traces without reloading.
- 🛡️ **Privacy First**: Entirely client-side. Your trace data never leaves your browser.
- 🎨 **Modern UI**: Clean, responsive interface built with Tailwind CSS and Lucide icons.
- 🔌 **Official Viewer**: Uses the authentic Playwright Trace Viewer engine for 100% compatibility.

## 🛠️ Development Setup

If you want to contribute or modify the tool:

1. Clone the repository:
   ```bash
   git clone https://github.com/rajivgupta0703/playwright-trace-manager.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📖 Usage

1. **Prepare your traces**: Take your `playwright-report` or `test-results` folder and zip it.
2. **Upload**: Drag and drop the `.zip` file into the manager.
3. **Inspect**: Click any trace in the left sidebar to open it in the embedded viewer.
4. **Search**: Use the search bar in the sidebar to filter traces by name.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ for the Playwright community by [Rajiv Gupta](https://github.com/rajivgupta0703).
