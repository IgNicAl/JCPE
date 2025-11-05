# 🛠️ Guia Prático de Correção - Controllers

## Quick Reference

```
┌─────────────────────────────────────────────┐
│  3 CORREÇÕES RECOMENDADAS (Prioridade)      │
├─────────────────────────────────────────────┤
│ 1. ⭐ Issue #3: Proteger /api/init          │
│    → Adicionar @ConditionalOnProperty        │
│    ⏱️  2 minutos                             │
│                                              │
│ 2. ⭐ Issue #2: Refatorar NewsController    │
│    → Use @RequiredArgsConstructor             │
│    ⏱️  3 minutos                             │
│                                              │
│ 3. ⭐ Issue #4: Try-catch em login          │
│    → Adicionar tratamento de erros           │
│    ⏱️  5 minutos                             │
│                                              │
│ TOTAL: ~10 minutos para 3 correcções        │
└─────────────────────────────────────────────┘
```

---

## ✅ Correção #1: Proteger /api/init em Produção

**Tempo:** 3 minutos
**Arquivo:** `DatabaseInitController.java`

### Passo 1: Adicionar anotação na classe
```java
// PROCURAR ESTA LINHA (linha ~20):
@RestController
@RequestMapping("/api/init")
@CrossOrigin(origins = "http://localhost:3000")
public class DatabaseInitController {

// ADICIONAR APÓS @CrossOrigin:
@RestController
@RequestMapping("/api/init")
@CrossOrigin(origins = "http://localhost:3000")
@ConditionalOnProperty(
    name = "app.init-endpoints.enabled",
    havingValue = "true",
    matchIfMissing = false
)
public class DatabaseInitController {
```

### Passo 2: Adicionar import
```java
// Adicionar no topo do arquivo:
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
```

### Passo 3: Criar properties

**Em `src/main/resources/application.properties`:**
```properties
# DESENVOLVIMENTO - Ativar endpoints de inicialização
app.init-endpoints.enabled=true
```

**Em `src/main/resources/application-prod.properties`:**
```properties
# PRODUÇÃO - Desativar endpoints de inicialização
app.init-endpoints.enabled=false
```

### Verificação
```bash
# Teste desenvolvimento (deve funcionar)
cd backend
.\mvnw spring-boot:run

# Teste produção (deve desabilitar)
.\mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"
```

---

## ✅ Correção #2: Refatorar NewsController

**Tempo:** 3 minutos
**Arquivo:** `NewsController.java`

### Passo 1: Adicionar @RequiredArgsConstructor
```java
// PROCURAR (linha ~28):
@RestController
@RequestMapping("/api/noticias")
public class NewsController {

// MODIFICAR PARA:
@RestController
@RequestMapping("/api/noticias")
@RequiredArgsConstructor
public class NewsController {
```

### Passo 2: Remover método constructor
```java
// REMOVER ESTAS LINHAS (linha 30-34):
@Autowired
public NewsController(NewsRepository newsRepository) {
  this.newsRepository = newsRepository;
}

// O Lombok vai gerar automaticamente
```

### Passo 3: Remover import desnecessário
```java
// REMOVER ESTA LINHA:
import org.springframework.beans.factory.annotation.Autowired;

// Deve estar presente (verificar):
import lombok.RequiredArgsConstructor;
```

### Resultado Final
```java
@RestController
@RequestMapping("/api/noticias")
@RequiredArgsConstructor
public class NewsController {

  private final NewsRepository newsRepository;

  private String generateSlug(String title) {
    // ... resto do código igual
  }

  // Todos os métodos idênticos
}
```

### Verificação
```bash
cd backend
.\mvnw clean compile -DskipTests
# Deve compilar sem erros
```

---

## ✅ Correção #3: Adicionar Try-Catch em Login

**Tempo:** 5 minutos
**Arquivo:** `AuthController.java`

### Passo 1: Modificar assinatura do método
```java
// ANTES (linha 42):
public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest)

// DEPOIS:
public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest)
```

### Passo 2: Envolver em try-catch
```java
// ANTES:
@PostMapping("/login")
public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
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
}

// DEPOIS:
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

### Passo 3: Adicionar imports
```java
// Adicionar estes imports no topo:
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
```

### Teste Manual
```bash
# 1. Iniciar backend
cd backend
.\mvnw spring-boot:run

