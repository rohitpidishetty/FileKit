package com.fs;

import java.io.File;

public class FileSizeCalculator {

  protected double globalFileSize = 0;

  protected void getFileSize(
    String filePath,
    File file,
    boolean status,
    String unit,
    String type
  ) {
    try {
      double size = file.length();
      if (status) printSizeOnScreen(size, file, unit, type);
      globalFileSize += size;
    } catch (Exception e) {
      System.out.println(e.getMessage());
    }
  }

  protected void printSizeOnScreen(
    double size,
    File file,
    String unit,
    String type
  ) {
    String _unit_ = new String("B");
    if (unit.equals("-kb")) {
      size /= 1024d;
      _unit_ = "KB";
    } else if (unit.equals("-mb")) {
      size /= (1024d * 1024d);
      _unit_ = "MB";
    } else if (unit.equals("-gb")) {
      size /= (1024d * 1024d * 1024d);
      _unit_ = "GB";
    }
    System.out.printf(
      "%s: %-30s | SIZE: %8.6f%s%n",
      type,
      file.getName(),
      size,
      _unit_
    );
  }

  protected void dfs(String folderPath, File file, String unit) {
    if (file.isFile()) {
      this.getFileSize(folderPath, file, false, unit, "FILE");
      return;
    }
    for (File subFile : file.listFiles())
      this.dfs(subFile.getAbsolutePath(), subFile, unit);
  }
}
