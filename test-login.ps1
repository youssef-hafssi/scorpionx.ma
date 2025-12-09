# Test New Admin Login System

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Testing New Admin Login System" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

# Test credentials
$email = "admin@scorpion.ma"
$password = "hafssi123"

Write-Host "📧 Email: $email" -ForegroundColor Yellow
Write-Host "🔑 Password: $password`n" -ForegroundColor Yellow

# Test login endpoint
Write-Host "Testing login endpoint..." -ForegroundColor White

$body = @{
    email = $email
    password = $password
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -UseBasicParsing
    
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "Response: $($response.Content)`n" -ForegroundColor Gray
    
    # Extract cookie
    $cookie = $response.Headers['Set-Cookie']
    if ($cookie) {
        Write-Host "✅ Cookie set: admin-token" -ForegroundColor Green
    }
    
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "  🎉 Login System Working!" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    Write-Host "Next steps:" -ForegroundColor White
    Write-Host "1. Open: http://localhost:3000/admin/login" -ForegroundColor Gray
    Write-Host "2. Login with the credentials above" -ForegroundColor Gray
    Write-Host "3. You should be redirected to /admin/orders`n" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Login failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)`n" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody`n" -ForegroundColor Gray
    }
    
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Make sure dev server is running (npm run dev)" -ForegroundColor Gray
    Write-Host "2. Check .env.local has the correct credentials" -ForegroundColor Gray
    Write-Host "3. Restart dev server if you just made changes`n" -ForegroundColor Gray
}
