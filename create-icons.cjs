const fs = require('fs');
const path = require('path');

// Simple PNG creation without dependencies
// This creates a minimal valid PNG file with a solid color

function createPNG(width, height, color) {
  const channels = 4; // RGBA
  const pixelData = Buffer.alloc(width * height * channels);
  
  // Fill with color (RGB from hex)
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  
  for (let i = 0; i < pixelData.length; i += channels) {
    pixelData[i] = r;
    pixelData[i + 1] = g;
    pixelData[i + 2] = b;
    pixelData[i + 3] = 255; // Alpha
  }
  
  // Create PNG structure
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type (RGBA)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  
  const ihdrChunk = createChunk('IHDR', ihdr);
  
  // IDAT chunk (image data)
  const rows = [];
  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * channels);
    row[0] = 0; // filter type
    pixelData.copy(row, 1, y * width * channels, (y + 1) * width * channels);
    rows.push(row);
  }
  
  const imageData = Buffer.concat(rows);
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(imageData);
  const idatChunk = createChunk('IDAT', compressed);
  
  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const typeBuffer = Buffer.from(type, 'ascii');
  const crc = calculateCRC(Buffer.concat([typeBuffer, data]));
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);
  
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function calculateCRC(buffer) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buffer.length; i++) {
    crc ^= buffer[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create 192x192 icon
const icon192 = createPNG(192, 192, '#00dc82');
fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), icon192);
console.log('✓ Created icon-192x192.png');

// Create 512x512 icon
const icon512 = createPNG(512, 512, '#00dc82');
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), icon512);
console.log('✓ Created icon-512x512.png');

console.log('\nPNG icons created successfully!');
