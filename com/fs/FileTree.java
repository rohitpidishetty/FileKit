package com.fs;

import com.javap.util.Json;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class FileTree {

  @SuppressWarnings({ "unchecked" })
  private void printTree(
    File file,
    String prefix,
    boolean isLast,
    Map<String, Object> jsonFileTree
  ) {
    System.out.println(prefix + (isLast ? "└─ " : "├─ ") + file.getName());
    if (file.isFile()) {
      jsonFileTree.put("file", file.getName());
    }

    if (!file.isDirectory()) return;

    File[] files = file.listFiles();
    if (files == null || files.length == 0) return;

    for (int i = 0; i < files.length; i++) {
      Map<String, Object> subRef = new HashMap<>();
      if (files[i].isDirectory()) {
        jsonFileTree.putIfAbsent(files[i].getName(), subRef);
      } else {
        jsonFileTree.putIfAbsent(".files", new ArrayList<>());
        ((List<String>) jsonFileTree.get(".files")).add(
          files[i].getName().toString()
        );
      }
      printTree(
        files[i],
        prefix + (isLast ? "  " : "│ "),
        (i == files.length - 1),
        subRef
      );
    }
  }

  protected void view(String path, boolean generateJson) {
    File file = new File(path);
    Map<String, Object> jsonFileTree = new HashMap<>();

    if (!file.exists()) {
      System.out.println("[ERROR] File Not Found.");
      System.exit(1);
    }
    this.printTree(file, "", false, jsonFileTree);
    if (generateJson) {
      new Json()
        .build("file-tree", jsonFileTree)
        .normalize(json -> {
          JsonWriter.writeToJsonFile(
            file.getName() + "-tree-report-" + UUID.randomUUID().toString(),
            json
          );
        });
    }
  }
}
