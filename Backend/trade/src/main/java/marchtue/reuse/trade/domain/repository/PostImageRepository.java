package marchtue.reuse.trade.domain.repository;

import java.util.List;
import java.util.UUID;
import marchtue.reuse.trade.domain.model.PostImage;

public interface PostImageRepository {

  List<PostImage> findAllByPostId(UUID postId);
}
