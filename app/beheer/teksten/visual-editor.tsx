'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {saveVisualContents} from '../../actions';
import {contentLimits, parseContentChanges} from '../../content-validation';
import {visualPages, type ContentKey} from '../../visual-fields';

type Props = {initial: Record<ContentKey, string>};

export default function VisualEditor({initial}: Props) {
  const [path, setPath] = useState('/');
  const [selected, setSelected] = useState<ContentKey>('homeHeroTop');
  const [values, setValues] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [device, setDevice] = useState<'desktop' | 'mobiel'>('desktop');
  const [message, setMessage] = useState('');
  const [leaving, setLeaving] = useState<string | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const skipGuard = useRef(false);
  const router = useRouter();
  const page = visualPages.find(item => item.path === path) || visualPages[0];
  const chosen = page.fields.find(field => field[0] === selected);
  const keys = Object.keys(values) as ContentKey[];
  const dirtyKeys = keys.filter(key => values[key] !== saved[key]);
  const hasChanges = dirtyKeys.length > 0;
  const limits = contentLimits(selected);
  const invalidKeys = dirtyKeys.filter(key => {
    const {min, max} = contentLimits(key);
    return values[key].trim().length < min || values[key].trim().length > max;
  });
  const currentInvalid = invalidKeys.includes(selected);
  const dirty = values[selected] !== saved[selected];

  const send = useCallback((data: object) => {
    frame.current?.contentWindow?.postMessage(data, location.origin);
  }, []);
  const pick = useCallback((key: ContentKey) => {
    setSelected(key);
    setMessage('');
    send({type: 'bas-editor:scroll', key});
  }, [send]);

  useEffect(() => {
    function receive(event: MessageEvent<{type?: string; key?: string}>) {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === 'bas-editor:ready') {
        send({type: 'bas-editor:update', values, selected});
      }
      if (event.data?.type === 'bas-editor:select' && page.fields.some(field => field[0] === event.data.key)) {
        pick(event.data.key as ContentKey);
      }
    }
    window.addEventListener('message', receive);
    send({type: 'bas-editor:update', values, selected});
    return () => window.removeEventListener('message', receive);
  }, [page, values, selected, send, pick]);

  useEffect(() => {
    if (!hasChanges) return;
    function beforeUnload(event: BeforeUnloadEvent) {
      if (skipGuard.current) return;
      event.preventDefault();
      event.returnValue = '';
    }
    function followLink(event: MouseEvent) {
      if (skipGuard.current || !(event.target instanceof Element)) return;
      const link = event.target.closest('a');
      if (!link || link.target === '_blank' || !['http:', 'https:'].includes(link.protocol)) return;
      const url = new URL(link.href);
      if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search) return;
      event.preventDefault();
      event.stopPropagation();
      setLeaving(link.href);
    }
    window.addEventListener('beforeunload', beforeUnload);
    document.addEventListener('click', followLink, true);
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      document.removeEventListener('click', followLink, true);
    };
  }, [hasChanges]);

  useEffect(() => {if (leaving && !dialog.current?.open) dialog.current?.showModal();}, [leaving]);

  async function save(changed: ContentKey[]) {
    if (saving || !changed.length) return false;
    const changes = Object.fromEntries(changed.map(key => [key, values[key]]));
    try { parseContentChanges(changes); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Controleer je teksten.'); return false; }
    setSaving(true);
    setMessage('');
    try {
      const clean = await saveVisualContents(changes);
      setValues(current => ({...current, ...clean}));
      setSaved(current => ({...current, ...clean}));
      setMessage(`${changed.length === 1 ? 'De tekst is' : `${changed.length} teksten zijn`} opgeslagen en zichtbaar op de website.`);
      return true;
    } catch {
      setMessage('Opslaan is niet gelukt. Je wijzigingen staan nog in dit voorbeeld. Controleer je verbinding of meld je opnieuw aan.');
      return false;
    } finally { setSaving(false); }
  }

  function leave() {
    if (!leaving) return;
    skipGuard.current = true;
    const url = new URL(leaving);
    if (url.origin === location.origin) router.push(url.pathname + url.search + url.hash);
    else window.location.assign(url.href);
  }
  function selectInvalid() {
    const key = invalidKeys[0];
    if (!key) return;
    const matchingPage = visualPages.find(item => item.fields.some(field => field[0] === key));
    if (matchingPage) setPath(matchingPage.path);
    pick(key);
  }

  return <div className="visual-editor">
    <div className="visual-editor-toolbar">
      <label htmlFor="visual-page">Pagina</label>
      <select id="visual-page" value={path} disabled={saving} onChange={event => {
        const next = visualPages.find(item => item.path === event.target.value)!;
        setPath(next.path); setSelected(next.fields[0][0]); setMessage('');
      }}>{visualPages.map(item => <option key={item.path} value={item.path}>{item.label}</option>)}</select>
      <div className="visual-device" aria-label="Voorbeeldformaat">
        <button type="button" aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')}>Desktop</button>
        <button type="button" aria-pressed={device === 'mobiel'} onClick={() => setDevice('mobiel')}>Mobiel</button>
      </div>
      <Link href="/voorbeeld" target="_blank" className="text-link">Alle schermformaten ↗</Link>
      <Link href="/beheer/blokken" className="text-link">Blokken verplaatsen ↗</Link>
      <Link href="/beheer/teksten/lijst" className="text-link">Alle teksten als lijst ↗</Link>
    </div>
    <div className="visual-editor-grid">
      <div className="visual-editor-panel">
        <h2>Tekst aanpassen</h2>
        <p>Kies een tekst in het voorbeeld. Je kunt meerdere teksten en pagina’s aanpassen en daarna alles samen opslaan.</p>
        <div className="visual-field-list">{page.fields.map(([key, label]) => <button type="button" key={key} disabled={saving} className={`${selected === key ? 'active' : ''}${invalidKeys.includes(key) ? ' is-invalid' : ''}`} onClick={() => pick(key)}>
          {label}{values[key] !== saved[key] && <span aria-label="Niet opgeslagen"> •</span>}
        </button>)}</div>
        {chosen && <div className="visual-edit-form">
          <label htmlFor="visual-text">{chosen[1]}</label>
          <textarea id="visual-text" value={values[selected]} disabled={saving} aria-invalid={currentInvalid} aria-describedby="visual-text-limits" minLength={limits.min} maxLength={limits.max} onChange={event => {setValues(current => ({...current, [selected]: event.target.value})); setMessage('');}}/>
          <p id="visual-text-limits" className={`visual-save-note${currentInvalid ? ' is-invalid' : ''}`}>{values[selected].trim().length} tekens · gebruik {limits.min}–{limits.max} tekens.</p>
          <p className="visual-save-note">{dirty ? 'Deze tekst is nog niet opgeslagen.' : 'Deze tekst staat op de website.'}</p>
          <div className="visual-edit-actions">
            <button type="button" className="button" disabled={!dirty || saving || currentInvalid} onClick={() => save([selected])}>{saving ? 'Opslaan…' : 'Deze tekst opslaan'}</button>
            {dirty && <button type="button" className="quiet-button" disabled={saving} onClick={() => {setValues(current => ({...current, [selected]: saved[selected]})); setMessage('');}}>Wijziging terugzetten</button>}
          </div>
        </div>}
        {message && <p className="visual-message" role="status">{message}</p>}
        <p className="visual-more">Foto’s en de openingsfoto beheer je bij <Link href="/beheer/portfolio">Portfolio</Link>, prijzen bij <Link href="/beheer/tarieven">Tarieven</Link> en vragen bij <Link href="/beheer/faq">FAQ</Link>. De vindbaarheid beheer je bij <Link href="/beheer/seo">SEO</Link>.</p>
      </div>
      <div className={`visual-preview ${device === 'mobiel' ? 'is-mobile' : ''}`}>
        <div className="visual-preview-bar"><span>{device === 'mobiel' ? 'Mobiel voorbeeld · 390 px' : 'Voorbeeld van de website'}</span><Link href={path} target="_blank" rel="noopener noreferrer">Open pagina ↗</Link></div>
        <iframe key={path} ref={frame} src={`${path}?editorPreview=1`} title={`Voorbeeld: ${page.label}`}/>
      </div>
    </div>
    <div className="visual-save-all" aria-live="polite">
      <div><strong>{hasChanges ? `${dirtyKeys.length} ${dirtyKeys.length === 1 ? 'tekst' : 'teksten'} gewijzigd` : 'Alle teksten zijn opgeslagen'}</strong><p>{hasChanges ? 'Ook wijzigingen op andere pagina’s worden meegenomen.' : 'Klik op een tekst om verder te bewerken.'}</p></div>
      {invalidKeys.length > 0 && <button type="button" className="text-link" onClick={selectInvalid}>Controleer {invalidKeys.length} {invalidKeys.length === 1 ? 'tekst' : 'teksten'}</button>}
      <button type="button" className="button" disabled={!hasChanges || saving || invalidKeys.length > 0} onClick={() => save(dirtyKeys)}>{saving ? 'Alles opslaan…' : 'Alles opslaan'}</button>
    </div>
    {leaving && <dialog ref={dialog} className="cms-dialog" aria-labelledby="unsaved-title" aria-describedby="unsaved-description" onCancel={() => setLeaving(null)}>
      <h2 id="unsaved-title">Je hebt nog wijzigingen.</h2><p id="unsaved-description">Sla je teksten op voordat je deze pagina verlaat, of ga verder zonder deze wijzigingen.</p>
      <div className="cms-dialog-actions"><button className="button" type="button" disabled={saving || invalidKeys.length > 0} onClick={async () => {if (await save(dirtyKeys)) leave();}}>Alles opslaan en verder</button><button type="button" className="quiet-button" disabled={saving} onClick={leave}>Verlaten zonder opslaan</button><button type="button" className="quiet-button" disabled={saving} onClick={() => setLeaving(null)} autoFocus>Blijven bewerken</button></div>
    </dialog>}
  </div>;
}
