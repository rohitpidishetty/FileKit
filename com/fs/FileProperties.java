package com.fs;

import com.javap.util.Json;
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.attribute.UserPrincipal;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

public class FileProperties {

  public void getProps(String filePath, boolean generateJson) {
    Path path = Paths.get(filePath);

    if (!Files.exists(path)) {
      System.err.println("[ERROR] File does not exist.");
      return;
    }

    try {
      BasicFileAttributes attrs = Files.readAttributes(
        path,
        BasicFileAttributes.class
      );

      UserPrincipal owner = Files.getOwner(path);
      FileStore store = Files.getFileStore(path);

      System.out.println(
        "======================================================"
      );
      System.out.println("                 FILE PROPERTIES");
      System.out.println(
        "======================================================"
      );

      System.out.printf("%-18s : %s%n", "Name", path.getFileName());
      System.out.printf("%-18s : %s%n", "Extension", getExtension(path));
      System.out.printf("%-18s : %s%n", "Location", path.getParent());
      System.out.printf("%-18s : %s%n", "Absolute Path", path.toAbsolutePath());

      System.out.println();

      System.out.printf(
        "%-18s : %s (%d bytes)%n",
        "Size",
        humanReadable(attrs.size()),
        attrs.size()
      );

      System.out.println();

      System.out.printf(
        "%-18s : %s%n",
        "Created",
        format(attrs.creationTime().toMillis())
      );

      System.out.printf(
        "%-18s : %s%n",
        "Modified",
        format(attrs.lastModifiedTime().toMillis())
      );

      System.out.printf(
        "%-18s : %s%n",
        "Accessed",
        format(attrs.lastAccessTime().toMillis())
      );

      System.out.println();

      System.out.printf("%-18s : %s%n", "Owner", owner.getName());
      System.out.printf(
        "%-18s : %s%n",
        "Readable",
        yesNo(Files.isReadable(path))
      );
      System.out.printf(
        "%-18s : %s%n",
        "Writable",
        yesNo(Files.isWritable(path))
      );
      System.out.printf(
        "%-18s : %s%n",
        "Executable",
        yesNo(Files.isExecutable(path))
      );
      System.out.printf("%-18s : %s%n", "Hidden", yesNo(Files.isHidden(path)));

      System.out.println();

      System.out.printf(
        "%-18s : %s%n",
        "Regular File",
        yesNo(attrs.isRegularFile())
      );
      System.out.printf(
        "%-18s : %s%n",
        "Directory",
        yesNo(attrs.isDirectory())
      );
      System.out.printf(
        "%-18s : %s%n",
        "Symbolic Link",
        yesNo(attrs.isSymbolicLink())
      );

      System.out.println();

      System.out.printf("%-18s : %s%n", "File Store", store.name());
      System.out.printf(
        "%-18s : %s%n",
        "Total Space",
        humanReadable(store.getTotalSpace())
      );
      System.out.printf(
        "%-18s : %s%n",
        "Usable Space",
        humanReadable(store.getUsableSpace())
      );

      System.out.println(
        "======================================================"
      );

      if (generateJson) {
        new Json()
          .build("Name", path.getFileName().toString())
          .build("Extension", getExtension(path))
          .build("Location", path.getParent().toString().replace("\\", "/"))
          .build(
            "Absolute Path",
            path.toAbsolutePath().toString().replace("\\", "/")
          )
          .build("Size", attrs.size() + " bytes")
          .build("Created", format(attrs.creationTime().toMillis()))
          .build("Modified", format(attrs.lastModifiedTime().toMillis()))
          .build("Accessed", format(attrs.lastAccessTime().toMillis()))
          .build("Readable", yesNo(Files.isReadable(path)))
          .build("Writable", yesNo(Files.isWritable(path)))
          .build("Executable", yesNo(Files.isExecutable(path)))
          .build("Hidden", yesNo(Files.isHidden(path)))
          .build("Regular File", yesNo(attrs.isRegularFile()))
          .build("Directory", yesNo(attrs.isDirectory()))
          .build("Symbolic Link", yesNo(attrs.isSymbolicLink()))
          .build("Total Space", humanReadable(store.getTotalSpace()))
          .build("Usable Space", humanReadable(store.getUsableSpace()))
          .normalize(json -> {
            JsonWriter.writeToJsonFile(
              path.getFileName() +
                "-props-report-" +
                UUID.randomUUID().toString(),
              json
            );
          });
      }
    } catch (IOException e) {
      System.err.println("[ERROR] " + e.getMessage());
    }
  }

  private static String getExtension(Path path) {
    String name = path.getFileName().toString();
    int index = name.lastIndexOf('.');
    return (index == -1) ? "N/A" : name.substring(index);
  }

  private static String format(long millis) {
    return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(millis));
  }

  private static String yesNo(boolean value) {
    return value ? "Yes" : "No";
  }

  private static String humanReadable(long bytes) {
    if (bytes < 1024) return bytes + " B";

    double value = bytes;
    String[] units = { "KB", "MB", "GB", "TB" };
    int i = -1;

    do {
      value /= 1024;
      i++;
    } while (value >= 1024 && i < units.length - 1);

    return new DecimalFormat("#.##").format(value) + " " + units[i];
  }
}
