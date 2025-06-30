package marchtue.reuse.trade.application.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import marchtue.reuse.trade.application.dto.request.AddCategoryRequest;
import marchtue.reuse.trade.application.dto.response.AddCategoryResponse;
import marchtue.reuse.trade.domain.enums.UserRoleEnum;
import marchtue.reuse.trade.domain.model.Category;
import marchtue.reuse.trade.domain.repository.CategoryRepository;
import marchtue.reuse.trade.exception.BusinessException;
import marchtue.reuse.trade.exception.ErrorCode;
import marchtue.reuse.trade.global.dto.ApiResponse;
import marchtue.reuse.trade.global.util.JwtUtil;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryService {

  private final JwtUtil jwtUtil;
  private final CategoryRepository categoryRepository;

  public ApiResponse addCategory(AddCategoryRequest req, HttpServletRequest request) {
    UserRoleEnum role = checkUserRole(request);

    if (role == UserRoleEnum.ROLE_USER) {
      throw new BusinessException(ErrorCode.FORBIDDEN);
    }

    Category category = Category.create(req.name());
    categoryRepository.save(category);

    AddCategoryResponse response = new AddCategoryResponse(category.getId(), category.getName());

    return new ApiResponse(200, "succeeded", response);

  }


  private UserRoleEnum checkUserRole(HttpServletRequest request) {
    String token = jwtUtil.getTokenFromHeader(request, JwtUtil.AUTHORIZATION_HEADER);
    if (token == null || !jwtUtil.validateToken(token)) {
      throw new BusinessException(ErrorCode.NO_ROLE);
    }

    return jwtUtil.getUserRole(token);

  }
}
