const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage({
    ignoreHTTPSErrors: true
  });

  try {
    // Step 1: open page
    await page.goto(
      'https://access.ex.indianoil.in/oam/server/obrareq.cgi?encquery%3Dj08PdUKaFt32G2rab%2FWvOOsCa4csNXJCunoD4KTv2HNjziPgaOHRnimmEMK%2BqicTcuYOBIqns9gjTaVqncBt6Zqb9mnvab4MzXQQwLAboGgg5uKmcom7jOZj3rtoezwLiFM5mwDulIycdVE6YdXgQoqeGtvw0EAft1PVJUNLab5j6E%2B%2F0Znk30Bp6KT1x22RpWQph284rGuVezOuqbkO8QSG%2ByCN%2BDmofxc1dXGE305lW4jCtITKfv86bbhbSMeR6lAnsC5ZbhB0lIdHNnP0pFQ7XbRffXz8BCvNfs8aYqKK1gIs4JOJTWZGhUQ3yZGPMx%2BX7Q7Vxc%2FIEqQfuZDfJQ%3D%3D%20agentid%3DSIEBEL_IP24%20ver%3D1%20crmethod%3D2%26cksum%3Dff5085fd63a1897f9ef7d22eb1f8479389c3ebb3&ECID-Context=1.006JivmaKGxBt1o5oV9DiY005kIV001Vr%5E%3BkXjE',
      {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      }
    );

    console.log('Step 1: page opened');

    await page.screenshot({
      path: 'step1-page-opened.png',
      fullPage: true
    });

    // Wait 5 sec
    await page.waitForTimeout(5000);

    // Step 2 screenshot after wait
    await page.screenshot({
      path: 'step2-after-wait.png',
      fullPage: true
    });

    console.log('Step 2: after wait screenshot taken');

    // Print HTML
    const html = await page.content();
    console.log(html.substring(0, 1000));

    // Step 3 try username field
    await page.locator('#username').fill(process.env.SIEBEL_USERNAME);

    await page.screenshot({
      path: 'step3-username-filled.png',
      fullPage: true
    });

    console.log('Step 3: username filled');

    // Step 4 password
    await page.locator('#password').fill(process.env.SIEBEL_PASSWORD);

    await page.screenshot({
      path: 'step4-password-filled.png',
      fullPage: true
    });

    console.log('Step 4: password filled');

    // Step 5 continue
    await page.locator('#submitid').click();

    await page.screenshot({
      path: 'step5-after-login-click.png',
      fullPage: true
    });

    console.log('Step 5: continue clicked');

    await browser.close();
    process.exit(0);

  } catch (error) {
    console.error('DEBUG FAILED:', error.message);

    await page.screenshot({
      path: 'debug-failure.png',
      fullPage: true
    });

    await browser.close();
    process.exit(1);
  }
})();
