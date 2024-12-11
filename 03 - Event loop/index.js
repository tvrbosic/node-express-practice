/**
  --------------------------------< EVENT LOOP PHASES >--------------------------------
 
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘

   NOTE: process.nextTick is called after each phase of event loop.

   DETAILED DOCUMENTATION: https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
 */

const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 2;

setTimeout(() => console.log('Timer 1 finished'), 0);
setImmediate(() => console.log('Immediate 1 finished'));

fs.readFile('./assets/test-file.txt', () => {
  console.log('I/O finished');
  console.log('------------------------------------');
  setTimeout(() => console.log('Timer 2 finished'), 0);
  setTimeout(() => console.log('Timer 3 finished'), 3000);
  setImmediate(() => console.log('Immediate 2 finished'));

  process.nextTick(() => {
    console.log('Process.nextTick');
  });

  crypto.pbkdf2('password1', 'salt', 100000, 1024, 'sha512', () => {
    console.log('Password 1 encrypted!', Date.now() - start);
  });

  crypto.pbkdf2('password2', 'salt', 100000, 1024, 'sha512', () => {
    console.log('Password 2 encrypted!', Date.now() - start);
  });

  crypto.pbkdf2('password3', 'salt', 100000, 1024, 'sha512', () => {
    console.log('Password 3 encrypted!', Date.now() - start);
  });

  crypto.pbkdf2('password4', 'salt', 100000, 1024, 'sha512', () => {
    console.log('Password 4 encrypted!', Date.now() - start);
  });
});

console.log('Hello from the top-level code');