# 2. Em outro terminal, testar login com credenciais erradas:
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"errado"}'

# Deve retornar 401 com mensagem "Credenciais inválidas"

# 3. Testar com credenciais corretas:
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admcesar"}'

# Deve retornar 200 com JWT token
```

---

## 📋 Correções Opcionais (Nice-to-Have)

### Opcional: Remover setRegistrationDate() redundante

**Arquivo:** `DatabaseInitController.java`
**Tempo:** 2 minutos

```java
// PROCURAR ESTAS 3 LINHAS:

// Linha ~97
journalist2.setRegistrationDate(LocalDateTime.now());

// Linha ~110
commonUser1.setRegistrationDate(LocalDateTime.now());

// Linha ~123
commonUser2.setRegistrationDate(LocalDateTime.now());

// REMOVER TODAS AS 3
// Adicionar comentário acima se quiser explicar:
// registrationDate é definida automaticamente pelo Hibernate (@CreationTimestamp)
```

---

## 🧪 Checklist de Teste Completo

Após fazer as 3 correções principais:

```bash
# 1. Compilar
cd backend
.\mvnw clean compile -DskipTests
# ✅ BUILD SUCCESS

# 2. Testar build completo
.\mvnw package -DskipTests
# ✅ BUILD SUCCESS

# 3. Executar em desenvolvimento
.\mvnw spring-boot:run
# ✅ Deve iniciar sem erros

# 4. Testar login (em outro terminal)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admcesar"}' | jq .

# ✅ Deve retornar JWT válido

# 5. Testar erro de credenciais
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"errado"}' | jq .

# ✅ Deve retornar 401 com mensagem clara

# 6. Testar /api/init em dev
curl -X POST http://localhost:8080/api/init/create-admin | jq .
# ✅ Deve retornar sucesso ou "Administrador já existe"

# 7. Testar /api/init em prod (deve falhar)
.\mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod" &
sleep 5
curl -X POST http://localhost:8080/api/init/create-admin
# ✅ Deve retornar 404 (Not Found)
```

---

## 🚀 Script Automatizado (PowerShell)

Se preferir, execute este script para testar tudo:

```powershell
# Salvar como: test-controllers.ps1

Write-Host "🧪 Iniciando testes dos controllers..." -ForegroundColor Green

# 1. Build
Write-Host "`n1️⃣  Compilando backend..." -ForegroundColor Cyan
cd backend
.\mvnw clean compile -DskipTests -q
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build sucesso" -ForegroundColor Green
} else {
    Write-Host "❌ Build falhou" -ForegroundColor Red
    exit 1
}

# 2. Package
Write-Host "`n2️⃣  Criando JAR..." -ForegroundColor Cyan
.\mvnw package -DskipTests -q
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Package sucesso" -ForegroundColor Green
} else {
    Write-Host "❌ Package falhou" -ForegroundColor Red
    exit 1
}

# 3. Teste de APIs
Write-Host "`n3️⃣  Testando APIs..." -ForegroundColor Cyan
Write-Host "  - AuthController login: " -NoNewline
$response = curl -s -X POST http://localhost:8080/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"admcesar"}'
if ($response -match '"token"') {
    Write-Host "✅" -ForegroundColor Green
} else {
    Write-Host "⚠️ (Backend pode não estar rodando)" -ForegroundColor Yellow
}

Write-Host "`n✅ Testes concluídos!" -ForegroundColor Green
Write-Host "Para iniciar o backend: .\mvnw spring-boot:run" -ForegroundColor Yellow
```

**Executar:**
```powershell
.\test-controllers.ps1
```

---

## 📞 Suporte Rápido

Se algo der errado:

1. **Build falha?**
   ```bash
   .\mvnw clean install -U
   ```

2. **Código não compila após mudanças?**
   ```bash
   .\mvnw clean compile -X  # -X para debug
   ```

3. **Revert de mudanças?**
   ```bash
   git checkout backend/src/main/java/br/com/jcpe/api/controller/
   ```

---

**🎉 Prontinho! Siga o guia e as correções estarão prontas em ~15 minutos.**
