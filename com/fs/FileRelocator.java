package com.fs;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.Collections;

public class FileRelocator {

  private void dfs(File file, String path, String root, String destination) {
    if (file.isFile()) {
      String newFilePath =
        destination + "\\" + root + file.getAbsolutePath().replace(path, "");
      System.out.println(newFilePath);
      File newFile = new File(newFilePath);

      try {
        File parent = newFile.getParentFile();
        if (parent != null) parent.mkdirs();

        newFile.createNewFile();
        Thread.sleep(20);
        try (
          FileInputStream fis = new FileInputStream(file);
          FileOutputStream fos = new FileOutputStream(newFile)
        ) {
          int bytesRead;
          byte[] chunk = new byte[4096];
          while ((bytesRead = fis.read(chunk)) != -1) {
            fos.write(chunk, 0, bytesRead);
          }
        } catch (Exception err) {
          System.err.println("[ERROR] " + err.getMessage());
        }
      } catch (Exception e) {
        System.err.println("[ERROR] " + e.getMessage());
      }
      return;
    }
    for (File subFile : file.listFiles()) dfs(subFile, path, root, destination);
  }

  public void move(String source, String destination) {
    // -mv <source-file> <destination-directory>

    File dir = new File(destination);

    if (!dir.isDirectory()) {
      System.err.println(
        "[ERROR] Parameter destination is expected to be a directory path"
      );
      System.exit(1);
    }
    File sourceFile = new File(source);

    if (sourceFile.exists() == false) {
      System.err.println("[ERROR] File Not Found");
      System.exit(1);
    }

    if (sourceFile.isFile()) {
      // Moving file into a folder
      File newFile = new File(
        destination.concat("\\").concat(sourceFile.getName())
      );

      try (
        FileInputStream fis = new FileInputStream(source);
        FileOutputStream fos = new FileOutputStream(newFile)
      ) {
        byte[] chunk = new byte[4096];
        int bytesRead;
        while ((bytesRead = fis.read(chunk)) != -1) fos.write(
          chunk,
          0,
          bytesRead
        );

        System.out.println("[INFO] File has been moved.");
      } catch (Exception err) {
        System.out.println(err);
        System.err.println("[ERROR] Unable to read the file");
      }
      try {
        Files.delete(Paths.get(source));
      } catch (Exception e) {}
    } else {
      // Moving folder into a folder
      this.dfs(
        sourceFile,
        source,
        source.substring(source.lastIndexOf("\\") + 1),
        destination
      );
      try {
        Files.walk(Paths.get(source))
          .sorted(Collections.reverseOrder())
          .forEach(path -> {
            try {
              Files.delete(path);
            } catch (IOException e) {
              throw new UncheckedIOException(e);
            }
          });
      } catch (IOException | UncheckedIOException e) {
        System.err.printf(
          "[ERROR] Failed to delete '%s': %s%n",
          source,
          e.getMessage()
        );
      }
    }
  }
}
