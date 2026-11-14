/**
 * FarmDrop Sauces - Backend Test Suite
 * Tests all endpoints: status, products, chat, contact, orders, newsletter, error handling, CORS.
 */

const http = require('http');
const { app, server } = require('./server');

const BASE_URL = 'http://localhost:5000';

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n=============================================');
  console.log('🧪 Starting FarmDrop Sauces API Tests...');
  console.log('=============================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Server Status
    console.log('[1] Testing Server Status (/api/status)...');
    const statusRes = await makeRequest('GET', '/api/status');
    assert(statusRes.status === 200, 'Status code is 200 OK');
    assert(statusRes.data.status === 'online', 'Status is "online"');
    assert(statusRes.data.service.includes('FarmDrop'), 'Service name is FarmDrop Sauces');

    // 2. Products List
    console.log('\n[2] Testing Products API (/api/products)...');
    const productsRes = await makeRequest('GET', '/api/products');
    assert(productsRes.status === 200, 'Status code is 200 OK');
    assert(productsRes.data.success === true, 'Products response has success: true');
    assert(productsRes.data.count === 6, 'Products count is 6');
    assert(productsRes.data.data[0].name === 'Classic Tomato Ketchup', 'First product is Classic Tomato Ketchup');

    // 3. Single Product Lookup
    console.log('\n[3] Testing Single Product Lookup (/api/products/:id)...');
    const singleProduct = await makeRequest('GET', '/api/products/classic-tomato-ketchup');
    assert(singleProduct.status === 200, 'Status code is 200 OK');
    assert(singleProduct.data.data.id === 'classic-tomato-ketchup', 'Retrieved classic-tomato-ketchup');
    assert(singleProduct.data.data.price === 149, 'Price matches ₹149');

    // 4. Product 404
    console.log('\n[4] Testing Non-existent Product Lookup...');
    const notFoundProduct = await makeRequest('GET', '/api/products/unknown-sauce-123');
    assert(notFoundProduct.status === 404, 'Status code is 404 Not Found');
    assert(notFoundProduct.data.error === 'ProductNotFound', 'Error type is ProductNotFound');

    // 5. Chatbot Endpoint
    console.log('\n[5] Testing Chatbot (/api/chat)...');
    const chatGreet = await makeRequest('POST', '/api/chat', { message: 'Hello!' });
    assert(chatGreet.status === 200, 'Chat greeting status 200 OK');
    assert(chatGreet.data.reply.includes('Welcome to FarmDrop Sauces'), 'Chat greeting returns welcoming intro');

    const chatSpicy = await makeRequest('POST', '/api/chat', { message: 'Which sauce is the spiciest?' });
    assert(chatSpicy.status === 200, 'Chat spicy status 200 OK');
    assert(chatSpicy.data.reply.includes('Spicy Chilli Sauce'), 'Chat identifies Spicy Chilli Sauce as hottest');

    const chatNatural = await makeRequest('POST', '/api/chat', { message: 'Are your sauces natural and organic?' });
    assert(chatNatural.status === 200, 'Chat natural status 200 OK');
    assert(chatNatural.data.reply.includes('100% natural'), 'Chat explains 100% natural promise');

    const chatEmpty = await makeRequest('POST', '/api/chat', { message: '' });
    assert(chatEmpty.status === 400, 'Empty chat message returns 400 Bad Request');

    // 6. Contact Endpoint
    console.log('\n[6] Testing Contact Form (/api/contact)...');
    const contactValid = await makeRequest('POST', '/api/contact', {
      name: 'Rohan Verma',
      email: 'rohan@example.com',
      subject: 'Store Partnership',
      message: 'Hello, we would love to stock FarmDrop sauces in our organic grocery store!'
    });
    assert(contactValid.status === 201, 'Valid contact inquiry returns 201 Created');
    assert(contactValid.data.success === true, 'Contact submission returns success: true');
    assert(contactValid.data.inquiry.id.startsWith('INQ-'), 'Inquiry ID properly generated');

    const contactInvalid = await makeRequest('POST', '/api/contact', {
      name: 'Rohan',
      email: 'invalid-email-string',
      message: ''
    });
    assert(contactInvalid.status === 400, 'Invalid contact data returns 400 Bad Request');

    // 7. Orders Endpoint
    console.log('\n[7] Testing Orders API (/api/orders)...');
    const orderValid = await makeRequest('POST', '/api/orders', {
      customerName: 'Ananya Sharma',
      email: 'ananya@example.com',
      phone: '+91 98765 00000',
      shippingAddress: 'Flat 402, Green Acres, Pune 411001',
      items: [
        { productId: 'classic-tomato-ketchup', quantity: 2 },
        { productId: 'spicy-chilli-sauce', quantity: 1 }
      ],
      notes: 'Please pack in eco-friendly gift box'
    });
    assert(orderValid.status === 201, 'Valid order returns 201 Created');
    assert(orderValid.data.order.items.length === 2, 'Order contains 2 line items');
    // 149*2 + 179 = 298 + 179 = 477. Below 499 so shipping is 50 -> total = 527
    assert(orderValid.data.order.subtotal === 477, 'Subtotal correctly calculated (₹477)');
    assert(orderValid.data.order.shippingFee === 50, 'Shipping fee applied for subtotal < ₹499 (₹50)');
    assert(orderValid.data.order.totalAmount === 527, 'Total amount correctly calculated (₹527)');

    // 8. Newsletter Endpoint
    console.log('\n[8] Testing Newsletter Subscription (/api/newsletter)...');
    const newsletterValid = await makeRequest('POST', '/api/newsletter', { email: 'subscriber@example.com' });
    assert(newsletterValid.status === 201, 'Valid newsletter returns 201 Created');
    assert(newsletterValid.data.success === true, 'Newsletter subscription succeeds');

    // 9. CORS Preflight
    console.log('\n[9] Testing CORS Headers...');
    const corsPreflight = await makeRequest('OPTIONS', '/api/products', null, {
      'Origin': 'https://farm-drop-sauces.pages.dev',
      'Access-Control-Request-Method': 'GET'
    });
    assert(corsPreflight.headers['access-control-allow-origin'] !== undefined, 'CORS Access-Control-Allow-Origin header present');

    console.log('\n=============================================');
    console.log(`🎉 TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
    console.log('=============================================\n');

  } catch (error) {
    console.error('Test execution error:', error);
    failed++;
  } finally {
    server.close(() => {
      console.log('Test server closed.');
      process.exit(failed > 0 ? 1 : 0);
    });
  }
}

runTests();
