// // // create an empty modbus client
// // var ModbusRTU = require("modbus-serial");

// // var vector = {
// //     getInputRegister: function (addr, unitID) { return addr; },
// //     getHoldingRegister: function (addr, unitID) { return addr + 8000; },
// //     getCoil: function (addr, unitID) { return (addr % 2) === 0; },
// //     setRegister: function (addr, value, unitID) { console.log('set register', addr, value, unitID); return; },
// //     setCoil: function (addr, value, unitID) { console.log('set coil', addr, value, unitID); return; }
// // };

// // // set the server to answer for modbus requests
// // console.log('ModbusTCP listening on modbus://0.0.0.0:502');
// // var serverTCP = new ModbusRTU.ServerTCP(vector, { host: '127.0.0.1' });




// // // create an empty modbus client
// // const ModbusRTU = require("modbus-serial");
// // const vector = {
// //     getInputRegister: function (addr, unitID) {
// //         // Synchronous handling
// //         return addr;
// //     },
// //     getHoldingRegister: function (addr, unitID, callback) {
// //         // Asynchronous handling (with callback)
// //         setTimeout(function () {
// //             // callback = function(err, value)
// //             callback(null, addr + 8000);
// //         }, 10);
// //     },
// //     getCoil: function (addr, unitID) {
// //         // Asynchronous handling (with Promises, async/await supported)
// //         return new Promise(function (resolve) {
// //             setTimeout(function () {
// //                 resolve((addr % 2) === 0);
// //             }, 10);
// //         });
// //     },
// //     setRegister: function (addr, value, unitID) {
// //         // Asynchronous handling supported also here
// //         console.log("set register", addr, value, unitID);
// //         return;
// //     },
// //     setCoil: function (addr, value, unitID) {
// //         // Asynchronous handling supported also here
// //         console.log("set coil", addr, value, unitID);
// //         return;
// //     },
// //     readDeviceIdentification: function (addr) {
// //         return {
// //             0x00: "MyVendorName",
// //             0x01: "MyProductCode",
// //             0x02: "MyMajorMinorRevision",
// //             0x05: "MyModelName",
// //             0x97: "MyExtendedObject1",
// //             0xAB: "MyExtendedObject2"
// //         };
// //     }
// // };

// // // set the server to answer for modbus requests
// // console.log("ModbusTCP listening on modbus://0.0.0.0:8502");
// // const serverTCP = new ModbusRTU.ServerTCP(vector, { host: "0.0.0.0", port: 8502, debug: true, unitID: 1 });

// // serverTCP.on("socketError", function (err) {
// //     // Handle socket error if needed, can be ignored
// //     console.error(err);
// // });



// const net = require('net');

// const MODBUS_TCP_PORT = 502;

// const server = net.createServer(socket => {
//     console.log('Client connected');

//     socket.on('data', data => {
//         // Parse the Modbus TCP request
//         const unitId = data.readUInt8(6);
//         const functionCode = data.readUInt8(7);

//         // Implement your logic based on the function code
//         // For simplicity, let's assume a read holding register (function code 3) request
//         if (functionCode === 3) {
//             // Respond with dummy data
//             const response = Buffer.from([0x00, 0x01, 0x02, 0x03]);
//             socket.write(response);
//         }
//     });

//     socket.on('end', () => {
//         console.log('Client disconnected');
//     });
// });

// server.listen(MODBUS_TCP_PORT, () => {
//     console.log(`Modbus TCP server listening on port ${MODBUS_TCP_PORT}`);
// });


// const net = require('net');

// const MODBUS_TCP_PORT = 502;

// const server = net.createServer(socket => {
//     console.log('Client connected');

//     socket.on('data', data => {
//         // Extract transaction ID, protocol ID, and length from the MBAP header
//         const transactionId = data.readUInt16BE(0);
//         const protocolId = data.readUInt16BE(2);
//         const length = data.readUInt16BE(4);

//         // Verify protocol ID and handle Modbus TCP request
//         if (protocolId === 0 && length >= 6) {
//             // Extract unit ID and function code from the Modbus PDU
//             const unitId = data.readUInt8(6);
//             const functionCode = data.readUInt8(7);

