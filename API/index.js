import fetch from 'node-fetch';

export default async (req, res) => {
  const { path } = req.query;
  if (!path) {
    return res.status(400).send('URL parametresi eksik.');
  }

  try {
    const url = decodeURIComponent(path);
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Proxy isteği başarısız oldu: ${response.status} ${response.statusText}`);
    }

    const headers = Object.fromEntries(response.headers.entries());
    delete headers['content-encoding'];
    delete headers['transfer-encoding'];

    res.writeHead(response.status, headers);
    response.body.pipe(res);

  } catch (error) {
    console.error('Hata:', error.message);
    res.status(500).send(`Hata: ${error.message}`);
  }
};
