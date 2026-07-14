package com.fs;

import com.javap.util.Json;
import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

public class DirectoryAnalyzer {

  private static Set<String> folderNames;
  private static int numberOfFiles;
  private static Map<String, Integer> frequency;
  private static int maxDepth = 0;
  private static double memory;
  private static String largestSoFarFileName, smallestSoFarFileName;
  private static double largestSoFarFileSize = Double.MIN_VALUE,
    smallestSoFarFileSize = Double.MAX_VALUE;

  private static void driveThroughFiles(File folder, String root, int depth) {
    maxDepth = Math.max(maxDepth, depth);
    if (folder.isFile()) {
      for (String folderName : folder
        .getParent()
        .replace(root, "")
        .split("[/\\\\]+")) {
        if (
          folderName.length() == 0 || folderNames.contains(folderName)
        ) continue;
        folderNames.add(folderName);
      }
      String name = folder.getName();
      if (name.contains(".")) {
        String extension = (name.substring(name.lastIndexOf(".") + 1));
        frequency.put(extension, frequency.getOrDefault(extension, 0) + 1);
      }
      double size = folder.length();
      memory += size;
      numberOfFiles++;
      if (size > largestSoFarFileSize) {
        largestSoFarFileSize = size;
        largestSoFarFileName = name;
      }
      if (size < smallestSoFarFileSize) {
        smallestSoFarFileSize = size;
        smallestSoFarFileName = name;
      }
      return;
    }

    for (File file : folder.listFiles())
      driveThroughFiles(file, root, depth + 1);
  }

  public static void main(String dir, boolean generateJson) {
    File folder = new File(dir);
    if (folder.isDirectory() == false) {
      System.out.println("[ERROR] Expected a folder path.");
      System.exit(1);
    }
    folderNames = new HashSet<>();
    frequency = new HashMap<>();
    driveThroughFiles(folder, dir, 0);
    int numberOfFolders = folderNames.size();
    folderNames.clear();

    Json json = new Json();

    if (generateJson) json.build(
      "Details",
      new HashMap<>() {
        {
          put("Folders", numberOfFolders);
          put("Files", numberOfFiles);
          put("Max Depth", maxDepth);
          put(
            "Smallest File",
            new HashMap<>() {
              {
                put("Name", smallestSoFarFileName);
                put("size", smallestSoFarFileSize);
              }
            }
          );
          put(
            "Largest File",
            new HashMap<>() {
              {
                put("Name", largestSoFarFileName);
                put("Size", largestSoFarFileSize);
              }
            }
          );
          put("Total Memory", (memory / (1024.0 * 1024 * 1024)) + " GB");
        }
      }
    );

    System.out.printf("Folders          : %,d%n", numberOfFolders);
    System.out.printf("Files            : %,d%n", numberOfFiles);
    System.out.printf("Max Depth        : %,d%n", maxDepth);
    System.out.printf(
      "Largest File     : %s (%,.2f GB)%n",
      largestSoFarFileName,
      largestSoFarFileSize / (1024.0 * 1024 * 1024)
    );

    System.out.printf(
      "Smallest File    : %s (%,.2f B)%n",
      smallestSoFarFileName,
      smallestSoFarFileSize
    );

    System.out.printf(
      "Total Memory     : %,.2f GB%n",
      memory / (1024.0 * 1024 * 1024)
    );

    System.out.println("\nFile-Type Distribution");
    System.out.println("----------------------");

    List<Map<String, Object>> ordered = new ArrayList<>();

    frequency
      .entrySet()
      .stream()
      .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
      .forEach(entry -> {
        System.out.printf(
          "%-12s : %,5d%n",
          "." + entry.getKey(),
          entry.getValue()
        );
        if (generateJson) ordered.add(
          new HashMap<>() {
            {
              put("type", entry.getKey());
              put("count", entry.getValue());
            }
          }
        );
      });

    if (generateJson) json.build("distribution", ordered);

    if (generateJson) {
      json.normalize(data -> {
        JsonWriter.writeToJsonFile(
          folder.getName() + "-stats-report-" + UUID.randomUUID().toString(),
          data
        );
      });
    }
  }
}
