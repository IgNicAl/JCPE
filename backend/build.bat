@echo off
cd /d "%~dp0"
mvnw.cmd clean package -DskipTests
pause
