'use client';
import {useEffect} from 'react';

type EditorMessage={type:string;values?:Record<string,string>;selected?:string|null;key?:string};
export default function VisualPreviewBridge(){useEffect(()=>{
 if(window.parent===window||new URLSearchParams(location.search).get('editorPreview')!=='1')return;
 let style:HTMLStyleElement|null=null;
 function update(values:Record<string,string>,selected:string|null){for(const element of document.querySelectorAll('[data-edit-key]')){const key=element.getAttribute('data-edit-key');if(!key)continue;if(Object.hasOwn(values,key))element.textContent=values[key];element.classList.toggle('visual-selected',key===selected);}}
 function click(event:MouseEvent){const target=event.target;if(!(target instanceof Element))return;const marked=target.closest('[data-edit-key]');if(marked){event.preventDefault();event.stopPropagation();window.parent.postMessage({type:'bas-editor:select',key:marked.getAttribute('data-edit-key')},location.origin);return;}if(target.closest('a,button,summary')){event.preventDefault();event.stopPropagation();}}
 function submit(event:SubmitEvent){event.preventDefault();}
 function activate(){if(style)return;style=document.createElement('style');style.textContent='[data-edit-key]{cursor:pointer;outline:2px dashed transparent;outline-offset:5px}[data-edit-key]:hover{outline-color:#926c4b!important}[data-edit-key].visual-selected{outline:2px solid #926c4b!important;background:rgba(225,204,174,.22)}';document.head.appendChild(style);document.addEventListener('click',click,true);document.addEventListener('submit',submit,true);}
 function receive(event:MessageEvent<EditorMessage>){if(event.origin!==location.origin||event.source!==window.parent||!event.data||typeof event.data.type!=='string')return;const data=event.data;if(data.type==='bas-editor:update'&&data.values){activate();update(data.values,data.selected||null);}if(data.type==='bas-editor:scroll'&&style&&data.key)document.querySelector(`[data-edit-key="${data.key}"]`)?.scrollIntoView({behavior:'smooth',block:'center'});}
 window.addEventListener('message',receive);window.parent.postMessage({type:'bas-editor:ready'},location.origin);
 return()=>{window.removeEventListener('message',receive);document.removeEventListener('click',click,true);document.removeEventListener('submit',submit,true);style?.remove();};
},[]);return null;}
