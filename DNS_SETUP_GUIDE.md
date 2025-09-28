# DNS Setup Guide for kisaanmela.com

## Required DNS Records

Configure these DNS records in your domain registrar's control panel:

### A Records (Point to your server IP)
```
Type    Name                Value               TTL
A       kisaanmela.com      YOUR_SERVER_IP      300
A       www                 YOUR_SERVER_IP      300
A       api                 YOUR_SERVER_IP      300
```

### CNAME Records (Optional but recommended)
```
Type    Name                Value               TTL
CNAME   admin               kisaanmela.com      300
CNAME   app                 kisaanmela.com      300
```

## Popular Domain Registrars Setup

### GoDaddy
1. Login to GoDaddy account
2. Go to "My Products" → "DNS"
3. Click "Manage" next to your domain
4. Add the A records above
5. Save changes (propagation: 1-48 hours)

### Namecheap
1. Login to Namecheap account
2. Go to "Domain List" → "Manage"
3. Click "Advanced DNS" tab
4. Add the A records above
5. Save changes (propagation: 30 minutes - 48 hours)

### Cloudflare (Recommended for CDN)
1. Login to Cloudflare
2. Add your domain
3. Update nameservers at your registrar
4. Add the A records above
5. Enable "Proxy status" for CDN benefits

### Route 53 (AWS)
1. Create hosted zone for your domain
2. Add the A records above
3. Update nameservers at your registrar
4. Records propagate within minutes

## Verification Commands

After setting up DNS, verify with these commands:

### Check A Records
```bash
# Check main domain
dig kisaanmela.com A

# Check www subdomain
dig www.kisaanmela.com A

# Check API subdomain
dig api.kisaanmela.com A
```

### Check from multiple locations
```bash
# Use online tools:
# https://www.whatsmydns.net/
# https://dnschecker.org/
```

### Expected Output
```
kisaanmela.com.     300    IN    A    YOUR_SERVER_IP
www.kisaanmela.com. 300    IN    A    YOUR_SERVER_IP
api.kisaanmela.com. 300    IN    A    YOUR_SERVER_IP
```

## Troubleshooting

### DNS Not Propagating
- Wait 24-48 hours for full propagation
- Clear your local DNS cache:
  ```bash
  # Windows
  ipconfig /flushdns
  
  # macOS
  sudo dscacheutil -flushcache
  
  # Linux
  sudo systemctl restart systemd-resolved
  ```

### Wrong IP Address
- Double-check the A record values
- Ensure you're using the correct server IP
- Verify server is accessible: `ping YOUR_SERVER_IP`

### Subdomain Issues
- Ensure API subdomain points to same IP
- Check if wildcard record exists (*.kisaanmela.com)
- Verify nginx configuration handles subdomains

## Security Considerations

### Enable DNSSEC (if supported)
- Protects against DNS spoofing
- Available on most modern registrars
- Enable in your DNS provider's settings

### Use Cloudflare for Additional Security
- DDoS protection
- Web Application Firewall (WAF)
- SSL/TLS encryption
- CDN for faster loading

## Mobile App Configuration

After DNS is configured, update your mobile app:

### iOS App Store Connect
- Update server URLs in app configuration
- Submit new build for review
- Update app description with new domain

### Google Play Console
- Update server URLs in app configuration
- Upload new APK/AAB
- Update app listing with new domain

### Expo Configuration
```javascript
// mobile/app.json
{
  "expo": {
    "extra": {
      "apiUrl": "https://api.kisaanmela.com/api",
      "webUrl": "https://kisaanmela.com"
    }
  }
}
```

## Final Verification Checklist

- [ ] kisaanmela.com resolves to server IP
- [ ] www.kisaanmela.com resolves to server IP  
- [ ] api.kisaanmela.com resolves to server IP
- [ ] DNS propagation complete (check multiple locations)
- [ ] Server is accessible via SSH
- [ ] Firewall allows ports 80, 443, 22
- [ ] Domain registrar nameservers updated (if using external DNS)

Once all DNS records are propagating correctly, you can proceed with the deployment!
