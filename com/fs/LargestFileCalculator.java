package com.fs;

import com.javap.util.Json;
import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Stack;
import java.util.UUID;

public class LargestFileCalculator {

  private class FileData {

    protected String fileName, filePath;
    protected double fileSize;

    protected FileData(String fileName, String filePath, double fileSize) {
      this.fileName = fileName;
      this.filePath = filePath;

      this.fileSize = fileSize;
    }

    @Override
    public String toString() {
      return String.format(
        """
        {
          "fileName" : \"%s\",
          "filePath" : \"%s\",
          "fileSize" :  %.2f

        }""",
        fileName,
        filePath,
        fileSize
      );
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
    int top,
    boolean generateJson
  ) {
    // java -jar FileKit.jar -top 5 <folder-path> -<b|kb|mb|gb> -path

    File file = new File(rootPath);

    if (!file.isDirectory()) {
      System.out.println("[ERROR] File path should be a directory.");
      System.exit(1);
    }

    this.driveThroughFiles(file, printFilePath, measure, top);
    Json json = new Json();
    String M = measure.toUpperCase();
    Stack<FileData> stack = new Stack<>();
    while (pQ.size() > 0) stack.push(pQ.poll());
    int number = 0;
    while (!stack.isEmpty()) {
      FileData fileData = stack.pop();
      System.out.printf(
        "%-40s %12.2f %-3s %s%n",
        fileData.fileName,
        fileData.fileSize,
        measure,
        printFilePath ? fileData.filePath : ""
      );
      json.build(
        "file-" + (number++),
        new HashMap<>() {
          {
            put("fileName", fileData.fileName);
            put("fileSize", fileData.fileSize);
            put("measure", M);
            put("filePath", fileData.filePath);
          }
        }
      );
    }

    if (generateJson) {
      json.normalize(data -> {
        JsonWriter.writeToJsonFile(
          file.getName() + "-top-report-" + UUID.randomUUID().toString(),
          data
        );
      });
    }
    stack.clear();
  }
}
