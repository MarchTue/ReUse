package marchtue.reuse.trade.domain.repository;

import java.util.Optional;
import java.util.UUID;
import marchtue.reuse.trade.domain.enums.PostStateEnum;
import marchtue.reuse.trade.domain.model.Category;
import marchtue.reuse.trade.domain.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostRepository {

  Post save(Post post);

  Page<Post> findAll(Pageable pageable);

  Page<Post> findByCategory(Category category, Pageable pageable);

  Page<Post> findAllByIsDeletedFalse(Pageable pageable);

  Page<Post> findByCategoryAndIsDeletedFalse(Category category, Pageable pageable);

  Optional<Post> findById(UUID postId);

  Page<Post> findByIsDeletedFalseAndPostStateAndCreatedBy(PostStateEnum postState, UUID createdBy,
      Pageable pageable);
}
