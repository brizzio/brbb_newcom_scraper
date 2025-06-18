// src/pages/index.js

import { useState } from 'react';

function convertToCSV(data) {
  if (!data || !data.length) return '';
  const header = Object.keys(data[0]).join(';');
  const rows = data.map(obj =>
    Object.values(obj)
      .map(val => (val !== null && val !== undefined ? String(val).replace(/;/g, ',') : ''))
      .join(';')
  );
  return [header, ...rows].join('\n');
}

function downloadCSV(data, filename = 'cotas.csv') {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Home() {
  const [cotas, setCotas] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [token, setToken] = useState('');

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const listarCotas = async () => {
    setLoading(true);
    setErro(null);
    setResultados([]);

    try {
      const res = await fetch('/api/cotas', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data = await res.json();
      setCotas(data);

      const resultadosTemp = [];
      for (const item of data) {
        const quotaRes = await fetch(`/api/quota?cota=${item.idCota}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (quotaRes.ok) {
          const quotaData = await quotaRes.json();
          resultadosTemp.push(quotaData);
          setResultados([...resultadosTemp]);
        }
        await delay(100); // 100ms entre cada requisição
      }
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 font-sans bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Consulta de Cotas</h1>
       <textarea
        placeholder="Cole aqui o Bearer Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="w-full p-2 mb-4 border rounded text-xs font-mono h-24"
      />
    
      <button
        onClick={listarCotas}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Listar todas as cotas
      </button>

      {resultados.length > 0 && (
        <button
          onClick={() => downloadCSV(resultados)}
          className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Baixar CSV
        </button>
      )}

      {loading && (
        <p className="mt-4">
          🔄 Processando... ({resultados.length}/{cotas.length})
        </p>
      )}
      {erro && <p className="mt-4 text-red-600">❌ Erro: {erro}</p>}

      {resultados.length > 0 && (
        <div className="grid grid-cols-1 gap-2 mt-6">
          {resultados.slice(-1).map((r, idx) => (
            <div
              key={idx}
              className="bg-white min-w-full p-4 rounded shadow border border-gray-800"
            >
              <pre className="text-[0.75rem] w-full whitespace-pre-wrap break-words">
                {JSON.stringify(r, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
