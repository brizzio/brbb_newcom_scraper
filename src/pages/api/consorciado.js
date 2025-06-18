// pages/api/consorciado.js
export default async function handler(req, res) {
  const { cota } = req.query;

  if (!cota) {
    return res.status(400).json({ error: 'Número da cota não informado' });
  }

  const MAGALU_URL = `https://newcon.consorciomagalu.tec.br/Newcon.AutoAtendimento.Gateway/autoatendimento/v1/cotas/${cota}/extrato`;

  try {
    const response = await fetch(MAGALU_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.MAGALU_BEARER_TOKEN}`,
        'x-sessionid': '_yudzua6ti',
        'x-kl-kis-ajax-request': 'Ajax_Request',
        'Referer': 'https://newcon.consorciomagalu.tec.br/Newcon.AutoAtendimento.Web/atendimento/consulta-extrato',
        'User-Agent': 'Mozilla/5.0',
        'Accept': '*/*'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: `Erro da Magalu: ${text}` });
    }

    console.log(response)
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Erro no proxy:', error);
    res.status(500).json({ error: 'Erro interno ao acessar a API da Magalu' });
  }
}
