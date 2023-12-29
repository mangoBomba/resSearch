const cheerio = require('cheerio');
const axios = require('axios');
let input = encodeURI('호수앉기');
let search = 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=';

search += input;

async function resSearch(search) {
    try {
        const response = await axios.get(search);
        const html = response.data;
        const $ = cheerio.load(html);

        const name = $('body .Fc1rA').text();
        const address = $('body .LDgIH').text();
        const telNo = $('body .xlx7Q').text();
        const url = $('a.place_bluelink').attr('href');

        let lngCheck = '';
        let latCheck = '';

        if (url) {
            lngCheck = url.indexOf('lng=')
            latCheck = url.indexOf('lat=')
        } else {
            console.log('검색 결과가 없습니다.');
            return null;
        }

        let posX = '';
        let posY = '';

        if (lngCheck !== -1 && latCheck !== -1) {
            posX = url.slice(lngCheck + 4, lngCheck + 15);
            posY = url.slice(latCheck + 4, latCheck + 14);
        } else {
            posX = 'X좌표조회실패';
            posY = 'Y좌표조회실패';
        }

        let info = {
            "name": name,
            "address": address,
            "telNo": telNo,
            "url": url,
            "posX": posX,
            "posY": posY
        }

        if (info.name !== '') {
            return info;
        } else {
            console.log('검색 결과가 없습니다.');
            return null;
        }
    } catch (error) {
        let errorText = '에러가 발생했습니다.'
        console.log(errorText)
        console.error("error : ", error);
        return null;
    }
}

async function main() {
    const result = await resSearch(search);

    if (result) {
        console.log(result);
    } else {
        console.log('검색 결과가 없거나 에러가 발생했습니다.');
    }
}

//main();

module.exports = {
    "resSearch": resSearch,
};
