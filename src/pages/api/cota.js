//      pages/api/cota.js

export default async function handler(req, res) {
  const { cota } = req.query;

  if (!cota) {
    return res.status(400).json({ error: 'Parâmetro "cota" é obrigatório.' });
  }

  const baseURL = 'https://newcon.consorciomagalu.tec.br/Newcon.AutoAtendimento.Gateway/autoatendimento/v1/cotas';
  const headers = {
    'Authorization': `Bearer ${process.env.MAGALU_BEARER_TOKEN}`, // ✅ configure no .env.local
    'x-kl-kis-ajax-request': 'Ajax_Request',
    'User-Agent': 'Mozilla/5.0',
    Accept: '*/*',
  };

  try {
    const [consorciadoRes, receberRes, devolverRes] = await Promise.all([
      fetch(`${baseURL}/${cota}/dashboard/consorciado`, { headers }),
      fetch(`${baseURL}/${cota}/dashboard/valores-receber`, { headers }),
      fetch(`${baseURL}/${cota}/encerramentos/valores-devolver`, { headers }),
    ]);

    if (!consorciadoRes.ok || !receberRes.ok || !devolverRes.ok) {
      return res.status(500).json({
        error: 'Erro em uma ou mais requisições',
        statuses: {
          consorciado: consorciadoRes.status,
          valoresReceber: receberRes.status,
          valoresDevolver: devolverRes.status,
        },
      });
    }

    const [consorciado, valoresReceber, valoresDevolver] = await Promise.all([
      consorciadoRes.json(),
      receberRes.json(),
      devolverRes.json(),
    ]);

    return res.status(200).json({
      cota,
      consorciado,
      valoresReceber,
      valoresDevolver,
    });

  } catch (err) {
    console.error('Erro na rota /api/cota:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}
