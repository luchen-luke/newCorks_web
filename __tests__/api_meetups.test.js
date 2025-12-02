const fs = require('fs')
const path = require('path')

test('meetups API exists', ()=>{
  const p = path.join(__dirname, '..', 'pages', 'api', 'meetups.js')
  expect(fs.existsSync(p)).toBe(true)
})