//             // Implement your logic based on the function code
//             // For simplicity, let's assume a read holding register (function code 3) request
//             if (functionCode === 3) {
//                 // Respond with dummy data
//                 const responseData = Buffer.from([0x00, 0x01, 0x02, 0x03]);

//                 // Create the Modbus TCP response with MBAP header
//                 const responseLength = responseData.length + 2; // Including unit ID
//                 const responseHeader = Buffer.from([
//                     transactionId >> 8, transactionId & 0xFF,
//                     protocolId >> 8, protocolId & 0xFF,
//                     responseLength >> 8, responseLength & 0xFF,
//                     unitId
//                 ]);

//                 const response = Buffer.concat([responseHeader, responseData]);

//                 socket.write(response);
//             }
//         }
//     });

//     socket.on('end', () => {
//         console.log('Client disconnected');
//     });
// });

// server.listen(MODBUS_TCP_PORT, () => {
//     console.log(`Modbus TCP server listening on port ${MODBUS_TCP_PORT}`);
// });



// const net = require('net');

// // Simulating "Mohammed" stored in registers (each character in a register)
// const registers = Buffer.from('Mohammed', 'utf8');

// const server = net.createServer((socket) => {
//     console.log('Client connected');

//     socket.on('data', (data) => {
//         console.log('Received:', data);

//         // Read the function code (assuming Read Holding Registers)
//         const functionCode = data[7];

//         if (functionCode === 0x03) { // Read Holding Registers
//             const startAddress = (data[8] << 8) + data[9];
//             const quantity = (data[10] << 8) + data[11];

//             const responseLength = quantity * 2; // 2 bytes per register
//             const responseData = registers.slice(startAddress * 2, (startAddress + quantity) * 2);

//             const response = Buffer.concat([
//                 data.slice(0, 7), // Echoing MBAP header
//                 Buffer.from([functionCode]),
//                 Buffer.from([responseLength]),
//                 responseData
//             ]);

//             socket.write(response);
//         } else {
//             // Handle other function codes or errors
//         }
//     });

//     socket.on('close', () => {
//         console.log('Client disconnected');
//     });
// });

// const port = 502;
// server.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
// });




const net = require('net');

// Simulating sensor data stored in registers
const sensorData = {
    requiredLuxLevel: Buffer.alloc(4), // 4 bytes (e.g., 100000 Lux)
    overexposedValue: Buffer.alloc(1), // 1 byte (e.g., 1 for overexposed)
    switchDelayTimer: Buffer.alloc(2), // 2 bytes (e.g., 5000 ms)
    manualOnOff: Buffer.alloc(1)       // 1 byte (0=Off, 1=On, 2=Manual)
};

// Initialize sensor data with example values
sensorData.requiredLuxLevel.writeInt32BE(100000); // Example: 100000 Lux
sensorData.overexposedValue.writeInt8(1);         // Example: Overexposed
sensorData.switchDelayTimer.writeInt16BE(5000);   // Example: 5000 ms
sensorData.manualOnOff.writeInt8(2);              // Example: Manual

const server = net.createServer((socket) => {
    console.log('Client connected');

    socket.on('data', (data) => {
        console.log('Received:', data);

        // Read the function code
        const functionCode = data[7];

        if (functionCode === 0x03) { // Read Holding Registers
            const startAddress = (data[8] << 8) + data[9];
            const quantity = (data[10] << 8) + data[11];

            // Construct response data based on start address and quantity
            let responseData = Buffer.alloc(quantity * 2); // 2 bytes per register
            if (startAddress === 0) {
                sensorData.requiredLuxLevel.copy(responseData, 0);
            } else if (startAddress === 2) {
                sensorData.overexposedValue.copy(responseData, 0);
            } else if (startAddress === 3) {
                sensorData.switchDelayTimer.copy(responseData, 0);
            } else if (startAddress === 5) {
                sensorData.manualOnOff.copy(responseData, 0);
            }

            const response = Buffer.concat([
                data.slice(0, 7), // Echoing MBAP header
                Buffer.from([functionCode]),
                Buffer.from([quantity * 2]),
                responseData
            ]);

            socket.write(response);
        } else {
            // Handle other function codes or errors
        }
    });

    socket.on('close', () => {
        console.log('Client disconnected');
    });
});

const port = 502;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
