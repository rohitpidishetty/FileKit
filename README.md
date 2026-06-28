# FileKit

FileKit is a command-line utility for performing common filesystem operations. It provides a modular framework for analyzing, organizing, and managing files and directories with an emphasis on simplicity, performance, and extensibility.

The project currently includes utilities for recursive file and directory size analysis and file organization by extension. Its architecture is designed to accommodate additional filesystem capabilities while maintaining a consistent command-line interface.

---

## Features

### Recursive File and Directory Size Analysis

Computes the total size of a file or directory by traversing the filesystem recursively.

Supported output units:

- Kilobytes (KB)
- Megabytes (MB)
- Gigabytes (GB)

#### Usage

```bash
java -jar FileKit.jar -size <path> -kb
java -jar FileKit.jar -size <path> -mb
java -jar FileKit.jar -size <path> -gb
```

#### Example

```bash
java -jar FileKit.jar -size . -gb
```

Output

```text
FOLDER: .                              | SIZE: 0.000710GB
```

---

### File Segregation

Recursively scans a source directory and organizes files into destination folders based on their file extensions.

#### Usage

```bash
java -jar FileKit.jar -seg <source-directory> <destination-directory>
```

#### Example

```bash
java -jar FileKit.jar -seg "C:\Users\rohit\Desktop\GARUDA (Programming language development)" "C:\Users\rohit\Desktop\Seg"
```

---

### Removing Duplicate Files

Recursively scans a source directory and deletes all duplicate files.

#### Usage

```bash
java -jar FileKit.jar -rmdf <source-directory>
```

#### Example

```bash
java -jar FileKit.jar -seg "C:\Users\rohit\Desktop\Folder"
```

---

## Building

Compile the source files.

```bash
javac com/fs/*.java
```

Package the compiled classes into an executable JAR.

```bash
jar cfe FileKit.jar com.fs.FileSystem com
```

---

## Running

Execute FileKit using the Java Runtime Environment.

```bash
java -jar FileKit.jar <command> [arguments]
```

---

## Design Principles

- Modular architecture
- Platform-independent implementation
- Efficient recursive filesystem traversal
- Minimal external dependencies
- Consistent command-line interface
- Extensible command framework

---

## Planned Features

The following utilities are planned for future releases.

- File search
- Copy files and directories
- Move files and directories
- Delete files and directories
- Duplicate file detection
- Directory tree generation
- Disk usage analysis


---

## Project Structure

```text
FileKit/
├── com/
│   └── fs/
│       ├── FileSystem.java
│       ├── FileSegregator.java
│       └── ...
├── FileKit.jar
└── README.md
```

---

## Requirements

- Java Development Kit (JDK) 11 or later
- Java Runtime Environment (JRE) 11 or later

---

## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE.


---

## Recompiling Binaries

```bash
jar cfe FileKit.jar com.fs.FileSystem com 
```

```
├── com/
│   └── fs/
│       ├── FileSystem.java
│       ├── FileSegregator.java
│       └── ...
```