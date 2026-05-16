import { File } from 'lucide-react';

export default function Documents() {
  return (
    <div>
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>Documentos</h1>
          <p style={{ color: 'var(--text-muted)' }}>Gerencie contratos e arquivos.</p>
        </div>
      </header>

      <div style={{
        padding: '60px 20px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)'
        }}>
          <File size={40} strokeWidth={1} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>Nenhum documento encontrado</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '300px', margin: '0 auto' }}>Ainda não há arquivos ou pastas configurados nesta seção.</p>
        </div>
      </div>
    </div>
  );
}
