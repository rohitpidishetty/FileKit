package com.squash;

import java.util.ArrayList;
import java.util.List;

public class LZ77 {

  private static final int WINDOW_SIZE = 32;
  private static final int LOOKAHEAD_SIZE = 16;

  static class Token {

    private final int distance;
    private final int length;
    private final Character nextCharacter;

    Token(int distance, int length, Character nextCharacter) {
      this.distance = distance;
      this.length = length;
      this.nextCharacter = nextCharacter;
    }

    @Override
    public String toString() {
      String next = nextCharacter == null ? "EOF" : "'" + nextCharacter + "'";

      return "(" + distance + ", " + length + ", " + next + ")";
    }
  }

  public static List<Token> compress(String input) {
    List<Token> tokens = new ArrayList<>();
    int position = 0;
    int n = input.length();

    while (position < n) {
      System.out.println(position);
      int bestDistance = 0;
      int bestLength = 0;

      // (dist, len, char)

      int windowStart = Math.max(0, position - WINDOW_SIZE);
      int maximumMatchLength = Math.min(LOOKAHEAD_SIZE, n - position);

      // System.out.println("| " + windowStart + " " + maximumMatchLength + " |");
      int matchStart = windowStart;
      while (matchStart < position) {
        // System.out.println("\t" + matchStart);
        int distance = position - matchStart;
        // System.out.println("\t\t" + distance);
        int length = 0;
        while (length < maximumMatchLength) {
          if (
            input.charAt(matchStart + (length % distance)) !=
            input.charAt(position + length)
          ) break;
          length++;
        }

        if (length > bestLength) {
          bestLength = length;
          bestDistance = distance;
        }

        matchStart++;
      }

      Character nextCharacter = null;
      int nextPosition = position + bestLength;

      if (nextPosition < input.length()) nextCharacter = input.charAt(
        nextPosition
      );

      tokens.add(new Token(bestDistance, bestLength, nextCharacter));

      position += bestLength;

      if (nextCharacter != null) position++;

      // position++;
    }

    return tokens;
  }

  public static String decompress(List<Token> tokens) {
    StringBuilder output = new StringBuilder();

    for (Token token : tokens) {
      if (token.distance > 0) {
        int start = output.length() - token.distance;

        if (start < 0) {
          throw new IllegalArgumentException(
            "Invalid LZ77 token: distance exceeds output size"
          );
        }

        for (int i = 0; i < token.length; i++) {
          output.append(output.charAt(start + i));
        }
      }

      if (token.nextCharacter != null) {
        output.append(token.nextCharacter);
      }
    }

    return output.toString();
  }

  public static void main(String[] args) {
    String input = "abcdabcfgab";

    List<Token> compressed = compress(input);

    System.out.println("Original: " + input);
    System.out.println("\nCompressed tokens:");

    for (Token token : compressed) {
      System.out.println(token);
    }

    String decompressed = decompress(compressed);

    System.out.println("\nDecompressed: " + decompressed);
    System.out.println("Successful: " + input.equals(decompressed));
  }
}
