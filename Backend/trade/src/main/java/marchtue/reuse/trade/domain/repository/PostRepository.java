package marchtue.reuse.trade.domain.repository;

import java.util.List;
import marchtue.reuse.trade.domain.model.Category;
import marchtue.reuse.trade.domain.model.Post;

public interface PostRepository {

  Post save(Post post);

  List<Post> findAll();

  List<Post> findByCategory(Category category);
}
