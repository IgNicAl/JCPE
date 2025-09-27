package br.com.jcpm.api.errors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class ExceptionHandlerController {

    /**
     * Captura erros de validação dos DTOs (ex: @NotBlank, @Email).
     * Retorna uma lista de campos com seus respectivos erros.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    /**
     * Captura erros de violação de integridade do banco de dados.
     * Principalmente para campos únicos (unique = true) como username e email.
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        Map<String, String> error = new HashMap<>();
        // Mensagem genérica para não expor detalhes do banco
        if (ex.getMostSpecificCause().getMessage().contains("Duplicate entry")) {
            if (ex.getMostSpecificCause().getMessage().toLowerCase().contains("email")) {
                error.put("message", "Este e-mail já está em uso.");
            } else if (ex.getMostSpecificCause().getMessage().toLowerCase().contains("username")) {
                error.put("message", "Este name de usuário já está em uso.");
            } else {
                error.put("message", "Já existe um registro com um dos campos informados.");
            }
        } else {
            error.put("message", "Erro de integridade de dados.");
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error); // 409 Conflict é mais apropriado aqui
    }

    /**
     * Captura exceções de negócio personalizadas, como "Usuário já existe".
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalStateException(IllegalStateException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
