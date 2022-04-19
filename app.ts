import ax = require('axios');
const axios = ax.default;
const iterationsAmount: number = 20;
const iterationDelayMs: number = 150;
const reqConf: ax.AxiosRequestConfig = {
    method: 'GET',
    url: 'https://www.google.com/',
    responseType: 'json',
};


var timesArray: number[] = [];
var tabularData: any[] = [];
var reqIntervId: NodeJS.Timer;
var currentIter: number = iterationsAmount;
var reqDoneIndex: number = 0;

async function main() {
    console.log(`Making ${iterationsAmount} requests to ${reqConf.url}`);
    reqIntervId = setInterval(makeRequest, iterationDelayMs);
}

function makeRequest() {
    if (currentIter > 0) {
        currentIter--;
        let startDateMs: number = Date.now();
        axios(reqConf).then((res) => {
            const durationMs = Date.now() - startDateMs;
            timesArray.push(durationMs);
            tabularData.push({ 'Status': `${res.status}`, 'Duration(ms)': durationMs });
            // console.log(`Req#${reqDoneIndex + 1} ${res.status} ${Date.now() - startDateMs}ms`);
            reqDoneIndex++;
            if (reqDoneIndex === iterationsAmount) {
                endOfReqCallback();
            }
        });
    } else {
        clearInterval(reqIntervId);
    }
}

// Called when the last request got a response
function endOfReqCallback() {

    console.table(tabularData);
    const totalSum: number = timesArray.reduce((previous, current) => previous + current, 0);
    console.log(`Average time ${totalSum / iterationsAmount}ms`);
}

main();