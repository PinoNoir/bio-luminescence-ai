# AWS hosting for the Bio Glow SPA (Vite + React + TanStack Router)

## Recommendation

**Use AWS Amplify Hosting.** For a portfolio-scale Vite SPA with client-side routing, Amplify gives you the same underlying CloudFront CDN + HTTPS + custom domain that a hand-rolled S3+CloudFront stack provides, but:

- It has a documented, one-field fix for the client-side-routing 404 problem (a single "rewrite (200) → /index.html" rule), instead of hand-tuning CloudFront custom-error-response objects and reasoning about 403-vs-404 semantics on a private S3 origin.
- CI/CD is built in (connect the GitHub repo, Amplify builds and deploys on every push) — no separate GitHub Actions workflow, IAM deploy role, or `aws s3 sync` / `aws cloudfront create-invalidation` scripting to maintain.
- Custom domain HTTPS is a guided flow with an Amplify-managed ACM certificate.
- At hobby/portfolio traffic it is effectively free (1,000 build minutes, 5 GB stored, 15 GB served — all $0/month), and AWS's own S3-hosting docs now *explicitly recommend Amplify Hosting over raw S3 website hosting* for this exact use case.

**S3 + CloudFront remains a legitimate second choice** if more infrastructure-level control is wanted (e.g., defining the stack in CDK/Terraform as portfolio evidence of AWS/IaC skill), and it is now cheaper/simpler than it used to be thanks to CloudFront's new flat-rate **Free plan** ($0/month, 1M requests, 100GB transfer, free ACM TLS cert included). But it requires assembling more pieces by hand: an S3 bucket with Origin Access Control, a CloudFront distribution, two custom-error-response rules (403 *and* 404 → `/index.html`, 200), an ACM cert in `us-east-1`, and a CI/CD pipeline you write yourself (typically a GitHub Actions workflow using `aws-actions/configure-aws-credentials` + `aws s3 sync` + a CloudFront invalidation step, since AWS does not publish a first-party GitHub Action for either step).

Given the project is explicitly a **portfolio piece** and the backend complexity already lives in Supabase, the lower operational overhead of Amplify Hosting is the better trade — it demonstrates competent AWS usage without the SPA-hosting boilerplate becoming the interesting part of the build. If a future goal is to showcase IaC/CDK skills specifically, S3+CloudFront (Free flat-rate plan) is the fallback worth revisiting.

---

## Candidates evaluated

1. AWS Amplify Hosting
2. Amazon S3 + Amazon CloudFront (with Origin Access Control)
3. Other AWS-native options considered and ruled out

---

## 1. AWS Amplify Hosting

### What it is
A Git-based, fully managed hosting service that deploys apps onto the CloudFront CDN with continuous deployment. It explicitly lists React as a supported SPA framework.
Source: [Welcome to AWS Amplify Hosting](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html)

Notably, AWS's own S3 documentation now steers users away from raw S3 website hosting toward Amplify:

> "We recommend that you use AWS Amplify Hosting to host static website content stored on S3. Amplify Hosting is a fully managed service that makes it easy to deploy your websites on a globally available content delivery network (CDN) powered by Amazon CloudFront, allowing secure static website hosting."

Source: [Hosting a static website using Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)

### Setup complexity
1. Sign in to AWS, connect a Git repo (GitHub, Bitbucket, GitLab, or CodeCommit).
2. Amplify auto-detects the build settings (or you supply a build spec) and deploys.
3. Add a rewrite rule for SPA routing (see below).

