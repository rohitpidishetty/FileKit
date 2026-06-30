package com.fs;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;

public class FileSystem {

  private static double globalFileSize = 0;

  private static void getFileSize(
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

  private static void printSizeOnScreen(
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

  private static void dfs(String folderPath, File file, String unit) {
    if (file.isFile()) {
      getFileSize(folderPath, file, false, unit, "FILE");
      return;
    }
    for (File subFile : file.listFiles())
      dfs(subFile.getAbsolutePath(), subFile, unit);
  }

  public static void main(String[] args) {
    if (args.length == 0) {
      printUsage();
      System.exit(1);
    }

    String command = args[0];

    try {
      switch (command) {
        case "-size": // Folder size
          System.out.println("[INFO] Calculating..");
          if (args.length != 3) {
            System.err.println("Error: Invalid arguments for -size command.");
            printUsage();
            System.exit(1);
          }

          String path = args[1];
          String unit = args[2];

          if (
            !unit.equals("-kb") && !unit.equals("-mb") && !unit.equals("-gb")
          ) {
            System.err.println(
              "Error: Invalid size unit. Use -kb, -mb, or -gb."
            );
            System.exit(1);
          }

          File file = new File(path);

          if (!file.exists()) {
            System.err.println("Error: Path does not exist: " + path);
            System.exit(1);
          }

          if (file.isFile()) {
            getFileSize(path, file, true, unit, "FILE");
          } else if (file.isDirectory()) {
            dfs(path, file, unit);
            printSizeOnScreen(globalFileSize, file, unit, "FOLDER");
          } else {
            System.err.println("Error: Unsupported path type: " + path);
            System.exit(1);
          }
          break;
        case "-seg": // Segregate cluttered files into separate dedicated folders
          if (args.length != 3) {
            System.err.println("Error: Invalid arguments for -seg command.");
            printUsage();
            System.exit(1);
          }

          String sourcePath = args[1];
          String destinationPath = args[2];

          File source = new File(sourcePath);

          if (!source.exists()) {
            System.err.println(
              "Error: Source path does not exist: " + sourcePath
            );
            System.exit(1);
          }

          new FileSegregator().segregate(sourcePath, destinationPath);
          break;
        case "-rmdf": // Remove Duplicate Files
          if (args.length != 2) {
            System.err.println("Error: Invalid arguments for -rmdf command.");
            printUsage();
            System.exit(1);
          }
          DuplicateFileRemover dupFileRem = new DuplicateFileRemover();
          dupFileRem.detectAndRemoveDupFiles(args[1]);
          break;
        case "-tree":
          if (args.length != 2) {
            printUsage();
            System.exit(1);
          }
          new FileTree().view(args[1]);
          break;
        default:
          System.err.println("Error: Unknown command: " + command);
          printUsage();
          System.exit(1);
      }
    } catch (Exception e) {
      System.err.println("Error: Operation failed.");
      System.err.println("Reason: " + e.getMessage());
      System.exit(1);
    }
  }

  private static void printUsage() {
    System.err.println(
      """
      Usage:
          java FileKit -size <file-path> <-kb|-mb|-gb>
          java FileKit -seg  <source-folder-path> <destination-folder-path>
          java FileKit -rmdf <source-folder-path>
          java FileKit -tree <folder-path>
      Examples:
          java FileKit -size "C:\\Users\\Rohit\\Desktop\\test.txt" -mb
          java FileKit -size "C:\\Users\\Rohit\\Desktop" -gb
          java FileKit -seg "C:\\Users\\Rohit\\Downloads" "C:\\Users\\Rohit\\SortedFiles"
          java FileKit -rmdf "C:\\Users\\Rohit\\Folder"
          java FileKit -tree "C:\\Users\\Rohit\\Folder"
      """
    );
  }
}
