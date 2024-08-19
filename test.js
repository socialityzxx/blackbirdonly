const request = require('request');
const SocksProxyAgent = require('socks-proxy-agent');
const fs = require('fs');

// Читаем список прокси из файла
let proxies;
try {
    proxies = fs.readFileSync('proxy.txt', 'utf-8').split('\n').filter(Boolean);
} catch (err) {
    console.error('[Error] Unable to read proxy.txt:', err.message);
    process.exit(-1);
}

const testProxy = (proxy, callback) => {
    const agent = new SocksProxyAgent(`socks4://${proxy}`);
    const options = {
        url: 'http://httpbin.org/ip', // сайт для проверки
        agent: agent,
        timeout: 5000, // время ожидания ответа в миллисекундах
    };

    request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            callback(null, proxy, body);
        } else {
            callback(error || new Error(`Status Code: ${response ? response.statusCode : 'Unknown'}`));
        }
    });
};

const checkProxies = (proxies) => {
    const workingProxies = [];

    proxies.forEach(proxy => {
        testProxy(proxy, (err, proxy, body) => {
            if (err) {
                console.log(`[Bad Proxy] ${proxy} - ${err.message}`);
            } else {
                console.log(`[Good Proxy] ${proxy} - ${body}`);
                workingProxies.push(proxy);
            }

            // Когда все прокси проверены, записываем рабочие в файл
            if (workingProxies.length + proxies.indexOf(proxy) === proxies.length) {
                fs.writeFileSync('working_proxies.txt', workingProxies.join('\n'), 'utf-8');
                console.log(`[Info] Working proxies saved to working_proxies.txt`);
            }
        });
    });
};

// Проверяем все прокси из списка
checkProxies(proxies);
