// Basic Playwright config for local e2e tests
const { devices } = require('@playwright/test');

module.exports = {
  timeout: 60000,
  use: {
    headless: true,
  },
}
