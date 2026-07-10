package com.fs;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;

public class JsonWriter {

  public static void writeToJsonFile(String name, String payload) {
    System.out.println("[INFO] Generating Json Report..");
    File root = new File("reports");
    if (root.exists() == false) root.mkdir();
    try {
      File report = new File(root, name + "-report.json");

      try (BufferedWriter writer = new BufferedWriter(new FileWriter(report))) {
        writer.write(payload);
      }

      System.out.println("File generated at reports/" + name + "-report.json");
    } catch (Exception e) {
      System.out.println(e);
    }
  }
}
