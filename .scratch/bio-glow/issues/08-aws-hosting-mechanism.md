# AWS hosting mechanism

Type: research
Status: resolved

## Question

Given AWS's role is frontend-hosting-only (ticket 04) for a Vite-built React SPA using client-side routing (TanStack Router), which AWS service should serve it — S3 + CloudFront, AWS Amplify Hosting, or something else? Research against primary AWS docs: setup complexity, cost at hobby/portfolio scale, SPA client-side-routing support (fallback to index.html on 404), custom domain + HTTPS, and CI/CD deploy story. Write findings + a recommendation to a markdown file and link it here.

## Answer

Recommendation: **AWS Amplify Hosting**. It runs on the same CloudFront CDN as a hand-built S3+CloudFront stack but handles the SPA "404 on refresh" problem with a single documented rewrite rule (`/<*>` → `/index.html`, 200), provisions HTTPS and custom domains through a guided flow with an auto-managed ACM certificate, and includes native git-based CI/CD (push to the connected branch, Amplify builds and deploys) with no GitHub Actions workflow or IAM deploy role to hand-roll. At portfolio-scale traffic and a small Vite build, it's effectively free under Amplify's published allowances (1,000 build minutes, 5 GB stored, 15 GB served per month). AWS's own S3 hosting docs now explicitly recommend Amplify Hosting over raw S3 website hosting for this exact scenario. S3 + CloudFront (now with CloudFront's new $0/month flat-rate Free plan) remains a solid fallback if the goal shifts toward demonstrating hand-built AWS/IaC infrastructure, but requires manually configuring Origin Access Control, two custom-error-response rules (403 *and* 404 → index.html, since a private S3 origin can return either), an ACM cert in `us-east-1`, and a self-authored GitHub Actions deploy pipeline. Full comparison and citations: [./research/aws-hosting-mechanism.md](./research/aws-hosting-mechanism.md).
