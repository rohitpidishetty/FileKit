package com.fs;

import com.javap.util.Json;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.util.*;

public class FileSizeCalculator {

  protected double globalFileSize = 0;

  protected void getFileSize(
    String filePath,
    File file,
    boolean status,
    String unit,
    String type,
    boolean generateJson
  ) {
    try {
      double size = file.length();
      if (status) printSizeOnScreen(size, file, unit, type, generateJson);
      globalFileSize += size;
    } catch (Exception e) {
      System.out.println(e.getMessage());
    }
  }

  protected void printSizeOnScreen(
    double size,
    File file,
    String unit,
    String type,
    boolean generateJson
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

    if (generateJson) {
      System.out.println("[INFO] Generating Json Report..");
      new Json()
        .build("type", type)
        .build("name", file.getName())
        .build("size", size)
        .build("unit", _unit_)
        .normalize(json -> {
          String folderName =
            file.getName() + "-size-report-" + UUID.randomUUID().toString();
          File root = new File("reports");
          try {
            File report = new File(root, folderName + "-report.json");

            try (
              BufferedWriter writer = new BufferedWriter(new FileWriter(report))
            ) {
              writer.write(json);
            }

            System.out.println(
              "File generated at reports/" + folderName + "-report.json"
            );
          } catch (Exception e) {
            System.out.println(e);
          }
        });
    }
  }

  protected void dfs(
    String folderPath,
    File file,
    String unit,
    boolean generateJson
  ) {
    if (file.isFile()) {
      this.getFileSize(folderPath, file, false, unit, "FILE", generateJson);
      return;
    }
    for (File subFile : file.listFiles())
      this.dfs(subFile.getAbsolutePath(), subFile, unit, generateJson);
  }
}
