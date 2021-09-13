# dota2_shopkeeper_quiz


a recreation of the popular dota 2 shopkeeper's quiz at http://www.dota2.com/quiz, which was removed years ago. However, there are still videos from when it was still available. I used this as a reference: https://www.youtube.com/watch?v=R0P4Xw8lgds 

My goal was to make the quiz as visually identical as possible, and fixing bugs from the old game.

Since the orignal game code is unretrievable, I had to do everything (visuals, animations, timings, logic) myself,  heavily relying on the reference above. 

Play it here: https://dota2-quiz.herokuapp.com/

## implementation

It is a web app, consisting of server/client side. Hosted on heroku. 

- For server-side: Java, Jsoup, Spring boot, org.json 
- For client-side: javascript, html, css, jquery

Dota 2 gets frequent updates that may change the items (item stats/new item). To have the game be always updated and use the items from the latest patch, item data is scraped off the community run wikipedia. https://dota2.fandom.com/wiki/Items.

## what i learned

- got better in client side languages that I rarely use. (HTML, CS, JS)
- Learned Jsoup, (java web scraper), dom traversal, and css selectors
- some java practice in lambdas and streams, regex

## side by side comparison

real one on left, remake on right.

![](https://github.com/patrickdx/dota2_shopkeeper_quiz/blob/main/dota2gameplay.gif)
