package marchtue.reuse.trade.exception;

import java.util.HashMap;
import java.util.Map;
import marchtue.reuse.user.global.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(BusinessException.class)
  public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex) {
    ErrorResponse errorResponse = new ErrorResponse(ex.getCode(), ex.getMessage());
    return new ResponseEntity<>(errorResponse, HttpStatusCode.valueOf(ex.getCode()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Map<String, Object> handleValidationError(MethodArgumentNotValidException ex) {
    String missingField = ex.getBindingResult()
        .getFieldErrors()
        .stream()
        .findFirst()
        .map(error -> error.getField() + " missing")
        .orElse("Invalid request");

    Map<String, Object> response = new HashMap<>();
    response.put("code", 400);
    response.put("msg", missingField);
    return response;
  }


}
