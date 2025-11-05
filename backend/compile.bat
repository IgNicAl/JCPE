@echo off
REM Script para recompilar o backend Spring Boot
REM Execute este arquivo para recompilar o projeto

echo.
echo ====================================================
echo  Compilando Backend jcpe com Maven Wrapper
echo ====================================================
echo.

REM Ir para o diretório do backend
cd /d "%~dp0"

REM Limpar e compilar
echo Iniciando build...
call mvnw.cmd clean package -DskipTests

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================================
    echo Build concluido com sucesso!
    echo.
    echo Agora execute: mvnw.cmd spring-boot:run
    echo Ou inicie manualmente a aplicacao Spring Boot
    echo ====================================================
) else (
    echo.
    echo ====================================================
    echo ERRO durante o build!
    echo Verifique se Java esta instalado corretamente
    echo ====================================================
)

pause
