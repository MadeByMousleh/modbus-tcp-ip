// // create an empty modbus client
// var ModbusRTU = require("modbus-serial");
// var client = new ModbusRTU();

// // open connection to a tcp line
// client.connectTCP("127.0.0.1");
// client.setID(1);

// // read the values of 10 registers starting at address 0
// // on device number 1. and log the values to the console.
// setInterval(function () {
//     client.readHoldingRegisters(0, 2, function (err, data) {
//         client.reportServerID(2);
//         console.log(data.data);
//     });
// }, 1000);


// const net = require('net');

// const MODBUS_TCP_PORT = 502;
// const MODBUS_TCP_HOST = 'localhost';

// const client = new net.Socket();

// client.connect(MODBUS_TCP_PORT, MODBUS_TCP_HOST, () => {
//     console.log('Connected to Modbus TCP server');

//     // Modbus TCP Read Holding Registers request
//     const request = Buffer.from([0x00, 0x01, 0x00, 0x00, 0x00, 0x06, 0x01, 0x03, 0x00, 0x00, 0x00, 0x01]);

//     client.write(request);
// });

// client.on('data', data => {
//     // Parse the Modbus TCP response
//     console.log('Received data:', data);
//     client.end();
// });

// client.on('end', () => {
//     console.log('Disconnected from Modbus TCP server');
// });


//
//[]


// const net = require('net');

// const MODBUS_TCP_PORT = 502;
// const MODBUS_TCP_HOST = 'localhost';

// const client = new net.Socket();

// client.connect(MODBUS_TCP_PORT, MODBUS_TCP_HOST, () => {
//     console.log('Connected to Modbus TCP server');

//     // Modbus TCP Read Holding Registers request with MBAP header
//     const transactionId = 0x1234; // Random transaction ID
//     const protocolId = 0;
//     const unitId = 1;
//     const pdu = Buffer.from([0x01, 0x03, 0x00, 0x00, 0x00, 0x01]);

//     const requestLength = pdu.length + 1; // Including unit ID
//     const requestHeader = Buffer.from([
//         transactionId >> 8, transactionId & 0xFF,
//         protocolId >> 8, protocolId & 0xFF,
//         requestLength >> 8, requestLength & 0xFF,
//         unitId
//     ]);

//     const request = Buffer.concat([requestHeader, pdu]);

//     client.write(request);
// });

// client.on('data', data => {
//     // Extract data from the Modbus TCP response
//     // (Assuming a valid response for simplicity)
//     const responseData = data.slice(9);
//     console.log('Received data:', responseData);
//     client.end();
// });

// client.on('end', () => {
//     console.log('Disconnected from Modbus TCP server');
// });


// const net = require('net');

// const client = new net.Socket();
// const host = '127.0.0.1'; // Server IP
// const port = 502;        // Modbus TCP port

// // Read Holding Registers (to read "Mohammed")
// const functionCode = 0x03; // Function Code for Read Holding Registers
// const startAddress = 0x0000;
// const quantity = 0x0008; // Number of registers (one for each character)

// // Constructing MBAP Header
// const transactionId = Buffer.from([0x00, 0x01]); // Unique Transaction ID
// const protocolId = Buffer.from([0x00, 0x00]);    // 0 for Modbus TCP
// const length = Buffer.from([0x00, 0x06]);        // 6 bytes for the following fields
// const unitId = Buffer.from([0x01]);              // Unit Identifier

// // Constructing the request
// const requestBuffer = Buffer.concat([
//     transactionId,
//     protocolId,
//     length,
//     unitId,
//     Buffer.from([functionCode]),
//     Buffer.from([startAddress >> 8, startAddress & 0xFF]),
//     Buffer.from([quantity >> 8, quantity & 0xFF])
// ]);

// client.connect(port, host, () => {
//     console.log('Connected to Modbus server');
//     client.write(requestBuffer);
// });

// client.on('data', (data) => {
//     // Assuming a successful response, extract the data
//     const dataLength = data[8]; // Byte count
//     const nameBytes = data.slice(9, 9 + dataLength);
//     const name = nameBytes.toString('utf8');
//     console.log('Received Name:', name);

//     client.destroy();
// });

// client.on('close', () => {
//     console.log('Connection closed');
// });


const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = new net.Socket();
const host = '127.0.0.1'; // Server IP
const port = 502;        // Modbus TCP port

// Function to construct and send Modbus request
function sendModbusRequest(functionCode, startAddress, quantity) {
    const transactionId = Buffer.from([0x00, 0x01]); // Unique Transaction ID
    const protocolId = Buffer.from([0x00, 0x00]);    // 0 for Modbus TCP
    const length = Buffer.from([0x00, 0x06]);        // 6 bytes for the following fields
    const unitId = Buffer.from([0x01]);              // Unit Identifier

    const requestBuffer = Buffer.concat([
        transactionId,
        protocolId,
        length,
        unitId,
        Buffer.from([functionCode]),
        Buffer.from([startAddress >> 8, startAddress & 0xFF]),
        Buffer.from([quantity >> 8, quantity & 0xFF])
    ]);

    client.write(requestBuffer);
}

client.connect(port, host, () => {
    console.log('Connected to Modbus server');

    rl.question('Enter the type of data to retrieve (lux/overexposed/delay/onoff): ', (answer) => {
        switch (answer) {
            case 'lux':
                sendModbusRequest(0x03, 0, 2); // Required lux level (4 bytes)
                break;
            case 'overexposed':
                sendModbusRequest(0x03, 2, 1); // Overexposed value (1 byte)
                break;
            case 'delay':
                sendModbusRequest(0x03, 3, 1); // Switch delay timer (2 bytes)
                break;
            case 'onoff':
                sendModbusRequest(0x03, 5, 1); // Manual/ON/OFF (1 byte)
                break;
            default:
                console.log('Invalid input');
                client.destroy();
                rl.close();
        }
    });
});

client.on('data', (data) => {
    console.log('Received:', data);
    client.destroy();
    rl.close();
});

client.on('close', () => {
    console.log('Connection closed');
});
