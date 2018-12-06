const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const async = require('async');

var options = {
    url: 'https://sg.toluna.com/Widgets/AddPollVote',
    headers: {
        'Host': 'sg.toluna.com',
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'Origin': 'https://sg.toluna.com',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'DNT': 1,
        'Referer': 'https://sg.toluna.com/',
        'Accept-Language': 'en-US,en-SG;q=0.9,en;q=0.8',
        'Cookie': 'PLACE YOUR COOKIES HERE'
    }
};


request({
    url: 'https://sg.toluna.com/ ',
    headers: {
        'Host': 'sg.toluna.com',
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'DNT': 1,
        'Referer': 'https://www.google.com.sg/',
        'Accept-Language': 'en-US,en-SG;q=0.9,en;q=0.8',
        'Cookie': 'PLACE YOUR COOKIES HERE'
    }
}, (error, response, body) => {
    if (error) {
        return console.log(`Error: ${error}`);
    }

    if (response.statusCode !== 200) {
        return console.log(`Response ${response.statusCode}`);
    }

    const $ = cheerio.load(body);
    let ids = [];
    $('.WidgetContainerSpan').each((index, element) => {
        if ($(element).find("input[name*='widgetPointsAwardHidden']").length > 0) {
            ids.push($(element).find("input[name*='widgetIdHidden']").attr('value'));
        }
    });

    if (ids.length > 0) {
        return vote(ids);
    }

    return console.log('Nothing else to vote.');
});

function vote(ids) {
    async.eachSeries(ids, (id, cb) => {
        console.log(`Voting for ${id}`);
        let body = `pollId=${id}&answers=${Math.floor(Math.random() * 3) + 1}`;
        request.post(Object.assign(options, {
            body: body,
            header: {
                'Content-Length': body.length
            }
        }), (error, response, body) => {
            if (error) {
                return console.log(`Error: ${error}`);
            }

            if (response.statusCode !== 200) {
                return console.log(`Response ${response.statusCode}`);
            }

            console.log('Successfully voted.');
            setTimeout(() => {
                return cb();
            }, ((Math.floor(Math.random() * 10) + 3) * 1000));
        });
    }, err => {

    });
}