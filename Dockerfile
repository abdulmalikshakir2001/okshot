# Use an official Node.js image as the base image
FROM node:20.8.0

# Install the latest version of Python and global dependencies (FFmpeg, Git, etc.)
RUN apt-get update
RUN apt-get install -y python3 python3-venv python3-pip
RUN apt-get install -y ffmpeg
RUN apt-get install -y git
RUN apt-get install -y imagemagick
RUN apt-get install -y libhdf5-dev

# Set the working directory inside the container
WORKDIR /app

# Create and activate a Python virtual environment
RUN python3 -m venv /myenv
ENV PATH="/myenv/bin:$PATH"

# Install Python dependencies in the virtual environment
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir nltk \
    && python3 -m nltk.downloader -d /usr/local/share/nltk_data punkt punkt_tab
# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json package-lock.json ./

# Increase NPM timeout and retry installation on failure
RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000

# Run npm install with retry on failure
RUN npm install || npm install || npm install

# Copy the remaining app files
COPY . .

# Set environment variables from the .env file
ENV NEXTAUTH_URL=http://localhost:4002
ENV NEXTAUTH_SECRET=rZTFtfNuSMajLnfFrWT2PZ3lX8WZv7W/Xs2H8hkEY6g=
ENV SMTP_HOST=sandbox.smtp.mailtrap.io
ENV SMTP_PORT=2525
ENV SMTP_USER=b09b4a458f0e64
ENV SMTP_PASSWORD=bb22d7134c93d2
ENV SMTP_FROM='abdulmalikshakir2001@gmail.com'
ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aivideo
ENV APP_URL=http://localhost:4002
ENV SVIX_URL=https://api.eu.svix.com
ENV SVIX_API_KEY=testsk_Q7EV6PtPGn7v_MKEsH9CokVMnBiJsWfK.eu
ENV GITHUB_CLIENT_ID=Ov23liMjCOjX8QglQjZY
ENV GITHUB_CLIENT_SECRET=c512bfa75910ee5fda898ac2c3a3fc6b1ccae45f
ENV GOOGLE_CLIENT_ID=894704109053-u7b5fhsks1tkhpen3tsm38j63mictdit.apps.googleusercontent.com
ENV GOOGLE_CLIENT_SECRET=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
ENV RETRACED_URL=
ENV RETRACED_API_KEY=
ENV RETRACED_PROJECT_ID=
ENV HIDE_LANDING_PAGE=false
ENV GROUP_PREFIX=boxyhq-
ENV CONFIRM_EMAIL=false
ENV DISABLE_NON_BUSINESS_EMAIL_SIGNUP=false
ENV NEXT_PUBLIC_MIXPANEL_TOKEN=
ENV AUTH_PROVIDERS=
ENV OTEL_EXPORTER_OTLP_METRICS_ENDPOINT=
ENV OTEL_EXPORTER_OTLP_METRICS_HEADERS=
ENV OTEL_EXPORTER_OTLP_METRICS_PROTOCOL=grpc
ENV OTEL_EXPORTER_DEBUG=true
ENV OTEL_PREFIX=boxyhq.saas
ENV NEXT_PUBLIC_TERMS_URL='/terms'
ENV NEXT_PUBLIC_PRIVACY_URL='/privacy'
ENV NEXT_PUBLIC_DARK_MODE=false
ENV FEATURE_TEAM_SSO=true
ENV FEATURE_TEAM_DSYNC=true
ENV FEATURE_TEAM_AUDIT_LOG=true
ENV FEATURE_TEAM_WEBHOOK=true
ENV FEATURE_TEAM_API_KEY=true
ENV FEATURE_TEAM_DELETION=true
ENV FEATURE_TEAM_PAYMENTS=true
ENV RECAPTCHA_SITE_KEY=
ENV RECAPTCHA_SECRET_KEY=
ENV NEXTAUTH_SESSION_STRATEGY=jwt
ENV NEXT_PUBLIC_SENTRY_DSN=
ENV NEXT_PUBLIC_SENTRY_TRACE_SAMPLE_RATE=0.0
ENV SENTRY_RELEASE=
ENV SENTRY_ENVIRONMENT=
ENV SENTRY_URL=
ENV SENTRY_ORG=
ENV SENTRY_PROJECT=
ENV SENTRY_AUTH_TOKEN=
ENV MAX_LOGIN_ATTEMPTS=5
ENV SLACK_WEBHOOK_URL=
ENV STRIPE_SECRET_KEY=sk_test_51PQTZD2MXTg6eduPg7y3VWnmQbzLR23BSx6TRde6TYNteFnmrQwThtRndCzYYccbj824pifkK1sh0eZiUpAFVnMp00FLzxjKOc
ENV STRIPE_WEBHOOK_SECRET=whsec_a2555d34d716c1da72e3899ea18fc318bb6ffae9e700825cd4a4d18fb12d7330
ENV NEXT_PUBLIC_SUPPORT_URL=

# Expose the port
EXPOSE 4002

# Add logging to check the db:setup command
RUN echo "Running db:setup..."
# Start the Next.js app in development mode after running db:setup
CMD ["sh", "-c", " npm run dev"]