const puppeteer = require("puppeteer");
require("dotenv").config();

const region = process.env.ALIENWARE_REGION
  ? process.env.ALIENWARE_REGION
  : "eu";
const username = process.env.ALIENWARE_USERNAME;
const pass = process.env.ALIENWARE_PASSWORD;

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
      await page.goto(`https://${region}.alienwarearena.com/`, {
        timeout: 0,
        waitUntil: "load",
      });
      console.log(`Connected to https://${region}.alienwarearena.com/`);
      await page.waitForSelector('[class="nav-link nav-link-login"]');
      await page.click('[class="nav-link nav-link-login"]');
      console.log("Login screen");
      await page.waitForSelector("#_username");
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
      await page.waitForSelector("#umCollapse");
      console.log("Logged in");
      await page.click("#umCollapse");
    } catch (e) {
      console.error(e.message);
    } finally {
      await browser.close();
    }
  })();
}
