@echo off
setlocal

set JAR=FileKit.jar

if "%~1"=="" goto help

set CMD=%~1

:: ---------------- SIZE ----------------
if /I "%CMD%"=="-size" (
    if not "%~4"=="" goto size_error
    if "%~3"=="" goto size_error


    if /I not "%~3"=="-kb" if /I not "%~3"=="-mb" if /I not "%~3"=="-gb" (
        echo [ERROR] Invalid size unit.
        echo Supported units: -kb -mb -gb
        exit /b 1
    )

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
    if not "%~3"=="" goto rmdf_error

    java -jar "%JAR%" %*
    exit /b
)

:: ---------------- TREE ----------------
if /I "%CMD%"=="-tree" (
    if not "%~3"=="" goto tree_error

    java -jar "%JAR%" %*
    exit /b
)

:: ---------------- MOVE ----------------
if /I "%CMD%"=="-mv" (
    if not "%~3"=="" if not "%~4"=="" goto mv_error
    if "%~3"=="" goto mv_error

    java -jar "%JAR%" %*
    exit /b
)

:: ---------------- CREATE ----------------
if /I "%CMD%"=="-create" (
    if not "%~3"=="" if not "%~4"=="" goto create_error
    if "%~3"=="" goto create_error

    java -jar "%JAR%" %*
    exit /b
)

echo [ERROR] Unknown command: %CMD%
goto help


:size_error
echo.
echo Usage:
echo   filekit -size ^<file-path^> ^<-kb^-mb^-gb^>
exit /b 1

:seg_error
echo.
echo Usage:
echo   filekit -seg ^<source-folder^> ^<destination-folder^>
exit /b 1

:rmdf_error
echo.
echo Usage:
echo   filekit -rmdf ^<folder^>
exit /b 1

:tree_error
echo.
echo Usage:
echo   filekit -tree ^<folder^>
exit /b 1

:mv_error
echo.
echo Usage:
echo   filekit -mv ^<source-file^> ^<destination-folder^>
exit /b 1

:create_error
echo.
echo Usage:
echo   filekit -create ^<file-name^> ^<destination-directory^>
exit /b 1

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
echo.
echo ================================================
exit /b 1