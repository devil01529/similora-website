import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source = readFileSync(new URL('../standalone/initials-workspace.js', import.meta.url), 'utf8');
const id = 'a'.repeat(32);
for (const expected of [undefined, id]) {
  const events = {};
  let redirected = false;
  const button = {cloneNode(){return {}}, replaceWith(){}};
  const context = {
    window:{OR:{hooks:{casesChanged:[],start:[]}},ORWebsiteAccount:expected},
    document:{getElementById:()=>button,body:{style:{}},addEventListener(){}},
    location:{replace(){redirected=true}}, AbortSignal,
    fetch:async()=>Response.json({id,status:'approved',role:'member'}),
    addEventListener:(name,fn)=>events[name]=fn,setInterval(){}
  };
  vm.runInNewContext(source,context);
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(redirected,!expected,'Approval must match an identified workspace');
  assert.equal(typeof events.offline,'function','Disconnect must block the open workspace');
}

// Reproduce an offline event while the server's previous approved response is in flight.
const listeners = {};
const status = {};
const controls = {cloneNode(){return {}}, replaceWith(){}};
const dialog = {
  open:false, setAttribute(){}, addEventListener(){}, querySelector:()=>controls,
  showModal(){this.open=true}, close(){this.open=false}
};
let resolveCheck;
const runtime = {
  window:{OR:{hooks:{casesChanged:[],start:[]}},ORWebsiteAccount:id},
  document:{body:{append(){}}, getElementById:name=>name==='connectionStatus'?status:controls,
    createElement:()=>dialog, addEventListener(){}},
  fetch:()=>new Promise(resolve=>{resolveCheck=resolve}), AbortSignal,
  addEventListener:(name,fn)=>listeners[name]=fn, setInterval(){}
};
vm.runInNewContext(source,runtime);
listeners.offline();
assert.ok(dialog.open);
resolveCheck(Response.json({id,status:'approved',role:'member'}));
await new Promise(resolve=>setImmediate(resolve));
assert.ok(dialog.open,'Stale response must not unlock an offline workspace');
runtime.fetch=async()=>{throw Error('Synthetic connection failure')};
await listeners.focus();
assert.ok(dialog.open);
runtime.fetch=async()=>Response.json({id,status:'approved',role:'member'});
await listeners.online();
assert.equal(dialog.open,false);
