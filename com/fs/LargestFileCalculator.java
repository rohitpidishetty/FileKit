package com.fs;

import java.io.File;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Stack;

public class LargestFileCalculator {

  private class FileData {

    protected String fileName, filePath;
    protected double fileSize;

    protected FileData(String fileName, String filePath, double fileSize) {
      this.fileName = fileName;
      this.filePath = filePath;

      this.fileSize = fileSize;
    }
  }

  /**
   *
   * kb : n / 1024                  : 1
   * mb : n / (1024 * 1024)         : 2
   * gb : n / (1024 * 1024 * 1024)  : 3
   */

  private static PriorityQueue<FileData> pQ = new PriorityQueue<>((a, b) ->
    Double.compare(a.fileSize, b.fileSize)
  );

  private static Map<String, Integer> size = Map.of(
    "b",
    0,
    "kb",
    1,
    "mb",
    2,
    "gb",
    3,
    "tb",
    4
  );

  private void driveThroughFiles(
    File file,
    boolean printFilePath,
    String measure,
    int top
  ) {
    if (file.isFile()) {
      double n = file.length();
      double _size_ = n;
      if (LargestFileCalculator.size.containsKey(measure)) _size_ /= Math.pow(
        1024,
        LargestFileCalculator.size.get(measure)
      );

      pQ.add(new FileData(file.getName(), file.getAbsolutePath(), _size_));

      while (pQ.size() > top) pQ.poll();

      return;
    }

    for (File subFile : file.listFiles())
      driveThroughFiles(subFile, printFilePath, measure, top);
  }

  public void main(
    String rootPath,
    boolean printFilePath,
    String measure,
    int top
  ) {
    // java -jar FileKit.jar -top 5 <folder-path> -<b|kb|mb|gb>

    File file = new File(rootPath);

    if (!file.isDirectory()) {
      System.out.println("[ERROR] File path should be a directory.");
      System.exit(1);
    }

    this.driveThroughFiles(file, printFilePath, measure, top);

    measure = measure.toUpperCase();
    Stack<FileData> stack = new Stack<>();
    while (pQ.size() > 0) stack.push(pQ.poll());
    while (!stack.isEmpty()) {
      FileData fileData = stack.pop();
      System.out.printf(
        "%-40s %12.2f %-3s %s%n",
        fileData.fileName,
        fileData.fileSize,
        measure,
        printFilePath ? fileData.filePath : ""
      );
    }
    stack.clear();
  }
}
