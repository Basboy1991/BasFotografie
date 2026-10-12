type ArchiveFile={name:string;body:ReadableStream<Uint8Array>};
const encoder=new TextEncoder();
const crcTable=Uint32Array.from({length:256},(_,n)=>{let value=n;for(let i=0;i<8;i++)value=value&1?0xedb88320^(value>>>1):value>>>1;return value>>>0;});
const view=(size:number)=>{const bytes=new Uint8Array(size);return {bytes,data:new DataView(bytes.buffer)};};

// ZIP32 with stored (uncompressed) files and data descriptors, so R2 photos stream without buffering an album in memory.
export async function* createZip(files:ArchiveFile[]):AsyncGenerator<Uint8Array>{
 const directory:Uint8Array[]=[];let offset=0;
 for(const file of files){
  const name=encoder.encode(file.name);if(name.length>65535)throw new Error('Bestandsnaam te lang.');
  const start=offset,local=view(30+name.length);
  local.data.setUint32(0,0x04034b50,true);local.data.setUint16(4,20,true);local.data.setUint16(6,0x0808,true);local.data.setUint16(8,0,true);local.data.setUint16(26,name.length,true);local.bytes.set(name,30);
  offset+=local.bytes.length;yield local.bytes;
  let crc=0xffffffff,size=0;const reader=file.body.getReader();
  try{while(true){const {done,value}=await reader.read();if(done)break;for(const byte of value)crc=crcTable[(crc^byte)&255]^(crc>>>8);size+=value.length;if(size>0xffffffff)throw new Error('Foto te groot voor ZIP32.');offset+=value.length;yield value;}}finally{reader.releaseLock();}
  crc=(crc^0xffffffff)>>>0;
  const descriptor=view(16);descriptor.data.setUint32(0,0x08074b50,true);descriptor.data.setUint32(4,crc,true);descriptor.data.setUint32(8,size,true);descriptor.data.setUint32(12,size,true);offset+=16;yield descriptor.bytes;
  const record=view(46+name.length);record.data.setUint32(0,0x02014b50,true);record.data.setUint16(4,20,true);record.data.setUint16(6,20,true);record.data.setUint16(8,0x0808,true);record.data.setUint32(16,crc,true);record.data.setUint32(20,size,true);record.data.setUint32(24,size,true);record.data.setUint16(28,name.length,true);record.data.setUint32(42,start,true);record.bytes.set(name,46);directory.push(record.bytes);
 }
 const directoryStart=offset;
 for(const record of directory){offset+=record.length;yield record;}
 if(offset>0xffffffff)throw new Error('Album te groot voor ZIP32.');
 const end=view(22);end.data.setUint32(0,0x06054b50,true);end.data.setUint16(8,directory.length,true);end.data.setUint16(10,directory.length,true);end.data.setUint32(12,offset-directoryStart,true);end.data.setUint32(16,directoryStart,true);yield end.bytes;
}
