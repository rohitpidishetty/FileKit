package com.fs;

import com.fs.squash.Squash;
import java.io.File;

public class FileSystem {

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
          FileSizeCalculator fsCal = new FileSizeCalculator();
          if (file.isFile()) fsCal.getFileSize(path, file, true, unit, "FILE");
          else if (file.isDirectory()) {
            fsCal.dfs(path, file, unit);
            fsCal.printSizeOnScreen(fsCal.globalFileSize, file, unit, "FOLDER");
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
        case "-mv":
          if (args.length != 3) {
            printUsage();
            System.exit(1);
          }
          FileRelocator fileRelocator = new FileRelocator();
          fileRelocator.move(args[1], args[2]);
          break;
        case "-create":
          if (args.length != 3) {
            printUsage();
            System.exit(1);
          }
          FileCreator fileCreator = new FileCreator();
          fileCreator.createFile(args[1], args[2]);
          break;
        case "-props":
          if (args.length != 2) {
            printUsage();
            System.exit(1);
          }
          FileProperties fileProps = new FileProperties();
          fileProps.getProps(args[1]);
          break;
        case "-squash":
          if (args.length != 3) {
            printUsage();
            System.exit(1);
          }
          new Squash(new String[] { "-compress", args[1], args[2] });
          break;
        case "-desquash":
          if (args.length != 2) {
            printUsage();
            System.exit(1);
          }
          new Squash(new String[] { "-decompress", args[1] });
          break;
        case "-top":
          LargestFileCalculator larFileCal = new LargestFileCalculator();
          // -top, 5, <folder-path>, -<b|kb|mb|gb>, -path
          if (!(args.length == 5 || args.length == 4)) {
            printUsage();
            System.exit(1);
          }

          larFileCal.main(
            args[2],
            args.length == 5,
            args[3].replace("-", ""),
            Integer.parseInt(args[1])
          );
          break;
        case "-stats":
          if (args.length != 2) {
            printUsage();
            System.exit(1);
          }
          DirectoryAnalyzer.main(args[1]);
          break;
        default:
          System.err.println("Error: Unknown command: " + command);
          printUsage();
          System.exit(1);
      }
    } catch (Exception e) {
      System.err.println("[Error] Operation failed.");
      System.err.println("Reason: " + e.getMessage());
      System.exit(1);
    }
  }

  private static void printUsage() {
    System.err.println(
      """
      Usage:
          java -jar FileKit.jar -size <file-path> <-kb|-mb|-gb>
          java -jar FileKit.jar -seg  <source-folder-path> <destination-folder-path>
          java -jar FileKit.jar -rmdf <source-folder-path>
          java -jar FileKit.jar -tree <folder-path>
          java -jar FileKit.jar -mv <source-file> <destination-folder>
          java -jar FileKit.jar -create <file-name> <destination-directory>
          java -jar FileKit.jar -props <file-path>
          java -jar FileKit.jar -squash <file-path> <squashed-file-name>
          java -jar FileKit.jar -desquash <file-path>
          java -jar FileKit.jar -top <number> <folder-path> <-b|-kb|-mb|-gb> -path
          java -jar FileKit.jar -stats <folder-path>

      Examples:
          java -jar FileKit.jar -size "C:\\Users\\Rohit\\Desktop\\test.txt" -mb
          java -jar FileKit.jar -size "C:\\Users\\Rohit\\Desktop" -gb
          java -jar FileKit.jar -seg "C:\\Users\\Rohit\\Downloads" "C:\\Users\\Rohit\\SortedFiles"
          java -jar FileKit.jar -rmdf "C:\\Users\\Rohit\\Folder"
          java -jar FileKit.jar -tree "C:\\Users\\Rohit\\Folder"
          java -jar FileKit.jar -mv  "C:\\Users\\rohit\\Desktop\\a.exe" "C:\\Users\\rohit\\Desktop\\Folder"
          java -jar FileKit.jar -create "file.txt" "C:\\Users\\rohit\\Desktop\\Folder"
          java -jar FileKit.jar -props "C:\\Users\\rohit\\Desktop\\Folder\\file.txt"
          java -jar FileKit.jar -squash "C:\\Users\\rohit\\Desktop\\Folder\\file.txt" "squashed"
          java -jar FileKit.jar -desquash "C:\\Users\\rohit\\Desktop\\Folder\\squashed.tar.sq"
          java -jar FileKit.jar -top 5 "C:\\Users\\rohit\\Desktop\\Folder" -mb -path
          java -jar FileKit.jar -stats "C:\\Users\\rohit\\Desktop\\Folder"
      """
    );
  }
}
