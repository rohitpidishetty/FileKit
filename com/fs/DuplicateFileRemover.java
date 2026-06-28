package com.fs;

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.util.HashSet;
import java.util.Set;

public class DuplicateFileRemover {

  private String sha256(String path) throws Exception {
    MessageDigest md = MessageDigest.getInstance("SHA-256");

    try (FileInputStream fis = new FileInputStream(path)) {
      byte[] buffer = new byte[4096];
      int bytesRead;
      while ((bytesRead = fis.read(buffer)) != -1) md.update(
        buffer,
        0,
        bytesRead
      );
    }
    byte[] hash = md.digest();
    StringBuilder sb = new StringBuilder();
    for (byte b : hash) sb.append(String.format("%02x", b));
    return sb.toString();
  }

  private String generateCheckSum(String file) throws Exception {
    return this.sha256(file);
  }

  private Set<String> checkSumPool;

  public void detectDuplicateFiles(String filePath) throws Exception {
    File file = new File(filePath);
    if (file.isFile()) {
      String checkSum = generateCheckSum(file.getAbsolutePath());
      if (this.checkSumPool.contains(checkSum)) {
        System.out.printf(
          "[INFO] Duplicate file identified. Deleting '%s'.%n",
          file.getAbsolutePath()
        );
        try {
          Files.delete(Paths.get(file.getAbsolutePath()));
        } catch (Exception err) {
          System.out.println("[ERROR] Could not delete file " + file.getName());
        }
        return;
      }
      this.checkSumPool.add(checkSum);
      return;
    }
    for (File subFile : file.listFiles())
      detectDuplicateFiles(subFile.getAbsolutePath());
  }

  public void detectAndRemoveDupFiles(String filePath) {
    try {
      DuplicateFileRemover rmdf = new DuplicateFileRemover();
      rmdf.checkSumPool = new HashSet<>();
      rmdf.detectDuplicateFiles(filePath);
    } catch (Exception e) {
      System.out.println(e.getMessage());
    }
  }
}
