import { useState } from 'react';
import ConsultaCotaPage from './consulta-cota';

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
  const [cota, setCota] = useState('');
  const [result, setResult] = useState(null);
  const [cotas, setCotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!cota) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/consorciado?cota=${cota}`);
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCotas = async () => {
    setLoading(true);
    setError(null);
    setCotas([]);
    try {
      const res = await fetch('/api/cotas');
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data = await res.json();
      setCotas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='text-balance'
    style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Consulta de Cota Magalu</h1>
      <input
        placeholder="Número da cota"
        value={cota}
        onChange={(e) => setCota(e.target.value)}
         className='text-balance'
      />
      <button onClick={fetchData} style={{ marginLeft: 8, padding: 8 }}>
        Consultar
      </button>

      <button onClick={fetchCotas} style={{ marginLeft: 16, padding: 8 }}>
        Listar todas as cotas
      </button>

      {loading && <p style={{ marginTop: 20 }}>🔄 Carregando...</p>}
      {error && (
        <p style={{ marginTop: 20, color: 'red' }}>❌ Erro: {error}</p>
      )}
      
      {result && (
        <pre className='mt-4 text-black bg-blue-50'>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

      {cotas.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2>📋 Cotas encontradas: {cotas.length}</h2>
          <button
            onClick={() => downloadCSV(cotas)}
            style={{ marginTop: 10, padding: 8, backgroundColor: '#4caf50', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            Baixar CSV
          </button>
          <ul>
            {cotas.slice(0, 20).map((item, index) => (
              <li key={index}>
                <strong>cota:{item.cota}</strong> - ID:{item.idCota}
              </li>
            ))}
          </ul>
        </div>
      )}
      <ConsultaCotaPage/>
    </div>
  );
}
