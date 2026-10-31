'use client';

import {useState} from 'react';
import {visualPages} from '../visual-fields';

const sizes = [[320, 'Kleine telefoon'], [390, 'Telefoon'], [430, 'Grote telefoon'], [768, 'Tablet'], [1440, 'Desktop']] as const;

export default function DeviceReview() {
  const [path, setPath] = useState('/');
  const [width, setWidth] = useState(390);
  const [loading, setLoading] = useState(true);
  return <div className="device-review">
    <div className="device-review-controls">
      <label>Pagina<select value={path} onChange={event => {setLoading(true); setPath(event.target.value);}}>
        {visualPages.map(page => <option key={page.path} value={page.path}>{page.label}</option>)}
      </select></label>
      <label>Schermformaat<select value={width} onChange={event => setWidth(Number(event.target.value))}>
        {sizes.map(([value, label]) => <option key={value} value={value}>{label} · {value} px</option>)}
      </select></label>
      <a className="text-link" href={path} target="_blank" rel="noopener noreferrer">Open pagina ↗</a>
    </div>
    <p className="device-review-status" role="status">{loading ? 'Pagina laden…' : `Voorbeeld op ${width} pixels breed. Links en het menu werken ook in dit voorbeeld.`}</p>
    <div className="device-review-stage">
      <iframe className="device-review-frame" title="Websitevoorbeeld" src={path} style={{width}} onLoad={() => setLoading(false)}/>
    </div>
  </div>;
}
