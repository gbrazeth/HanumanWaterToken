# 🔐 Environment Variables Template

Copy this file to `.env.local` and fill in your values.

```bash
# ============================================
# BLOCKCHAIN CONFIGURATION
# ============================================

# Ethereum Network RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY

# Private Key for Contract Deployment (NEVER COMMIT THIS!)
# Only needed for deploying contracts
PRIVATE_KEY=0x...
OWNER_PRIVATE_KEY=0x...

# Etherscan API Key (for contract verification)
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY

# ============================================
# WALLETCONNECT CONFIGURATION
# ============================================

# WalletConnect Project ID
# Get yours at: https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=YOUR_PROJECT_ID

# ============================================
# EMAIL CONFIGURATION (Resend)
# ============================================

# Resend API Key
# Get yours at: https://resend.com
RESEND_API_KEY=re_...

# Email sender address (must be verified in Resend)
RESEND_FROM=Hanuman Water Token <noreply@yourdomain.com>

# Test email address (for development only)
TEST_EMAIL=your-test-email@example.com

# ============================================
# SMART CONTRACT ADDRESSES
# ============================================

# HanumanWaterToken V2 Contract Address
NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS=0x...

# Presale Contract Address
NEXT_PUBLIC_PRESALE_CONTRACT_ADDRESS=0x...

# USDT Contract Address (Sepolia or Mainnet)
NEXT_PUBLIC_USDT_ADDRESS=0x...

# ============================================
# ENVIRONMENT
# ============================================

# Environment (development, production, test)
NODE_ENV=development

# ============================================
# OPTIONAL - ANALYTICS & MONITORING
# ============================================

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=G-...

# Sentry DSN (optional - for error tracking)
SENTRY_DSN=https://...

# ============================================
# SECURITY NOTES
# ============================================

# ⚠️  NEVER commit .env or .env.local to git
# ⚠️  NEVER share your PRIVATE_KEY
# ⚠️  NEVER share your API keys
# ⚠️  Use different keys for development and production
# ⚠️  Rotate keys regularly
# ⚠️  Use environment-specific values

# ============================================
# DEPLOYMENT CHECKLIST
# ============================================

# Before deploying to production:
# [ ] All environment variables set in Vercel/hosting platform
# [ ] Private keys stored securely (not in .env)
# [ ] API keys have proper rate limits
# [ ] WalletConnect allowed origins configured
# [ ] Email sender domain verified
# [ ] Contract addresses verified on Etherscan
# [ ] Test all functionality in staging first

```

## 📋 How to Use

### Development

1. Copy this template:
   ```bash
   cp ENV_TEMPLATE.md .env.local
   ```

2. Fill in your development values

3. Never commit `.env.local` to git

### Production (Vercel)

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add each variable with production values
4. Deploy

### Testing

For testing, you can use:
- Sepolia testnet
- Test email addresses
- Development WalletConnect project

## 🔒 Security Best Practices

1. **Private Keys**: Never store in `.env`, use secure key management
2. **API Keys**: Use different keys for dev/prod
3. **Rotation**: Rotate keys every 90 days
4. **Access**: Limit who has access to production keys
5. **Monitoring**: Monitor API usage for anomalies

## 📚 Resources

- [WalletConnect Cloud](https://cloud.walletconnect.com)
- [Resend Dashboard](https://resend.com/dashboard)
- [Infura Dashboard](https://infura.io/dashboard)
- [Etherscan API](https://etherscan.io/apis)
