const https = require('https');

https.get('https://elite-fleet-manager-336646230398.us-west1.run.app/assets/index-CMSJVxhh.js', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const strings = data.match(/(["'])(?:(?=(\\?))\2.)*?\1/g);
    if (strings) {
      const uniqueStrings = [...new Set(strings.map(s => s.slice(1, -1)))];
      const interesting = uniqueStrings.filter(s => s.length > 10 && !s.includes('function') && !s.includes('return') && !s.includes('react'));
      console.log(interesting.slice(0, 100).join('\n'));
    }
  });
});
