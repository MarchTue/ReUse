package marchtue.reuse.trade.global.util;

import java.text.Normalizer;
import java.util.List;
import org.apache.commons.text.similarity.LevenshteinDistance;

public class NicknameFilter {

  private static final LevenshteinDistance levenshtein = new LevenshteinDistance();
  private static final List<String> bannedWords = BannedWordLoader.getBannedWords();

  public static boolean isOffensiveNickname(String nickname, int threshold) {
    String normalized = normalize(nickname);

    for (String banned : bannedWords) {
      String normalizedBanned = normalize(banned);
      // 부분 포함 검사
      if (!normalizedBanned.isEmpty() && normalized.contains(normalizedBanned)) {
        return true;
      }
      // 너무 짧은 단어 거리 비교 제외
      if (normalizedBanned.length() < 3) {
        continue;
      }
      // 길이 차이가 너무 크면 제외
      if (Math.abs(normalized.length() - normalizedBanned.length()) > threshold) {
        continue;
      }
      // 레벤슈타인 거리 검사
      int dist = levenshtein.apply(normalized, normalizedBanned);
      if (dist <= threshold) {
        return true;
      }
    }

    return false;
  }

  private static String normalize(String input) {
    if (input == null) {
      return "";
    }
    String step1 = input.toLowerCase().replaceAll("[^a-z0-9가-힣]", "");
    String step2 = Normalizer.normalize(step1, Normalizer.Form.NFKC); // 유니코드 정규화
    return step2;
  }

}
