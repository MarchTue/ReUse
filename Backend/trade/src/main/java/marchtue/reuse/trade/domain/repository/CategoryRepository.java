package marchtue.reuse.trade.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import marchtue.reuse.trade.domain.model.Category;

public interface CategoryRepository {

  Category save(Category category);

  List<Category> findAllByIsActiveTrue();

  Category findByName(String name);

  Optional<Category> findById(UUID id);

  void delete(Category category);
}
