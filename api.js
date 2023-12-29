const naver = require('./naver.js');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// 미들웨어 파싱
app.use(cors());
app.use(express.json());

// POST 요청 처리
app.post('/api/check-parameter', async (req, res) => {
  // 파라미터명이 'resName'이고 값이 있으면 함수 실행
  const resName = req.body.resName; // resName 파라값

  if (resName) {
    try {
      let encoding = encodeURI(resName);
      let search =
        'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=';

      search += encoding;

      result = await naver.resSearch(search);

      if (result) {
        res.json({
          name: result.name,
          address: result.address,
          telNo: result.telNo,
          url: result.url,
          posX: result.posX,
          posY: result.posY,
        });
      } else {
        res.status(404).json({ error: '검색 결과가 없습니다.' });
      }
    } catch (error) {
      console.error('error', error);
      res.status(500).json({ error: '서버에러' });
    }
  } else {
    res.status(400).json({ error: '값을 채워주세요.' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
