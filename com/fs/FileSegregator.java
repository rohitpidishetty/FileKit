package com.fs;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;

public class FileSegregator {

  private Set<String> fileExtensions = new HashSet<>();

  public void scanFileTypes(String filePath, Set<String> feObj) {
    File file = new File(filePath);
    if (!file.exists()) {
      System.out.println("[ERROR] File does not exists");
      System.exit(1);
    }
    if (file.isFile()) {
      String fName = file.getName();
      if (!fName.contains(".")) return;
      feObj.add(fName.split("[.]")[1]);
      return;
    }
    for (File subFile : file.listFiles())
      scanFileTypes(subFile.getAbsolutePath(), feObj);
  }

  public void createDirectories(String rootFilePath) throws Exception {
    File file = new File(rootFilePath);
    if (!file.exists()) file.mkdir();
    this.fileExtensions.iterator().forEachRemaining(e -> {
      try {
        new File(file.getAbsoluteFile(), e.concat("_files")).mkdir();
      } catch (Exception err) {
        System.out.println(err);
      }
    });
    new File(file.getAbsoluteFile(), "extra_files").mkdir();
  }

  public void copyAllFilesIntoSegregatedDirectories(
    String filePath,
    String newRootFilePath
  ) {
    File file = new File(filePath);
    if (file.isFile()) {
      String fName = file.getName();
      String extension = fName.contains(".") ? fName.split("[.]")[1] : "extra";
      String copyTo = newRootFilePath
        .concat("\\")
        .concat(extension)
        .concat("_files\\")
        .concat(fName);
      System.out.printf(
        "[INFO] Copying file contents from [%s] to [%s]%n",
        file.getAbsolutePath(),
        copyTo
      );
      File newFile = new File(copyTo);

      if (!newFile.exists()) {
        try {
          newFile.createNewFile();
          // System.out.println("Created new file");
        } catch (Exception e) {}
      }

      try (
        FileInputStream fis = new FileInputStream(file);
        FileOutputStream fos = new FileOutputStream(newFile);
      ) {
        byte[] chunk = new byte[4096]; // 4 KB will be read per-loop
        int bytesRead;
        while ((bytesRead = fis.read(chunk)) != -1) fos.write(chunk);
      } catch (Exception e) {
        System.out.println(e.getMessage());
        System.exit(1);
      }
      try {
        Files.deleteIfExists(file.toPath());
      } catch (Exception e) {
        System.out.println(e.getMessage());
        System.exit(1);
      }
      return;
    }
    for (File subFile : file.listFiles()) {
      copyAllFilesIntoSegregatedDirectories(
        subFile.getAbsolutePath(),
        newRootFilePath
      );
    }
  }

  public void segregate(String from, String to) {
    try {
      FileSegregator fl = new FileSegregator();
      fl.fileExtensions = new HashSet<>();
      fl.scanFileTypes(from, fl.fileExtensions);
      System.out.println("[INFO] Starting file system scan...");
      Thread t1 = new Thread(() -> {
        try {
          Thread.sleep(1000);
          System.out.println("[INFO] Discovering supported file types...");

          Thread.sleep(1000);
          System.out.println(
            "[INFO] File type discovery completed successfully."
          );
          System.out.println(
            "[INFO] Supported file types: " + fl.fileExtensions
          );
        } catch (InterruptedException e) {
          Thread.currentThread().interrupt();
          System.err.println("[ERROR] File type discovery was interrupted.");
        }
      });
      t1.start();
      fl.createDirectories(to);
      t1.join();
      Thread.sleep(200);
      System.out.println("[INFO] Successfully created all sub-directories");
      fl.copyAllFilesIntoSegregatedDirectories(from, to);
      System.out.println("[INFO] Segregation Completed");
      Files.walk(Path.of(from))
        .sorted(Comparator.reverseOrder())
        .forEach(p -> {
          try {
            Files.delete(p);
          } catch (IOException e) {
            throw new RuntimeException(e);
          }
        });
    } catch (Exception e) {
      System.out.println(e.getMessage());
    }
  }
}
