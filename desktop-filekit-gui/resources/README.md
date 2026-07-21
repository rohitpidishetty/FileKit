### Compilation Notes

* Generate Java run-time w.r.t the system's architecture, this makes it easy to distribute the software with the need of having each user to have java installed on their system.
* This  project only need's *java.base*, thus lets create a runtime for it using *jlink*

### Windows
```bash
jlink ^
  --module-path "%JAVA_HOME%\jmods" ^
  --add-modules java.base ^
  --output runtime
```


### Mac/Linux
```bash
jlink \
  --module-path "$JAVA_HOME/jmods" \
  --add-modules java.base \
  --output runtime
```