Source: [Getting started with deploying an app to Amplify Hosting](https://docs.aws.amazon.com/amplify/latest/userguide/getting-started.html)

This is materially fewer moving parts than S3+CloudFront: no manual bucket policy, no OAC configuration, no distribution behavior tuning — Amplify owns the CDN layer.

### SPA client-side routing ("404 on refresh")
Amplify's redirects/rewrites system documents this exact problem directly:

> "Most SPA frameworks support HTML5 history.pushState() to change browser location without initiating a server request. This works for users who begin their journey from the root (or /index.html), but fails for users who navigate directly to any other page."

The documented fix is a single rewrite rule:

| Original address | Destination | Type |
|---|---|---|
| `</^[^.]+$\|\.(?!(css\|gif\|ico\|jpg\|js\|png\|txt\|svg\|woff\|woff2\|ttf\|map\|json\|webp)$)([^.]+$)/>` | `/index.html` | `200` (rewrite) |

JSON form:
```json
[
  {
    "source": "</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>",
    "status": "200",
    "target": "/index.html",
    "condition": null
  }
]
```
A simpler catch-all variant (`/<*>` → `/index.html`, 200) is also documented for cases where you don't need to exclude static asset extensions from the rewrite.

Source: [Redirects and rewrites example reference — "Redirects for single page web apps (SPA)"](https://docs.aws.amazon.com/amplify/latest/userguide/redirect-rewrite-examples.html)

Amplify also auto-manages clean URLs for statically generated pages (e.g., `/about` → `/about/index.html`) as a related but separate feature.
Source: same page, "Trailing slashes and clean URLs" section.

### Custom domain + HTTPS
- Default deploy gets an `amplifyapp.com` HTTPS URL automatically.
- To attach a custom domain: register/own the domain (Route 53 or third-party registrar), then either use Amplify's **default managed certificate** (auto-provisioned) or bring your own ACM certificate.
- Prerequisites are minimal: a registered domain, an ACM certificate (or use Amplify's own), and an already-deployed app.

Source: [Connecting a custom domain](https://docs.aws.amazon.com/amplify/latest/userguide/custom-domains.html)

### CI/CD
Native and default — connecting the repo *is* the CI/CD setup. Every push to the connected branch triggers a build + atomic deployment (deployment only goes live once the whole build succeeds, avoiding partial-deploy states). Feature-branch deploys and pull-request previews are also built in.
Source: [Welcome to AWS Amplify Hosting](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html) (see "Feature branches," "Pull request previews," "Atomic deployments")

### Cost at hobby/portfolio scale
Per the official pricing page:
- **Build minutes:** free up to 1,000 build minutes/month (standard instance), then $0.01/minute.
- **Hosting/storage:** free up to 5 GB stored on the CDN/month; $0.023/GB/month beyond that.
- **Data transfer (served):** free up to 15 GB/month; $0.15/GB beyond that.

Source: [AWS Amplify Pricing](https://aws.amazon.com/amplify/pricing/)

A Vite build for a portfolio SPA (a few MB) and low personal/recruiter-level traffic will sit entirely inside these free allowances — realistic monthly cost is **$0**.

---

## 2. Amazon S3 + Amazon CloudFront

### What it is
The classic self-assembled static-hosting stack: an S3 bucket holds the built assets; CloudFront sits in front as the CDN and TLS terminator. AWS's current best-practice pattern uses the S3 **REST endpoint** as the CloudFront origin (not the separate S3 "static website hosting" endpoint), secured with **Origin Access Control (OAC)** so the bucket itself stays private and only CloudFront can read it.

Relevant docs:
- [Hosting a static website using Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html) — notes that if the bucket uses SSE-KMS encryption you *must* front it with CloudFront + OAC (OAI, the older mechanism, doesn't support SSE-KMS).
- [Restrict access to an Amazon S3 origin (OAC)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)

Note that the legacy S3 static-website-hosting endpoint (with its own index/error-document settings) **does not support HTTPS directly** — you'd still need CloudFront in front of it for TLS, which is one reason AWS's docs now point people at Amplify or at CloudFront+OAC over the S3 website-hosting endpoint by itself.

### Setup complexity
More manual than Amplify:
1. Create a private S3 bucket, upload the Vite build output.
2. Create a CloudFront distribution with the bucket as origin, using Origin Access Control (S3 bucket policy is auto-generated by the console to trust the specific distribution).
3. Request/attach an ACM certificate (must be in `us-east-1` for CloudFront) for the custom domain.
4. Configure custom error responses (see routing section below).
5. Build your own deploy pipeline (see CI/CD section below).

### SPA client-side routing
CloudFront's **custom error responses** feature is the mechanism: you configure it to intercept an HTTP status code from the origin and instead serve a specified page (e.g., `/index.html`) with an overridden status code (200).
Source: [Generate custom error responses](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/custom-error-pages.html), procedure detail at [Configure error response behavior](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/custom-error-pages-procedure.html) (console: Distribution → Error Pages tab → Create Custom Error Response → set HTTP error code, response page path `/index.html`, HTTP response code `200`).

**Important nuance not present in the Amplify path:** when the S3 origin is private and accessed via OAC, a request for a route that doesn't exist as an object (e.g. `/explore`) can come back from S3 as **403 Forbidden**, not 404, depending on the bucket policy/permissions in play. AWS's CloudFront error-code reference pages document 403 and 404 as distinct cases:
- [HTTP 403 status code (Permission Denied)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/http-403-permission-denied.html)
- [HTTP 404 status code (Not Found)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/http-404-not-found.html)

In practice this means you must create **two** custom error response rules — one for 403 and one for 404, both mapping to `/index.html` with a 200 override — or refresh-on-a-client-route can still break depending on which status S3 happens to return. This is the kind of easy-to-miss detail Amplify's single documented rewrite rule sidesteps entirely.

### Custom domain + HTTPS
- CloudFront distributions get HTTPS by default on their `*.cloudfront.net` domain.
- For a custom domain: request/import an ACM certificate in `us-east-1`, attach it to the distribution as an alternate domain name (CNAME), then point DNS (Route 53 or any provider) at the CloudFront domain.
- As of AWS's newer **flat-rate pricing plans**, even the Free plan includes a free TLS certificate with automatic renewal via ACM as part of the plan, and Origin Access Control is supported on every tier.
Source: [CloudFront flat-rate pricing plans — feature table](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/flat-rate-pricing-plan.html)

### CI/CD
No first-party, fully-managed CI/CD the way Amplify has it. The standard pattern is a self-authored GitHub Actions workflow:
1. `aws-actions/configure-aws-credentials` (AWS's own GitHub Action) to authenticate the workflow to AWS, preferably via OIDC for short-lived credentials rather than long-lived IAM keys.
Source: [aws-actions/configure-aws-credentials](https://github.com/aws-actions/configure-aws-credentials)
2. Run `vite build`, then `aws s3 sync ./dist s3://<bucket>` via the AWS CLI in the workflow (AWS does not publish a first-party Action for the sync step itself — this is plain CLI usage).
3. Run `aws cloudfront create-invalidation` to bust the CDN cache for `/index.html` (and optionally `/*`) after each deploy, since CloudFront otherwise continues serving cached content per your TTL settings.

This is a workflow you write and maintain yourself — more control, more moving parts to keep working.

### Cost at hobby/portfolio scale
**S3:**
- Storage: $0.023/GB/month (S3 Standard, varies by region).
- Requests: PUT/COPY/POST $0.005 per 1,000; GET $0.0004 per 1,000.
Source: [Amazon S3 pricing](https://aws.amazon.com/s3/pricing/)

A few MB of Vite build output and low traffic costs fractions of a cent per month in storage/requests.

**CloudFront — two pricing models now coexist:**
1. **Traditional pay-as-you-go** (the historical model: pay per GB transferred + per request).
2. **New flat-rate pricing plans** (announced Nov 2025): Free / Pro / Business / Premium tiers that bundle CloudFront + WAF + DDoS protection + Route 53 DNS + CloudWatch Logs ingestion + a free ACM TLS cert + S3 storage credits into one flat monthly price with **no overage charges**. The **Free plan is $0/month** for 1M requests and 100GB data transfer/month — comfortably enough for a portfolio site — and usage above the allowance triggers a soft performance adjustment rather than a bill, with a documented one-time 3x-allowance grace spike.
Source: [CloudFront flat-rate pricing plans](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/flat-rate-pricing-plan.html)

Caveat worth flagging from the same doc: accounts still under the legacy 12-month **AWS Free Tier** promotional status are listed as **not eligible** to subscribe a distribution to a flat-rate plan ("Your account is using AWS Free Tier" is listed under account-level constraints that block eligibility) — relevant if this is deployed from a brand-new AWS account, since it may default to traditional pay-as-you-go billing until Free Tier status lapses or is explicitly moved off.

Net: at portfolio scale, S3+CloudFront is also realistically **$0–low cents/month**, whether on the new Free flat-rate plan or on traditional pay-as-you-go (given how far under the usage thresholds a personal-project SPA sits).

---

## 3. Other AWS-native options considered

- **Raw S3 static website hosting (no CloudFront)** — ruled out. No HTTPS on the website endpoint, no OAC/private-bucket support, no CDN, and AWS's own docs now explicitly redirect readers to Amplify Hosting instead of documenting this as a recommended terminal setup for anything beyond static HTML tucked behind a bare HTTP endpoint. Source: [Hosting a static website using Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html).
- **AWS App Runner / Elastic Beanstalk / Lightsail** — not evaluated in depth; these are container/server-oriented compute services. Serving a purely static Vite build through a running compute instance is unnecessary cost and operational overhead compared to CDN-native static hosting, and none of them offer anything S3+CloudFront or Amplify don't already cover for this SPA use case.

---

## Sources consulted

- [Welcome to AWS Amplify Hosting](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html)
- [Getting started with deploying an app to Amplify Hosting](https://docs.aws.amazon.com/amplify/latest/userguide/getting-started.html)
- [Setting up redirects and rewrites for an Amplify application](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html)
- [Redirects and rewrites example reference](https://docs.aws.amazon.com/amplify/latest/userguide/redirect-rewrite-examples.html)
- [Connecting a custom domain (Amplify)](https://docs.aws.amazon.com/amplify/latest/userguide/custom-domains.html)
- [AWS Amplify Pricing](https://aws.amazon.com/amplify/pricing/)
- [Hosting a static website using Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [Amazon S3 pricing](https://aws.amazon.com/s3/pricing/)
- [Restrict access to an Amazon S3 origin (Origin Access Control)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
- [Generate custom error responses (CloudFront)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/custom-error-pages.html)
- [Configure error response behavior (CloudFront)](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/custom-error-pages-procedure.html)
- [HTTP 403 status code (Permission Denied) — CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/http-403-permission-denied.html)
- [HTTP 404 status code (Not Found) — CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/http-404-not-found.html)
- [CloudFront flat-rate pricing plans](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/flat-rate-pricing-plan.html)
- [Amazon CloudFront Pricing (overview page)](https://aws.amazon.com/cloudfront/pricing/)
- [AWS announces flat-rate pricing plans for website delivery and security (What's New, Nov 2025)](https://aws.amazon.com/about-aws/whats-new/2025/11/aws-flat-rate-pricing-plans/)
- [aws-actions/configure-aws-credentials (official AWS GitHub Action)](https://github.com/aws-actions/configure-aws-credentials)
