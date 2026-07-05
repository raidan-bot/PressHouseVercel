# Security Policy

## 🔒 Security Measures

### Environment Variables

- All secrets stored in `.env` (never committed)
- Use `.env.example` for documentation
- Rotate secrets regularly

### API Security

- JWT authentication
- Rate limiting
- CORS protection
- Helmet.js headers

### Database

- Use connection pooling
- Parameterized queries
- Regular backups

## 🚨 Reporting Vulnerabilities

If you discover a security vulnerability, please:

1. **DO NOT** open a public issue
2. Email: security@ph-ye.org
3. Include detailed description
4. Allow 48 hours for response

## 🛡️ Best Practices

### For Developers

- Never commit secrets
- Use strong passwords
- Enable 2FA
- Regular dependency updates

### For Admins

- Monitor access logs
- Regular security audits
- Backup data frequently
- Keep software updated

## 📞 Contact

- Security: security@ph-ye.org
- General: support@ph-ye.org
