  var url = 'http://www.biteme.com';
  var data = 'Hello, ';

  var obj = {
    url: url
  };

  var body = 'body';
  var dataSize = data.length;
  var blockSize = Math.pow(2,5) - 1;

  var blocks = Math.floor( dataSize / blockSize );
  console.log('dataSize: ', dataSize, 'blocks: ', blocks, 'blockSize: ', blockSize);

  for(var block = 0; block < blocks; block++) {
    obj[ 'body' + (block+1) ] = data.slice(block*blockSize, (block + 1) * blockSize);
  }
  if (block) {
    console.log('block is ', block);
    obj[ 'body' + (block + 1)] = data.slice(block * blockSize);
  } else {
    obj[ 'body1' ] = data;
  }

console.log(obj);
