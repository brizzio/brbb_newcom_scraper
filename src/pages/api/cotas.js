// pages/api/cotas.js

export default async function handler(req, res) {
  try {
    const response = await fetch('https://newcon.consorciomagalu.tec.br/Newcon.AutoAtendimento.Gateway/autoatendimento/v1/cotas', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.MAGALU_BEARER_TOKEN}`,
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'Referer': 'https://newcon.consorciomagalu.tec.br/Newcon.AutoAtendimento.Web/atendimento/dashboard',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
        'x-kl-kis-ajax-request': 'Ajax_Request',
        'x-sessionid': '_brramfqlo',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Erro ao buscar cotas: ${response.status}` });
    }

    const rawData = await response.json();

    const transformed = flattenCotas(rawData);
    res.status(200).json(transformed);

  } catch (error) {
    console.error('Erro no handler /api/cotas:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}


function flattenCotas(apiResponse) {
  const cotas = [];

  for (const grupo of apiResponse) {
    const status = grupo.situacao;

    for (const cota of grupo.grupos) {
      cotas.push({
        status, // from parent object
        ...cota,
      });
    }
  }

  return cotas;
}