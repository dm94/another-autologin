const puppeteer = require("puppeteer");
require("dotenv").config();

const region = process.env.ALIENWARE_REGION
  ? process.env.ALIENWARE_REGION
  : "eu";
const username = process.env.ALIENWARE_USERNAME;
const pass = process.env.ALIENWARE_PASSWORD;
const phpSid = process.env.PHPSSID;

if (username == null || pass == null) {
  console.log("Add the username and password to the .env");
} else {
  (async () => {
    const browser = await puppeteer.launch({
      headless: true,
      slowMo: 100,
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 1024 });
      await page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
      );
      await page.setCookie({
        name: "PHPSESSID",
        value: phpSid,
        domain: "alienwarearena.com",
      });
      await page.goto(`https://${region}.alienwarearena.com/`, {
        timeout: 0,
        waitUntil: "load",
      });
      await page.setCookie({
        name: "PHPSESSID",
        value: phpSid,
      });
      await page.goto(`https://${region}.alienwarearena.com/`, {
        timeout: 0,
        waitUntil: "load",
      });
      console.log(`Connected to https://${region}.alienwarearena.com/`);

      const logged = await page.evaluate(() => window.user_is_logged_in);
      console.log("Logged: ", logged);

      if (!logged) {
        await page.waitForSelector('[class="nav-link nav-link-login"]');
        await page.click('[class="nav-link nav-link-login"]');
        console.log("Login screen");
        await page.waitForSelector("#_username");
        await page.waitForSelector("#_password");
        await page.$eval(
          "#_username",
          (el, username) => {
            el.value = username;
          },
          username
        );
        await page.$eval(
          "#_password",
          (el, pass) => {
            el.value = pass;
          },
          pass
        );
        await page.waitForSelector("#_login");
        await page.click("#_login");
      }

      console.log(
        "Logged in: ",
        await page.evaluate(() => window.user_is_logged_in)
      );
    } catch (e) {
      console.error(e);
    } finally {
      await browser.close();
    }
  })();
}
