const axios = require('axios');
const https = require('https');
const zlib = require('zlib'); // Gzip 압축을 위한 zlib 라이브러리

exports.handler = async function (event, context, callback) {
  try {
    const currentYear = new Date().getFullYear().toString();

    const urls = [
      `https://www.schoolinfo.go.kr/openApi.do?apiKey=09f9b2bf2e3b4daea8e4f4b88f22b7df&apiType=0&pbanYr=${currentYear}&schulKndCode=04`,
      `https://www.schoolinfo.go.kr/openApi.do?apiKey=09f9b2bf2e3b4daea8e4f4b88f22b7df&apiType=63&pbanYr=${currentYear}&schulKndCode=04`
    ];

    const responses = await Promise.all(
      urls.map(async (url) => {
        try {
          const response = await axios.get(url, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
          });

          if (response.data.resultCode === 'fail') {
            // 작년 연도로 업데이트
            const lastYear = (currentYear - 1).toString();
            const updatedUrl = url.replace(currentYear, lastYear);

            const updatedResponse = await axios.get(updatedUrl, {
              httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });
            return updatedResponse.data;
          } else {
            return response.data;
          }
        } catch (error) {
          console.error('Failed to fetch data:', error);
          throw error;
        }
      })
    );

    // Gzip 압축 적용
    const compressedData = zlib.gzipSync(JSON.stringify(responses));

    callback(null, {
      statusCode: 200,
      headers: {
        'Content-Encoding': 'gzip', // Gzip 압축된 데이터를 사용하도록 설정
        'Access-Control-Allow-Origin': '*', // 또는 특정 도메인
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: compressedData
    });
  } catch (error) {
    console.error('Failed to fetch data:', error);
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data' })
    });
  }
};
