# Auto Commit and Push Script
# Run this with Task Scheduler for automatic commits

$repoPath = "c:\Users\wijnho00\.cursor\apps\flashycards"

# Change to repository directory
Set-Location $repoPath

# Check if there are changes
$status = git status --porcelain

if ($status) {
    Write-Host "Changes detected. Committing and pushing..."
    
    # Get current timestamp
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    # Add all changes
    git add .
    
    # Commit with timestamp
    git commit -m "Auto-commit: $timestamp"
    
    # Push to GitHub
    $pushResult = git push 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully pushed changes to GitHub!"
    } else {
        Write-Host "Error pushing to GitHub: $pushResult"
    }
} else {
    Write-Host "No changes to commit."
}

