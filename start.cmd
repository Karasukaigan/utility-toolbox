@echo off
tasklist /FI "IMAGENAME eq start.cmd" 2>NUL | find /I /N "start.cmd">NUL
if "%ERRORLEVEL%"=="0" (
    setlocal enabledelayedexpansion
    for /f "usebackq delims== tokens=1,2" %%i in (".env") do (
        if "%%i"=="PORT" (
            set "port=%%j"
        )
    )
    endlocal && set "port=%port%"
    start "" http://127.0.0.1:%port%/
    exit
)
call utility-tools-env\Scripts\activate
setlocal enabledelayedexpansion
for /f "usebackq delims== tokens=1,2" %%i in (".env") do (
    if "%%i"=="PORT" (
        set "port=%%j"
    )
)
endlocal && set "port=%port%"
start "" http://127.0.0.1:%port%/
ping -n 1 127.0.0.1 > nul
node .\server.js