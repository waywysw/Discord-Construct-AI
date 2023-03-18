@echo off

REM Set the console window size to 80 columns by 25 lines
mode con lines=25

echo ===========================================
echo S E T T I N G   U P   E N V I R O N M E N T
echo ===========================================

git pull
rem Check if python is installed
where python
if %errorlevel% neq 0 (
    echo Python is not installed on this computer. Please install Python and run this script again.
    pause
    exit /b
)

rem Check if virtualenv is installed
pip show virtualenv
if %errorlevel% neq 0 (
    echo virtualenv is not installed on this computer. Installing virtualenv...
    pip install virtualenv
)

rem Create the virtual environment
virtualenv venv

rem Activate the virtual environment
call venv\Scripts\activate

rem Install the required packages
pip install -r requirements.txt
rem clear console
cls
pause