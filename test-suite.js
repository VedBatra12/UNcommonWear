async function runTests() {
  const base = 'http://localhost:3001';
  let passed = 0;
  let failed = 0;

  function assert(cond, msg) {
    if (cond) {
      console.log('✅ PASS:', msg);
      passed++;
    } else {
      console.error('❌ FAIL:', msg);
      failed++;
    }
  }

  try {
    // 1. Public /designs page
    const rDesigns = await fetch(base + '/designs');
    const htmlDesigns = await rDesigns.text();
    assert(rDesigns.status === 200, 'GET /designs returns 200');
    assert(htmlDesigns.includes('UNCommon weaR'), 'Contains brand title');
    assert(htmlDesigns.includes('Created by you. Crafted by us.'), 'Contains tagline');
    assert(htmlDesigns.includes('Find something that feels like you.'), 'Contains subline');
    assert(htmlDesigns.includes('searchInput'), 'Contains search input');
    assert(htmlDesigns.includes('data-category="GEN-Z"'), 'Contains category chips');

    // 2. Direct design page /design/UW-047
    const rD47Page = await fetch(base + '/design/UW-047');
    assert(rD47Page.status === 200, 'GET /design/UW-047 returns 200');

    // 3. Admin page /admin
    const rAdmin = await fetch(base + '/admin');
    const htmlAdmin = await rAdmin.text();
    assert(rAdmin.status === 200, 'GET /admin returns 200');
    assert(htmlAdmin.includes('Cart Staff Portal'), 'Contains staff PIN lock');
    assert(htmlAdmin.includes('Bulk Artwork Image Upload'), 'Contains bulk upload UI');
    assert(htmlAdmin.includes('Permanent Cart QR Generator'), 'Contains QR studio');

    // 4. API /api/designs list & count
    const rList = await fetch(base + '/api/designs?limit=24').then(r => r.json());
    assert(rList.total >= 100, `Has 100+ designs (total: ${rList.total})`);
    assert(rList.designs.length === 24, 'Initial batch loads 24 designs');
    assert(rList.hasMore === true, 'hasMore is true for infinite scrolling');

    // 5. Search by code & keyword
    const rSearchIntro = await fetch(base + '/api/designs?search=introvert').then(r => r.json());
    assert(rSearchIntro.designs.some(d => d.code === 'UW-047' && d.name.includes('INTROVERT')), 'Search "introvert" finds UW-047 INTROVERT MODE');

    const rSearchCode = await fetch(base + '/api/designs?search=UW-047').then(r => r.json());
    assert(rSearchCode.designs.length === 1 && rSearchCode.designs[0].code === 'UW-047', 'Search "UW-047" finds exact design');

    // 6. Category filter
    const rCat = await fetch(base + '/api/designs?category=MINIMAL').then(r => r.json());
    assert(rCat.designs.length > 0 && rCat.designs.every(d => d.category === 'MINIMAL'), 'Category filter returns only MINIMAL designs');

    // 7. Copy code trigger
    const rCopy = await fetch(base + '/api/designs/UW-047/copy', { method: 'POST' }).then(r => r.json());
    assert(rCopy.ok === true, 'POST /api/designs/UW-047/copy records intent');

    // 8. Admin Auth
    const rPinFail = await fetch(base + '/api/admin/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: '9999' })
    });
    assert(rPinFail.status === 401, 'Rejects wrong PIN');

    const rPinPass = await fetch(base + '/api/admin/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: '1337' })
    });
    assert(rPinPass.status === 200, 'Accepts default staff PIN 1337');

    // 9. QR Code SVG & PNG
    const rQrSvg = await fetch(base + '/api/qr?format=svg');
    const svgText = await rQrSvg.text();
    assert(rQrSvg.status === 200 && svgText.includes('<svg'), 'QR SVG generates valid XML');

    const rQrPng = await fetch(base + '/api/qr?format=png');
    assert(rQrPng.status === 200 && rQrPng.headers.get('content-type') === 'image/png', 'QR PNG generates valid image');

    // 10. Admin Export CSV
    const rCsv = await fetch(base + '/api/admin/export-csv?pin=1337');
    const csvData = await rCsv.text();
    assert(rCsv.status === 200 && csvData.includes('Code,Name,Category'), 'Admin CSV export contains valid design data');

    console.log('\n======================================');
    console.log(`ALL TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED`);
    console.log('======================================');
  } catch (err) {
    console.error('Test execution error:', err);
  }
}

runTests();
