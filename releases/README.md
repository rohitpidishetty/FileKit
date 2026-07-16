# <p align="center">
  <img src="docs/logo.png" alt="FileKit Logo" width="120">
</p>

<h1 align="center">FileKit</h1>

<p align="center">
A modern, high-performance desktop application for intelligent file management, organization, analytics, and automation.
</p>

<p align="center">

![Platform](https://img.shields.io/badge/Platform-Windows-blue)
![Java](https://img.shields.io/badge/Java-17+-orange)
![Electron](https://img.shields.io/badge/Electron-Latest-47848F)
![React](https://img.shields.io/badge/React-19-61DAFB)
![License](https://img.shields.io/badge/License-MIT-green)
![Version](https://img.shields.io/badge/Version-v1.0.0-success)

</p>

---

# Overview

FileKit is a modern desktop application built to simplify file management.

Whether you need to analyze storage usage, organize folders, locate large files, remove empty directories, or visualize disk statistics, FileKit provides a fast and intuitive experience through a beautiful desktop interface.

The application combines the performance of Java with the modern user experience of Electron and React to deliver enterprise-grade file operations in a lightweight desktop application.

---

# Features

## File Organization

- Automatically organize files by extension
- Organize files into custom folders
- Intelligent file grouping
- Safe file movement

---

## Storage Analytics

- Folder size analysis
- Largest files detection
- File type statistics
- Storage visualization
- Interactive charts
- File frequency analysis

---

## File Operations

- Create files
- Move files
- File properties
- Directory tree generation
- Remove empty directories
- JSON report generation

---

## Performance

- Multi-threaded Java backend
- Fast directory scanning
- Handles very large folders
- Optimized memory usage
- Native desktop performance

---

## Beautiful Desktop Experience

- Modern UI
- Responsive interface
- Dark & Light themes (Coming Soon)
- Professional charts
- Smooth animations
- Windows-style loading screen

---

# Screenshots

## Dashboard

![Dashboard](docs/screenshots/dashboard.png)

---

## Storage Analytics

![Analytics](docs/screenshots/analytics.png)

---

## File Organization

![Organize](docs/screenshots/organize.png)

---

## Largest Files

![Largest Files](docs/screenshots/largest-files.png)

---

## Settings

![Settings](docs/screenshots/settings.png)

---

# Download

Download the latest version from GitHub Releases.

https://github.com/YOUR_USERNAME/FileKit/releases/latest

---

# System Requirements

| Requirement | Minimum |
|-------------|----------|
| Operating System | Windows 10 / Windows 11 |
| RAM | 4 GB |
| Recommended RAM | 8 GB |
| Processor | Dual Core |
| Disk Space | 500 MB |
| Java | Bundled with Installer |

---

# Installation

## Step 1

Download the latest **FileKit-Setup.exe** from the GitHub Releases page.

---

## Step 2

Run the installer.

---

## Step 3

**Recommended Installation Location**

For the best experience, install FileKit in a user-owned directory such as:

```
D:\Applications\FileKit
```

or

```
E:\Software\FileKit
```

or

```
C:\Users\<YourUser>\Applications\FileKit
```

### Why?

Installing outside protected system directories may:

- Reduce permission-related issues
- Simplify updates
- Avoid Windows UAC restrictions
- Improve compatibility with advanced file operations

Although FileKit can run from the system drive, a dedicated applications folder is recommended whenever possible.

---

## Step 4

Launch FileKit.

---

# Quick Start

1. Open FileKit
2. Select a file or folder
3. Choose an operation
4. Click Run
5. View results instantly

---

# Available Operations

| Operation | Description |
|------------|-------------|
| Analyze | Analyze folder statistics |
| Organize | Organize files by type |
| Largest Files | Find largest files |
| Tree | Generate folder tree |
| Create File | Create new file |
| Move File | Move files |
| Remove Empty Directories | Delete empty folders |
| Properties | View file information |
| JSON Export | Export reports |

---

# Built With

## Backend

- Java
- Java NIO
- Multithreading
- JSON Processing

---

## Desktop

- Electron

---

## Frontend

- React
- JavaScript
- HTML5
- CSS3

---

## Charts

- Recharts

---

# Architecture

```
             +------------------------+
             |       React UI         |
             +-----------+------------+
                         |
                         |
                  Electron IPC
                         |
                         |
             +-----------+------------+
             |    Electron Main       |
             +-----------+------------+
                         |
                  Executes Commands
                         |
                         |
             +-----------+------------+
             |    Java File Engine    |
             +-----------+------------+
                         |
              File System Operations
                         |
                         |
             +-----------+------------+
             | Windows File System    |
             +------------------------+
```

---

# Performance

FileKit is optimized for:

- Large folders
- SSD storage
- Millions of files
- Deep directory structures
- Fast scanning

Performance depends on:

- Disk speed
- Folder size
- Number of files
- System memory

---

# Safety

FileKit performs file operations directly on your local system.

Before organizing important folders:

- Backup important files.
- Verify destination folders.
- Avoid interrupting active operations.

---

# Privacy

Your files remain on your computer.

FileKit:

- Does NOT upload files
- Does NOT collect personal documents
- Does NOT scan cloud storage
- Does NOT share data

All processing happens locally.

---

# Troubleshooting

## Application won't start

- Restart Windows
- Reinstall FileKit
- Ensure antivirus has not quarantined the application

---

## Permission denied

Run FileKit with appropriate permissions when accessing protected folders.

---

## Slow scanning

Large folders containing hundreds of thousands of files may require additional processing time.

---

## Windows SmartScreen Warning

Because FileKit may not yet be digitally signed, Windows may display a SmartScreen warning.

Choose:

```
More Info

↓

Run Anyway
```

Only download FileKit from the official GitHub Releases page.

---

# Frequently Asked Questions

## Is FileKit free?

Yes.

---

## Does FileKit require Java?

No.

The installer includes the required runtime.

---

## Does FileKit require internet?

No.

Everything runs locally.

---

## Does FileKit work offline?

Yes.

---

## Is my data uploaded?

No.

---

# Roadmap

Upcoming features include:

- Duplicate file detection
- AI-powered file organization
- Advanced search
- Dark Mode
- File preview
- Image duplicate detection
- Cloud integrations
- Automatic updates
- Plugin system
- Cross-platform support

---

# Building From Source

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/FileKit.git
```

Install dependencies

```bash
npm install
```

Start development

```bash
npm start
```

Create production build

```bash
npm run make
```

---

# Releases

Every release includes:

- Installer
- Changelog
- Bug fixes
- New features

Download the latest release from:

https://github.com/YOUR_USERNAME/FileKit/releases

---

# Contributing

Contributions are welcome.

You can contribute by:

- Reporting bugs
- Suggesting features
- Improving documentation
- Creating pull requests

---

# Report Issues

Please open an issue on GitHub with:

- FileKit version
- Windows version
- Steps to reproduce
- Screenshots (if applicable)

---

# License

This project is licensed under the MIT License.

---

# Acknowledgements

Special thanks to the open-source community and the technologies that power FileKit:

- Java
- Electron
- React
- Node.js

---

# Support

If you find FileKit useful, consider:

⭐ Starring the repository

🐛 Reporting bugs

💡 Suggesting new features

📢 Sharing the project

---

# Author

**Er. P. Rohit V. Acharya**

GitHub:

https://github.com/YOUR_USERNAME

---

<p align="center">

Made with ❤️ using Java, Electron and React.

</p>