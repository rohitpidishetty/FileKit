package com.fs;

import java.io.File;

public class FileCreator {

  public void createFile(String fileName, String destination) {
    // java -jar FileKit.jar -create <file-name> <destination-directory>

    if (!(fileName.contains(".") && fileName.split("[.]").length == 2)) {
      System.out.println("[ERROR] Invalid file name.");
      System.exit(1);
    }

    File dir = new File(destination, fileName);
    File parentFolders = dir.getParentFile();

    if (!parentFolders.isDirectory()) parentFolders.mkdirs();

    try {
      dir.createNewFile();
      System.err.println("[INFO] File created successfully.");
    } catch (Exception e) {
      System.err.println(
        "[ERROR] Could not create a new file, try again later."
      );
    }
  }
}
