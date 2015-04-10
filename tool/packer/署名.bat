@echo off
setlocal

if "%~1"=="" goto HELP


set PRIV="%~dp0private_key.txt"
set SIGN="%~dp0krkrsign"


:REPEAT
	if exist "%~f1\" (
		for /R "%~f1" %%I in (*) do %SIGN% -sign "%%I" %PRIV%
	) else if exist "%~f1" (
		%SIGN% -sign "%~f1" %PRIV%
	)

	if "%~2"=="" goto END
	shift
goto REPEAT


:HELP
	echo 署名を付けるファイルを指定してください。


:END
	endlocal

