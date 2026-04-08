// Open page
await page.goto(URL, {
  waitUntil: 'domcontentloaded',
  timeout: 30000
});

// Wait explicitly for user field
await page.waitForSelector('input[type="text"]', {
  timeout: 30000
});

// Fill username
await page.locator('input[type="text"]').first()
  .fill(process.env.SIEBEL_USERNAME);

// Continue
await page.getByRole('button', { name: /continue/i }).click();

// Wait password field
await page.waitForSelector('input[type="password"]', {
  timeout: 30000
});

// Fill password
await page.locator('input[type="password"]')
  .fill(process.env.SIEBEL_PASSWORD);

// Submit
await page.getByRole('button', { name: /submit/i }).click();
