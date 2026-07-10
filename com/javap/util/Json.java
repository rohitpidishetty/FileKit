package com.javap.util;

import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Json {

  public interface jsonify {
    void read(String jsonified);
  }

  public interface objectify {
    Map<String, Object> read(Map<String, Object> jsonified);
  }

  private Map<String, Object> classFields;

  public Json() {
    this.classFields = new HashMap<>();
  }

  public Json build(String attribute, Object value) {
    this.classFields.put(attribute, value);
    return this;
  }

  private String stringify(String key) {
    return '\"' + key + '\"';
  }

  private String recursive(Object value) {
    StringBuilder sb = new StringBuilder();
    if (value == null) return "null";
    else if (value instanceof Boolean) return value.toString();
    else if (
      value instanceof Integer ||
      value instanceof Float ||
      value instanceof Double
    ) return value.toString();
    else if (value instanceof String) return stringify((String) value);
    else if (value.getClass().isArray()) {
      sb.append("[");
      int len = Array.getLength(value);
      for (int i = 0; i < len; i++) {
        Object item = Array.get(value, i);
        sb.append(item == null ? "null" : recursive(item));
        if (i != len - 1) sb.append(",");
      }
      sb.append("]");
    } else if (value instanceof List<?>) {
      sb.append("[");
      List<?> list = (List<?>) value;
      for (int i = 0; i < list.size(); i++) {
        Object item = list.get(i);
        sb.append(item == null ? "null" : recursive(item));
        if (i != list.size() - 1) sb.append(",");
      }
      sb.append("]");
    } else if (value instanceof HashMap<?, ?>) {
      sb.append("{");
      for (Map.Entry<?, ?> entry : ((HashMap<?, ?>) value).entrySet()) {
        sb
          .append(stringify((String) entry.getKey()))
          .append(":")
          .append(recursive(entry.getValue()))
          .append(",");
      }
      if (sb.charAt(sb.length() - 1) == ',') sb.deleteCharAt(sb.length() - 1);
      sb.append("}");
    } else {
      Field classFields[] = value.getClass().getFields();
      sb.append("{");
      try {
        for (Field field : classFields) {
          field.setAccessible(true);
          sb
            .append(stringify((String) field.getName()))
            .append(":")
            .append(recursive(field.get(value)))
            .append(",");
        }
      } catch (Exception e) {}
      if (sb.charAt(sb.length() - 1) == ',') sb.deleteCharAt(sb.length() - 1);
      sb.append("}");
    }
    return sb.toString();
  }

  private String json() {
    StringBuilder sb = new StringBuilder();
    sb.append("{");
    for (Map.Entry<String, Object> entries : this.classFields.entrySet()) {
      String key = stringify(entries.getKey());
      sb.append(key).append(":");
      Object value = entries.getValue();
      if (value instanceof String) {
        sb.append(stringify((String) value)).append(",");
      } else {
        sb.append(recursive(value)).append(",");
      }
    }
    if (sb.charAt(sb.length() - 1) == ',') sb.deleteCharAt(sb.length() - 1);
    sb.append("}");
    return sb.toString();
  }

  public Json normalize(jsonify obj) {
    obj.read(this.json());
    return this;
  }

  public Map<String, Object> objectify(objectify obj) {
    return obj.read(classFields);
  }
}
