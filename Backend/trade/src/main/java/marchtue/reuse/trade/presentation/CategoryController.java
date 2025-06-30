package marchtue.reuse.trade.presentation;


import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import marchtue.reuse.trade.application.dto.request.AddCategoryRequest;
import marchtue.reuse.trade.application.service.CategoryService;
import marchtue.reuse.trade.global.dto.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

  private final CategoryService categoryService;

  // 카테고리등록
  @PostMapping
  public ApiResponse addCategory(
      @RequestBody AddCategoryRequest req,
      HttpServletRequest request
  ) {
    return categoryService.addCategory(req, request);
  }

}
