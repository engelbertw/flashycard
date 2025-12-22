@echo off
cd /d "c:\Users\wijnho00\.cursor\apps\flashycards"
echo Checking for changes...
git add .
git commit -m "Quick save: %date% %time%"
if %errorlevel% equ 0 (
    echo Pushing to GitHub...
    git push
    echo Done!
) else (
    echo No changes to commit.
)
pause

