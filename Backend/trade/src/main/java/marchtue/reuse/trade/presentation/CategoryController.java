package marchtue.reuse.trade.presentation;


import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import marchtue.reuse.trade.application.dto.request.AddCategoryRequest;
import marchtue.reuse.trade.application.dto.request.PatchCategoryRequest;
import marchtue.reuse.trade.application.service.CategoryService;
import marchtue.reuse.trade.global.dto.ApiResponse;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/be/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

  private final CategoryService categoryService;

  // 카테고리등록
  @PostMapping
  public ApiResponse addCategory(
      @RequestBody AddCategoryRequest req
  ) {
    return categoryService.addCategory(req);
  }

  @GetMapping
  public ApiResponse readCategories(
  ) {
    return categoryService.readCategories();
  }

  @PatchMapping("{categoryId}")
  public ApiResponse patchCategory(
      @PathVariable UUID categoryId,
      @RequestBody PatchCategoryRequest req
  ) {
    return categoryService.patchCategory(categoryId, req);
  }

  @DeleteMapping("{categoryId}")
  public ApiResponse deleteCategory(
      @PathVariable UUID categoryId
  ) {
    return categoryService.deleteCategory(categoryId);
  }

}
