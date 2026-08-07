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
java -jar FileKit.jar -seg "C:\Users\<YourName>\Desktop\GARUDA (Programming language development)" "C:\Users\<YourName>\Desktop\Seg"
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
java -jar FileKit.jar -rmdf "C:\Users\<YourName>\Desktop\Folder"
```

---

### View File Tree

Scans and prints files in tree order.

#### Usage

```bash
java -jar FileKit.jar -tree <source-directory>
```

#### Example

```bash
java -jar FileKit.jar -tree "C:\Users\<YourName>\Desktop\Folder"
```

---

### Move Files & Folders

Moves files and folders to another specified destination

#### Usage

```bash
java -jar FileKit.jar -mv <source-directory> <destination-directory>
```

#### Example

```bash
java -jar FileKit.jar -mv "C:\Users\<YourName>\Desktop\A" "C:\Users\<YourName>\Desktop\B"
```

---

### Create a new file

Create a new file

#### Usage

```bash
java -jar FileKit.jar -create <file-name> <destination-directory>
```

#### Example

```bash
java -jar FileKit.jar -create  "file.txt" "C:\\Users\\<YourName>\\Desktop\\Folder"
```

---

### Getting file properties 

Get file properties (Name, Size, Creation time)

#### Usage

```bash
java -jar FileKit.jar -props <file-path>
```

#### Example

```bash
java -jar FileKit.jar -props "C:\\Users\\<YourName>\\Desktop\\Folder\\file.txt"
```

---

### Compress and decompress files using squash 

Internally uses squash program to compress and decompress files

#### Usage

```bash
java -jar FileKit.jar -squash <file-path> <squashed-file-name> <squashed-output-path>
java -jar FileKit.jar -desquash <file-path> <desquashed-output-path>
```

#### Example

```bash
java -jar FileKit.jar -squash "D:\\Java" pgms "C:\\Users\\<YourName>\\Desktop"
java -jar FileKit.jar -desquash "C:\\Users\\<YourName>\\Desktop\\pgms.sq" "C:\\Users\\<YourName>\\Desktop"
```
---

### Top 'N' largest files 

Scans a directory and lists the top 'N' largest files.

#### Usage

```bash
java -jar FileKit.jar -top <number> <folder-path> <-b|-kb|-mb|-gb> -path
```

#### Example

```bash
java -jar FileKit.jar -top 5 "C:\\Users\\<YourName>\\Desktop\\Folder" -mb -path
```
---

### Get directory statistics 

Displays comprehensive directory and file statistics.

#### Usage

```bash
java -jar FileKit.jar -stats <folder-path>
```

#### Example

```bash
java -jar FileKit.jar -stats "C:\\Users\\<YourName>\\Desktop\\Folder"
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

## Features

- File search
- Segregate files into dedicated directories
- Copy files and directories
- Move files and directories
- Duplicate file detection
- Directory tree generation
- Disk usage analysis
- Compress and de-compress files

---

## Requirements

- openjdk version "25.0.1" 2025-10-21 LTS
- OpenJDK Runtime Environment Microsoft-12972523 (build 25.0.1+8-LTS)
- OpenJDK 64-Bit Server VM Microsoft-12972523 (build 25.0.1+8-LTS, mixed mode, sharing)

---

## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE.
