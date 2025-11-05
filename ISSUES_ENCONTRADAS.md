# 🔧 Issues Encontradas e Soluções - Controllers

## 📌 Issue #1: DatabaseInitController - setRegistrationDate() Redundante

**Severidade:** 🟡 Baixa
**Arquivo:** `DatabaseInitController.java`
**Linhas:** 97, 110, 123

### Problema
```java
journalist2.setRegistrationDate(LocalDateTime.now());  // ❌ Linha 97
commonUser1.setRegistrationDate(LocalDateTime.now());  // ❌ Linha 110
commonUser2.setRegistrationDate(LocalDateTime.now());  // ❌ Linha 123
```

A entidade `User.java` possui a anotação `@CreationTimestamp` que define automaticamente a data de criação. Setar manualmente é desnecessário e inconsistente.

### Solução

**REMOVER** as 3 linhas acima e adicionar comentário:

```java
// Linha 96-97 (ANTES)
journalist2.setActive(true);
journalist2.setRegistrationDate(LocalDateTime.now());  // ❌ REMOVER
journalist2.setBiography("Jornalista de esportes e entretenimento");

// Linha 96-97 (DEPOIS)
journalist2.setActive(true);
// registrationDate é definida automaticamente pelo Hibernate (@CreationTimestamp)
journalist2.setBiography("Jornalista de esportes e entretenimento");
```

### Impacto
- ✅ Reduz redundância de código
- ✅ Mantém consistência com admin e journalist1
- ✅ Evita bugs se @CreationTimestamp mudar
- ✅ Código mais legível

---

## 📌 Issue #2: NewsController - Injeção de Dependências Inconsistente

**Severidade:** 🟡 Média (Inconsistência)
**Arquivo:** `NewsController.java`
**Linhas:** 30-34

### Problema
```java
// ❌ NewsController usa @Autowired + constructor
@Autowired
public NewsController(NewsRepository newsRepository) {
    this.newsRepository = newsRepository;
}

// Mas AuthController e UserController usam @RequiredArgsConstructor
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    // ...
}
```

### Impacto da Inconsistência
- ❌ Código inconsistente entre controllers
- ❌ Padrão antigo vs padrão moderno
- ❌ Mais verboso (3 linhas vs 1 anotação)
- ❌ Pode confundir novos desenvolvedores

### Solução

**REFATORAR para @RequiredArgsConstructor:**

```java
// ❌ ANTES
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/noticias")
public class NewsController {
  private final NewsRepository newsRepository;

  @Autowired
  public NewsController(NewsRepository newsRepository) {
    this.newsRepository = newsRepository;
  }
  // ... resto do código
}

// ✅ DEPOIS
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/noticias")
@RequiredArgsConstructor
public class NewsController {
  private final NewsRepository newsRepository;

  // Constructor removido (gerado pelo Lombok)
  // ... resto do código idêntico
}
```

### Alterações Necessárias
1. Remover import: `org.springframework.beans.factory.annotation.Autowired`
2. Adicionar na classe: `@RequiredArgsConstructor`
3. Remover o método constructor (linhas 30-34)
4. Manter o campo: `private final NewsRepository newsRepository;`

### Código Completo Refatorado
```java
package br.com.jcpe.api.controller;

import br.com.jcpe.api.domain.entity.News;
import br.com.jcpe.api.domain.entity.User;
import br.com.jcpe.api.dto.NewsRequest;
import br.com.jcpe.api.repository.NewsRepository;
import jakarta.validation.Valid;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/noticias")
@RequiredArgsConstructor
public class NewsController {

  private final NewsRepository newsRepository;

  // Resto do código permanece igual...
}
```

---

## 📌 Issue #3: DatabaseInitController Sem Proteção em Produção

**Severidade:** 🔴 ALTA (Segurança)
**Arquivo:** `DatabaseInitController.java`
**Linhas:** 20-27

### Problema
```java
@RestController
@RequestMapping("/api/init")  // ❌ Qualquer um pode acessar
@CrossOrigin(origins = "http://localhost:3000")
public class DatabaseInitController {
  // Endpoints /create-admin e /create-test-users acessíveis
}
```

### Risco de Segurança
- 🚨 Em produção, qualquer pessoa poderia criar admin duplicado
- 🚨 Usuários de teste visíveis a todos
- 🚨 Dados sensíveis expostos
- 🚨 Vetor de ataque para reconhecimento

### Solução

**Usar @ConditionalOnProperty para desabilitar em produção:**

```java
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

@RestController
@RequestMapping("/api/init")
@CrossOrigin(origins = "http://localhost:3000")
@ConditionalOnProperty(
    name = "app.init-endpoints.enabled",
    havingValue = "true",
    matchIfMissing = false
)
public class DatabaseInitController {
  // ... resto do código
}
```

**Adicionar em `application.properties` (desenvolvimento):**
```properties
# Desenvolvimento - Ativar endpoints de inicialização
app.init-endpoints.enabled=true
```

**Adicionar em `application-prod.properties` (produção):**
```properties
# Produção - Desativar endpoints de inicialização
app.init-endpoints.enabled=false
```

