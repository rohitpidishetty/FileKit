@echo off
setlocal

set JAR=FileKit.jar

if "%~1"=="" goto help

set CMD=%~1

:: ---------------- SIZE ----------------
if /I "%CMD%"=="-size" (
    java -jar "%JAR%" %*
    exit /b
)

:: ---------------- SEG ----------------
if /I "%CMD%"=="-seg" (
    if not "%~3"=="" if not "%~4"=="" goto seg_error
    if "%~3"=="" goto seg_error

    java -jar "%JAR%" %*
    exit /b
)

:: ---------------- RMDF ----------------
if /I "%CMD%"=="-rmdf" (
    if not "%~3"=="" goto help

    java -jar "%JAR%" %*
    exit /b
)

:: ---------------- TREE ----------------
if /I "%CMD%"=="-tree" (
    java -jar "%JAR%" %*
    exit /b
)

:: ---------------- MOVE ----------------
if /I "%CMD%"=="-mv" (
    if not "%~3"=="" if not "%~4"=="" goto help
    if "%~3"=="" goto help

    java -jar "%JAR%" %*
    exit /b
)

:: ---------------- CREATE ----------------
if /I "%CMD%"=="-create" (
    if not "%~3"=="" if not "%~4"=="" goto help
    if "%~3"=="" goto help

    java -jar "%JAR%" %*
    exit /b
)

:: ---------------- CREATE ----------------
if /I "%CMD%"=="-props" (
    if "%~2"=="" goto help

    java -jar "%JAR%" %*
    exit /b
)

:: ---------------- SQUASH ----------------
if /I "%CMD%"=="-squash" (
    if "%~2"=="" goto help
    if "%~3"=="" goto help

    java -jar "%JAR%" %*
    exit /b
)


:: ---------------- DESQUASH ----------------
if /I "%CMD%"=="-desquash" (
    if "%~2"=="" goto help

    java -jar "%JAR%" %*
    exit /b
)

:: ---------------- TOP ----------------
if /I "%CMD%"=="-top" (
    java -jar "%JAR%" %*
    exit /b
)

:: ---------------- STATS ----------------
if /I "%CMD%"=="-stats" (
    java -jar "%JAR%" %*
    exit /b
)

echo [ERROR] Unknown command: %CMD%
goto help




:help
echo.
echo ===================== FileKit =====================
echo.
echo Usage:
echo.
echo   ./filekit -size   ^<file-path^> ^<-kb^-mb^-gb^>
echo   ./filekit -seg    ^<source-folder^> ^<destination-folder^>
echo   ./filekit -rmdf   ^<folder^>
echo   ./filekit -tree   ^<folder^>
echo   ./filekit -mv     ^<source-file^> ^<destination-folder^>
echo   ./filekit -create ^<file-name^> ^<destination-directory^>
echo   ./filekit -props  ^<file-path^>
echo   ./filekit -top    ^<number> ^<file-path^> ^<-kb^-mb^-gb^> -path
echo   ./filekit -stats  ^<file-path^>
echo.
echo ================================================
exit /b 1