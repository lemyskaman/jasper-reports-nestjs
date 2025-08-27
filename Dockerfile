# --- Unified build: openjdk + Node.js ---
FROM openjdk:17-slim as build
WORKDIR /app
# Install Node.js 20, libfreetype6, fontconfig, and fonts for JasperReports
RUN apt-get update && apt-get install -y curl libfreetype6 fontconfig fonts-dejavu-core && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    node -v && npm -v
# Install app dependencies and build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# Build Jasper CLI
WORKDIR /app/jasper-engine
RUN apt-get update && apt-get install -y wget && \
    wget https://repo1.maven.org/maven2/net/sf/jasperreports/jasperreports/6.20.0/jasperreports-6.20.0.jar && \
    wget https://repo1.maven.org/maven2/net/sf/jasperreports/jasperreports-functions/6.20.0/jasperreports-functions-6.20.0.jar && \
    wget https://repo1.maven.org/maven2/commons-beanutils/commons-beanutils/1.9.4/commons-beanutils-1.9.4.jar && \
    wget https://repo1.maven.org/maven2/commons-collections/commons-collections/3.2.2/commons-collections-3.2.2.jar && \
    wget https://repo1.maven.org/maven2/org/apache/commons/commons-collections4/4.4/commons-collections4-4.4.jar && \
    wget https://repo1.maven.org/maven2/commons-digester/commons-digester/2.1/commons-digester-2.1.jar && \
    wget https://repo1.maven.org/maven2/commons-logging/commons-logging/1.1.1/commons-logging-1.1.1.jar && \
    wget https://repo1.maven.org/maven2/com/lowagie/itext/2.1.7/itext-2.1.7.jar && \
    javac -cp "./*" JasperCli.java

# --- Final image ---
FROM openjdk:17-slim
WORKDIR /app
# Install Node.js 20, libfreetype6, fontconfig, and fonts for JasperReports
RUN apt-get update && apt-get install -y curl libfreetype6 fontconfig fonts-dejavu-core && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    node -v && npm -v
# Add non-root user for app
RUN useradd -m -d /app -s /bin/bash appuser && \
    chown -R appuser:appuser /app
# Copy app and Jasper CLI from build
COPY --from=build /app /app
# Set Java environment
ENV JAVA_HOME=/opt/java/openjdk
ENV PATH="${JAVA_HOME}/bin:${PATH}"
# Expose port
EXPOSE 3000
# Switch to non-root user
USER appuser
# Start command
CMD ["npm", "run", "start:prod"]