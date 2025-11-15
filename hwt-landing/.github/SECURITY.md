# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within the HanumanWaterToken project, please send an email to security@hanumanwater.com. All security vulnerabilities will be promptly addressed.

### What to include in your report:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Suggested fix (if available)

### Response Timeline:

- **Acknowledgment**: Within 24 hours
- **Initial Assessment**: Within 48 hours  
- **Status Update**: Weekly until resolved
- **Resolution**: Target within 30 days for critical issues

## Security Measures

### Automated Security Checks

This project includes automated security monitoring:

- **Dependabot**: Automatic dependency updates
- **npm audit**: Regular vulnerability scanning
- **Security scripts**: Manual security checks

### Running Security Checks

```bash
# Run comprehensive security check
npm run security:check

# Check for vulnerabilities only
npm run security:audit

# Check for outdated dependencies
npm run deps:check

# Update dependencies safely
npm run deps:update
```

### Security Best Practices

1. **Dependencies**: Keep all dependencies up to date
2. **Environment Variables**: Never commit sensitive data
3. **Access Control**: Use principle of least privilege
4. **Code Review**: All changes require review
5. **Monitoring**: Regular security audits

## Known Issues

### Current Vulnerabilities

- **js-yaml < 4.1.1**: Prototype pollution (Moderate)
- **tmp <= 0.2.3**: Arbitrary file write (Moderate) - No fix available
- **@walletconnect/***: Various security issues (High) - Updates in progress

### Mitigation Strategies

1. **js-yaml**: Update to >= 4.1.1 when dependencies allow
2. **tmp**: Monitor for fixes, consider alternatives
3. **@walletconnect**: Regular updates, monitor security advisories

## Contact

For security-related questions or concerns:
- Email: security@hanumanwater.com
- GitHub: Create a private security advisory

---

*Last updated: November 2025*
