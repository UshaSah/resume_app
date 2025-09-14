# GitHub Actions Deployment Setup

This guide explains how to set up automatic deployment to EC2 using GitHub Actions.

## Prerequisites

1. ✅ EC2 instance running with your application
2. ✅ SSH key pair for EC2 access
3. ✅ GitHub repository with your code

## Setup GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

### 1. EC2_HOST
- **Value:** `54.221.116.49` (your EC2 public IP)
- **Description:** EC2 instance public IP address

### 2. EC2_USERNAME
- **Value:** `ec2-user`
- **Description:** EC2 instance username

### 3. EC2_SSH_KEY
- **Value:** Copy the entire contents of your `resume-instance1-ssh-key.pem` file
- **Description:** Private SSH key for EC2 access

## How to Get SSH Key Content

```bash
# On your local machine
cat resume-instance1-ssh-key.pem
```

Copy the entire output including:
```
-----BEGIN RSA PRIVATE KEY-----
[content]
-----END RSA PRIVATE KEY-----
```

## Deployment Process

The GitHub Action will:

1. **Trigger:** On push to `main` branch or manual trigger
2. **Build:** Install dependencies and build frontend
3. **Deploy:** SSH into EC2 and update the application
4. **Restart:** Restart the backend with PM2
5. **Test:** Verify the application is running

## Manual Deployment

You can also trigger deployment manually:

1. Go to GitHub repository → Actions tab
2. Select "Deploy Resume App to EC2" workflow
3. Click "Run workflow" button

## Troubleshooting

### Common Issues:

1. **SSH Key Issues:**
   - Ensure the entire private key is copied (including headers)
   - Check that the key has proper permissions

2. **Permission Denied:**
   - Verify EC2_USERNAME is correct (`ec2-user` for Amazon Linux)
   - Check EC2 security group allows SSH (port 22)

3. **Build Failures:**
   - Check that all dependencies are in package.json
   - Verify Node.js version compatibility

### Check Deployment Status:

```bash
# SSH into EC2
ssh -i resume-instance1-ssh-key.pem ec2-user@54.221.116.49

# Check PM2 status
pm2 status

# Check application logs
pm2 logs resume-backend

# Test application
curl http://localhost:3000/api/health
```

## Security Notes

- Never commit SSH keys to your repository
- Use GitHub Secrets for sensitive information
- Regularly rotate SSH keys
- Monitor deployment logs for security issues

## Next Steps

1. Set up the GitHub secrets
2. Push to main branch to trigger deployment
3. Monitor the Actions tab for deployment status
4. Test your application at `http://54.221.116.49:3000`
