This directory contains the Electron.js application that provides the graphical user interface (GUI) for FileKit. It serves as the frontend layer, interacting with the Java-based core engine to deliver a modern and intuitive desktop experience.

### File Structure
```bash
|-resources
|         |-binaries
|         |        |-FileKit.jar
|         |-runtime
|                 |-(Java RunTime, System Specific)
|-src
    |-....
```


### Mac OS Installation
```bash
sudo xattr -dr com.apple.quarantine ~/filekit.app
```
Make sure to enter this command, it enables the software to generate json reports by allowing file i/o operations. 