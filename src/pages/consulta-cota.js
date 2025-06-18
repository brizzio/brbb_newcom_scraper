import { useState } from 'react';
import {flattenObject} from '../utils'
export default function ConsultaCotaPage() {
  const [cota, setCota] = useState('');
  const [data, setData] = useState(null);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);

  const consultarCota = async () => {
    if (!cota) return;
    setErro(null);
    setLoading(true);
    setData(null);

    try {
      const res = await fetch(`/api/cota?cota=${cota}`);
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='text-balance'
    style={{ padding: 20, fontFamily: 'sans-serif'}}>
      <h1>🔍 Consulta Consolidada de Cota</h1>

      <input
        type="text"
        placeholder="Número da cota"
        value={cota}
        onChange={(e) => setCota(e.target.value)}
        className='text-balance'
      />
      <button onClick={consultarCota} style={{ marginLeft: 10, padding: 8 }}>
        Consultar
      </button>

      {loading && <p style={{ marginTop: 20 }}>⏳ Carregando...</p>}
      {erro && <p style={{ marginTop: 20, color: 'red' }}>❌ {erro}</p>}

      {data && (
        <div className='text-balance'>
          <h2>📄 Cota: {data.cota}</h2>

          <section className='text-black' style={{ background: '#f0f0f0', padding: 16, marginBottom: 20 }}>
            <h3>👤 Consorciado</h3>
            <pre>{JSON.stringify(flattenObject(data.consorciado), null, 2)}</pre>
          </section>

          <section className='text-black' style={{ background: '#e0f7fa', padding: 16, marginBottom: 20 }}>
            <h3>💰 Valores a Receber</h3>
            <pre>{JSON.stringify(data.valoresReceber, null, 2)}</pre>
          </section>

          <section className='text-black' style={{ background: '#fce4ec', padding: 16 }}>
            <h3>🔁 Valores a Devolver</h3>
            <pre>{JSON.stringify(data.valoresDevolver, null, 2)}</pre>
          </section>
        </div>
      )}
    </div>
  );
}
