//const { required package} = require("package");

const {Builder, By, Key, until} = require('selenium-webdriver')

async function runSeleniumScript() {
  const driver = new Builder().forBrowser('chrome').build();
  try {
    await driver.get('https://www.google.com');
    await driver.findElement(By.name('q')).sendKeys('Selenium', Key.RETURN);
    await driver.wait(until.titleIs('Selenium - Google Search'), 5000);
  } finally {
    await driver.quit();
  }
}

runSeleniumScript();