### Alternativa: Usar Profiles do Spring
```java
@RestController
@RequestMapping("/api/init")
@Profile("dev")  // Apenas ativo em desenvolvimento
public class DatabaseInitController {
  // ... resto do código
}
```

**Ativar perfil em desenvolvimento:**
```bash
# application.properties
spring.profiles.active=dev

# Ou via Maven
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Ou via JAR
java -jar app.jar --spring.profiles.active=dev
```

---

## 📌 Issue #4: AuthController - Sem Tratamento de Exceções

**Severidade:** 🟡 Média (UX/API)
**Arquivo:** `AuthController.java`
**Linhas:** 44-60

### Problema
```java
@PostMapping("/login")
public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    // ❌ Sem try-catch - vai lançar BadCredentialsException
    Authentication authentication =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(), loginRequest.getPassword()));
    // ... resto
}
```

Se credenciais estiverem erradas, retorna erro genérico 500 em vez de 401.

### Solução

**Adicionar tratamento de exceções:**

```java
@PostMapping("/login")
public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    try {
        Authentication authentication =
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        User userPrincipal = (User) authentication.getPrincipal();
        String jwt = jwtTokenProvider.generateToken(userPrincipal);

        return ResponseEntity.ok(
            new JwtResponse(
                jwt,
                userPrincipal.getId(),
                userPrincipal.getUsername(),
                userPrincipal.getEmail(),
                userPrincipal.getName(),
                userPrincipal.getUserType()));
    } catch (BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("error", "Credenciais inválidas"));
    } catch (UsernameNotFoundException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("error", "Usuário não encontrado"));
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("error", "Erro ao autenticar usuário"));
    }
}
```

**Adicionar imports necessários:**
```java
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
```

### Benefícios
- ✅ Respostas HTTP apropriadas (401 vs 500)
- ✅ Mensagens de erro claras
- ✅ Melhor experiência de usuário
- ✅ Segurança: Não expõe stack trace

---

## 📌 Issue #5: UserController - Ambiguidade Potencial de Rota

**Severidade:** 🟢 Baixa (Já Funcionando)
**Arquivo:** `UserController.java`
**Linhas:** 118 e 105

### Problema Potencial
```java
@GetMapping("/tipo/{tipoUser}")           // Linha 118
public ResponseEntity<List<UserResponse>> getUsersByType(...)

@GetMapping("/{id}")                      // Linha 105
public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id)
```

Poderia haver conflito se ordem fosse invertida.

### Status Atual
✅ **NÃO é um problema** - `/tipo/{tipoUser}` está DEPOIS de `/{id}`

Spring processa rotas na ordem de declaração, então:
- `GET /api/users/ADMIN` → matching com `/tipo/{tipoUser}` ✅
- `GET /api/users/550e8400-e29b-41d4-a716-446655440000` → matching com `/{id}` ✅

### Recomendação Preventiva

Para ser explícito e evitar confusão futura, mover `/tipo/{tipoUser}` ANTES de `/{id}`:

```java
// ✅ MELHOR ORDEM

@GetMapping("/tipo/{tipoUser}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<List<UserResponse>> getUsersByType(...) { ... }

@GetMapping("/stats")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<UserStats> getUserStats() { ... }

@GetMapping
@PreAuthorize("hasRole('ADMIN')")
public List<UserResponse> getAllUsers() { ... }

@GetMapping("/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<UserResponse> getUserById(...) { ... }
```

---

## 📊 Resumo de Issues

| # | Issue | Severidade | Status | Ação |
|---|-------|-----------|--------|------|
| 1 | setRegistrationDate() redundante | 🟡 Baixa | ⚠️ Não Urgente | Remover 3 linhas |
| 2 | Injeção inconsistente (NewsController) | 🟡 Média | ⚠️ Refatorar | Adicionar @RequiredArgsConstructor |
| 3 | /api/init sem proteção | 🔴 ALTA | ⚠️ CRÍTICO | Adicionar @ConditionalOnProperty |
| 4 | AuthController sem try-catch | 🟡 Média | ⚠️ UX | Adicionar tratamento de erros |
| 5 | Ambiguidade de rota (UserController) | 🟢 Nenhuma | ✅ OK | Já funciona, reordenar opcionalmente |

---

## ✅ Ordem de Prioridade para Correção

1. **CRÍTICA:** Issue #3 - Proteger /api/init em produção
2. **IMPORTANTE:** Issue #2 - Harmonizar injeção de dependências
3. **RECOMENDADO:** Issue #4 - Adicionar try-catch em login
4. **NICE-TO-HAVE:** Issue #1 - Remover setRegistrationDate()
5. **OPCIONAL:** Issue #5 - Reordenar rotas para clareza

---

## 🧪 Teste de Verificação

Após correções, execute:

```bash
cd backend

# Build limpo
.\mvnw clean compile -DskipTests

# Executar testes (se houver)
.\mvnw test

# Verificação final
.\mvnw package -DskipTests
```

Deve retornar: `BUILD SUCCESS`

---

*Gerado em: 23 de outubro de 2025*
