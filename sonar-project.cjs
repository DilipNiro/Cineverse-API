const sonarqubeScanner = require("sonar-scanner");

sonarqubeScanner(
  {
    serverUrl: "http://localhost:9000",
    options: {
      "sonar.projectKey": "cineverse-api",
      "sonar.projectName": "Cineverse API",
      "sonar.sources": "src",
      "sonar.tests": "src/tests",
      "sonar.javascript.lcov.reportPaths": "coverage/lcov.info",
      "sonar.exclusions": "**/node_modules/**,**/dist/**",
      "sonar.sourceEncoding": "UTF-8",
      "sonar.token": "sqp_d1a8fd8eacf9db7f84ad38571c6d2e2761587240",
    },
  },
  () => process.exit(0)
);
