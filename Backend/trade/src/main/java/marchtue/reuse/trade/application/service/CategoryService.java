package marchtue.reuse.trade.application.service;

import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import marchtue.reuse.trade.application.dto.request.AddCategoryRequest;
import marchtue.reuse.trade.application.dto.request.PatchCategoryRequest;
import marchtue.reuse.trade.application.dto.response.AddCategoryResponse;
import marchtue.reuse.trade.application.dto.response.CategoryListResponse;
import marchtue.reuse.trade.domain.enums.UserRoleEnum;
import marchtue.reuse.trade.domain.model.Category;
import marchtue.reuse.trade.domain.repository.CategoryRepository;
import marchtue.reuse.trade.exception.BusinessException;
import marchtue.reuse.trade.exception.ErrorCode;
import marchtue.reuse.trade.global.dto.ApiResponse;
import marchtue.reuse.trade.global.util.JwtUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryService {
  
  private final CategoryRepository categoryRepository;

  public ApiResponse addCategory(AddCategoryRequest req) {
    UserRoleEnum role = checkUserRole();
    isAdminCheck(role);

    // 중복확인
    if (findByName(req.name()) != null) {
      throw new BusinessException(ErrorCode.Duplicated);
    }

    Category category = Category.create(req.name());
    categoryRepository.save(category);

    AddCategoryResponse response = new AddCategoryResponse(category.getId(), category.getName());

    return ApiResponse.ok(response);

  }

  // 카테고리 목록 조회
  public ApiResponse readCategories() {
    List<Category> categories = categoryRepository.findAllByIsActiveTrue();

    List<CategoryListResponse> response = categories.stream()
        .map(cate -> new CategoryListResponse(cate.getId(), cate.getName()))
        .toList();

    return ApiResponse.ok(response);
  }


  // 카테고리 수정
  public ApiResponse patchCategory(UUID categoryId, PatchCategoryRequest req) {
    UserRoleEnum role = checkUserRole();
    isAdminCheck(role);

    Category category = findById(categoryId);
    if (findByName(req.name()) != null) {
      throw new BusinessException(ErrorCode.Duplicated);
    }
    Category updatedCategory = category.update(req.name(), req.isActive());
    categoryRepository.save(updatedCategory);

    return ApiResponse.ok();

  }

  // 카테고리 삭제
  public ApiResponse deleteCategory(UUID categoryId) {
    UserRoleEnum role = checkUserRole();
    isAdminCheck(role);

    Category category = findById(categoryId);
    categoryRepository.delete(category);

    return ApiResponse.ok();

  }

  private UserRoleEnum checkUserRole() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated()) {
      throw new BusinessException(ErrorCode.NO_ROLE);
    }

    return auth.getAuthorities().stream()
        .findFirst()
        .map(authority -> UserRoleEnum.valueOf(authority.getAuthority()))
        .orElseThrow(() -> new BusinessException(ErrorCode.NO_ROLE));
  }

  private boolean isAdminCheck(UserRoleEnum role) {
    if (role == UserRoleEnum.ROLE_USER) {
      throw new BusinessException(ErrorCode.FORBIDDEN);
    }
    return false;
  }

  private Category findByName(String name) {
    return categoryRepository.findByName(name);
  }

  public Category findById(UUID id) {
    return categoryRepository.findById(id)
        .orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND));
  }


}
