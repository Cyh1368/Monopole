import sys, json

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import ElementNotInteractableException
from selenium.webdriver.common.keys import Keys
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service as ChromeService
import pandas as pd

import time
from dotenv import load_dotenv
import os
from bs4 import BeautifulSoup
import requests
import pprint
# max_chrome_driver_path = '/Users/maxlien/Downloads/chromedriver-mac-arm64/chromedriver'
max_chrome_driver_path = 'C:\\Users\\cheng\\Downloads\\chromedriver-win64\\chromedriver.exe'

from dotenv import load_dotenv
import os

def config():
    load_dotenv()
  
config()

username = str(os.getenv('MONOPLE_GMAIL'))
password=str(os.getenv('MONOPLE_PASSWORD'))

class StackExchangeScraper:
    def __init__(self, chrome_driver_path=max_chrome_driver_path,username=username, password=password):
        self.driver_path = chrome_driver_path
        self.options = webdriver.ChromeOptions()
        #print(self.options)
        self.service = ChromeService(executable_path=self.driver_path)
        self.driver = webdriver.Chrome(service=self.service) #executable_path= max_chrome_driver_path)#,options=self.options)#executable_path=self.driver_path)
        self.wait = WebDriverWait(self.driver, 10)
        
        self.username = username
        self.password = password

    # ... rest of the class methods remain unchanged ...

# Note: Only the initialization method of the class is shown here for brevity.
# The rest of the class methods would remain unchanged from the previous version.
    def _set_up_agent(self):
        #set useragent
        self.options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

    # def _setup_headless_driver(self):
    #     """
    #     Sets up a headless Selenium Chrome driver.
    #     """
    #     self.options.add_argument('--headless')
    #     self.options.add_argument('--no-sandbox')
    #     self.options.add_argument('--disable-dev-shm-usage')
    #     self.driver = webdriver.Chrome(self.driver_path, options=options)
    def _wait(self,type, name):
        return self.wait.until(
                EC.presence_of_element_located((type, name))
            )
    def _wait_all(self, type, name):
        return self.wait.until(
                EC.visibility_of_all_elements_located((type, name))
            )
    def _login(self, username, password):
        
        
        login_button_XPATH = '/html/body/div[1]/header[1]/div/nav/ol/li[4]/a'
        login_button = self._wait(By.XPATH, login_button_XPATH)
        self.driver.execute_script("arguments[0].scrollIntoView();", login_button)
        login_button.click()  

        username_box = self._wait(By.XPATH, '//*[@id="email"]')
        username_box.send_keys(username)

        password_box = self._wait(By.XPATH,'//*[@id="password"]' )
        password_box.send_keys(password)


        submit_button =self._wait(By.XPATH, '//*[@id="submit-button"]') 
        self.driver.execute_script("arguments[0].scrollIntoView();", submit_button)
        submit_button.click()

    def search_links(self, input):
        self._set_up_agent()
        self.driver.get('https://stackexchange.com')

        self._login(self.username, self.password)

        search_box = self._wait(By.XPATH, '//*[@id="search"]/div/input')
        search_box.send_keys(input)
        search_box.send_keys(Keys.ENTER)

        #warning 
        #potential bug here
        #if been redirected to meta.stackexchange
        #the XPATH might not work
        content = self._wait(By.XPATH, '//*[@id="content"]/div/div[3]')
        html_content = content.get_attribute('outerHTML')
        soup = BeautifulSoup(html_content, 'html.parser')
        links = soup.find_all(class_='result-link')
        # for link in links:
        #     print(link.a['href'])
        urls = [str(link.a['href']) for link in links]
        return urls       
        # try:
        #     #for stack_exchange
        #     #result_link_elements = self._wait_all(By.CSS_SELECTOR, "result-link > a")
        #     #print(result_link_elements)
        #     # Extracting the links within each of the 'result-link' elements
        #     links =[]
        #     for element in self._wait_all(By.CSS_SELECTOR, "result-link > a"):
        #         links.append(element.get_attribute("herf"))
        # except TimeoutException :
        #     #in case it redirect to meta.stackexchange
        #     #result_link_elements = self._wait_all(By.CLASS_NAME, "s-post-summary--content-title > a")
        #     #print(result_link_elements)
        #     # Extracting the links within each of the 'result-link' elements
        #     links = []
        #     for element in self._wait_all(By.CSS_SELECTOR, "s-post-summary--content-title > a"):
        #         links.append(element.get_attribute("innerHTML"))

        
        # return links


    def search_anwser(self,url):
        content = dict()
        answer_body = []

        res = requests.get(str(url))
        soup = BeautifulSoup(res.text, 'html.parser')
        post_body = soup.find_all('div', class_='s-prose js-post-body',itemprop='text')
        question_title = soup.find('h1',class_='fs-headline1 ow-break-word mb8 flex--item fl1',itemprop='name')

        answer_body = [i.text for i in post_body if i.text]

        content["question_title"] = question_title.text
        content["question"] = answer_body[0]
        content["answer"] = answer_body[1:len(content)]
        content["url"] =f"{url}"
        return content
        
    def scrape(self, input):
        """
        Main method to scrape StackExchange for a given query and return the texts in a list.
        """
        #self._setup_headless_driver()
        
        urls = self.search_links(input)
        response = {}
        for url in urls:
            content = self.search_anwser(url)
            question_title = content["question_title"]
            content.pop("question_title")
            response[f"{question_title}"] = content
            

        self.driver.quit()

        return response

# Note: As before, the Selenium portion cannot be executed in this environment. 
# The code should be run in a local environment with the appropriate browser driver.

SS = StackExchangeScraper(chrome_driver_path=max_chrome_driver_path,username=username, password=password)
# content = SS.scrape('how to use AWS RDS')
# df = pd.DataFrame(content)
# print(df.columns)
# first_column = df.iloc[2, 0]
# print(first_column)


if __name__ == "__main__":
    query = sys.argv[1]
    # result = {"test":"testing", "join":"joining"}
    result = SS.scrape(query)
    # result = str(result).replace("'", "\"")
    print(json.dumps(result)) # We take the stdout and return it to frontend