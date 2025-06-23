package marchtue.reuse.user.global.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class BannedWordLoader {

  private static final List<String> bannedWords = loadBannedWords();

  private static List<String> loadBannedWords() {
    try (InputStream input = BannedWordLoader.class.getClassLoader()
        .getResourceAsStream("banned-words.json")) {
      if (input == null) {
        throw new RuntimeException("json file not found");
      }
      ObjectMapper mapper = new ObjectMapper();
      JsonNode root = mapper.readTree(input);
      JsonNode arrayNode = root.get("bannedWords");

      List<String> result = new ArrayList<>();
      if (arrayNode != null && arrayNode.isArray()) {
        for (JsonNode node : arrayNode) {
          result.add(node.asText());
        }
      }
      return result;
    } catch (Exception e) {
      e.printStackTrace();
      return List.of();
    }
  }

  public static List<String> getBannedWords() {
    return bannedWords;
  }
}
