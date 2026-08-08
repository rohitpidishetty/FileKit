## Recompiling Binaries

* Clone our repo
* git clone https://github.com/rohitpidishetty/FileKit.git

```bash
cd FileKit
```

### Compile the FileKit program

```bash
javac com/fs/*.java
javac com/squash/*.java
javac com/javap/util/*.java
```

### Turn class files into archive

```bash
jar cfe FileKit.jar com.fs.FileSystem com
```

### Generate java runtime

* Generate Java run-time w.r.t the system's architecture, this makes it easy to distribute the software with the need of having each user to have java installed on their system.
* This  project only need's *java.base*, thus lets create a runtime for it using *jlink*

### Windows
```bash
jlink `
  --module-path "%JAVA_HOME%\jmods" `
  --add-modules java.base `
  --output runtime
```


### Mac/Linux
```bash
jlink \
  --module-path "$JAVA_HOME/jmods" \
  --add-modules java.base \
  --output runtime
```

### GUI initiation
* Move *runtime/* & *FileKit.jar* into
```bash
desktop-filekit-gui/
|
|_resources/
  |
  |_binaries/
  |   |_FileKit.jar
  |
  |_runtime/  
```
* npm start
* npm run make:win:arm64
* npm run make:[platform]:[chip]