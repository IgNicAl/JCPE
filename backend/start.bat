@echo off
REM Script para iniciar o backend Spring Boot
REM Execute este arquivo para rodar o servidor backend

echo.
echo ====================================================
echo  Iniciando Backend jcpe na porta 8080
echo ====================================================
echo.

REM Ir para o diretório do backend
cd /d "%~dp0"

REM Executar Spring Boot
call mvnw.cmd spring-boot:run

pause
