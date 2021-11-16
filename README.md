# URL Shortener

Instructions to Setup:
1. In console, run "npm init" to create package
2. Run "npm install" to install dependencies
3. Run "npm run setup" to run setup script
4. Run "npm start" to start HTTP server

API Specs:
/getshort/{LongURL}
- Gets the short url for given long url
- Always returns same short url for each long url
- HTTP web address reserved characters must be converted to Hex code (ex. "/" = "%2F")
- If given more time would create a front end that converts characters automatically before making call to API

/getlong/{shortURL}
- Returns the long url for a given short url
- If no long URL has been setup for the short url, a message saying no long url found will appear

/goURL/{shortURL}
- Redirects user to long url corresponding to given short url
- Redirect will not work if url given is not valid

View URL Counter
- A counter is setup in database for each long url
- Each time the url is visited through goURL API the counter is increased
- To view counter, query local URLData.db on table URLs, column name is NumberRequests

Future Additions:
- If given more time would add security checks for SQL injection
- Would also create a client frontend to better display output
