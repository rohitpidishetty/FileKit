package com.fs;

import java.io.File;

public class FileTree {

  private void printTree(File file, String prefix, boolean isLast) {
    System.out.println(prefix + (isLast ? "└─ " : "├─ ") + file.getName());

    if (!file.isDirectory()) return;

    File[] files = file.listFiles();
    if (files == null || files.length == 0) return;

    for (int i = 0; i < files.length; i++) {
      printTree(
        files[i],
        prefix + (isLast ? "  " : "│ "),
        (i == files.length - 1)
      );
    }
  }

  protected void view(String path) {
    File file = new File(path);
    if (!file.exists()) {
      System.out.println("[ERROR] File Not Found.");
      System.exit(1);
    }
    this.printTree(file, "", false);
  }
}
