
var TelegramBot = require('node-telegram-bot-api');

var fs = require('fs')

var http = require('http');

var token = 'telegram_token.json';

var data = fs.readFileSync(token);

var bot_options = {
  polling: true
};


auth_token = JSON.parse(data)['token']

var bot = new TelegramBot(auth_token, bot_options);


  /**
  * Calls the Forismatic API Output
  * @function getQuote
  * @param  {fromID} ID of the original message
  */
var getQuote = function(fromId){

    var options = {
      host: 'api.forismatic.com',
      path: '/api/1.0/?method=getQuote&format=json&lang=en'
    };

    callback = function(response) {
      var str = '';

      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        formatData(str, fromId);
      });
    }

    http.request(options, callback).end();

}


  /**
  * Formats the Forismatic API Output
  * @function formatData
  * @param  {JSON} data JSON of Forismatic API output
  */
var formatData = function(data, fromtId){
    quote = JSON.parse(data)['quoteText'] + "--" + JSON.parse(data)['quoteAuthor'] 
    bot.sendMessage(fromtId, quote)
}

  /**
   * Matches `/what's the good word` and calls quote function
   * @function formatData
   */
bot.onText(/\/what's the good word/, function (msg, match) {
    getQuote(msg.from.id);

});


