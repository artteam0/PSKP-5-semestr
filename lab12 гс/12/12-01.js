const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');


const STUDENT_LIST_FILE = 'StudentList.json';
const BACKUP_DIR = './backups'; 

let studentListCache = [];
let wsClients = []; 

let loadStudentList = (callback)=> {
    fs.readFile(STUDENT_LIST_FILE, (err, data) => {
        if (err) {
          console.log('error: ', err.message);
        } else {
            try {
                studentListCache = JSON.parse(data);
                callback(null);
            } 
            catch (jsonErr) 
            {
                console.error('Error parsing student list JSON:', jsonErr);
                callback({ error: 1, message: `ошибка парсинга JSON в файле ${STUDENT_LIST_FILE}` });
            }
        }
    });
}

let saveStudentList = (callback) => {
    fs.writeFile(STUDENT_LIST_FILE, JSON.stringify(studentListCache),  (err) => {
        if (err) {
            console.error('Error saving student list:', err);
            callback({ error: 1, message: `ошибка записи файла ${STUDENT_LIST_FILE}` });
        } else {
            callback(null);
        }
    });
}

let notifyClients = (data) => {
    wsClients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

const server = http.createServer((req, res) => {
    const { method, url } = req;
    
    const studentIdMatch = url.match(/^\/(\d+)$/);
    const deleteBackupMatch = url.match(/^\/backup\/(\d{8})$/);


    loadStudentList((loadErr) => {
        if (loadErr) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(loadErr));
        }

        else if (method === 'GET' && url === '/') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(studentListCache));
        }
        else if (method === 'GET' && studentIdMatch) {
            const id = parseInt(studentIdMatch[1]);
            const student = studentListCache.find(s => s.id === id);
            if (student) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(student));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 2, message: `студент с id равным ${id} не найден` }));
            }
        }

        else if (method === 'POST' && url === '/') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let newStudent;
                try {
                    newStudent = JSON.parse(body);
                } catch (jsonErr) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 4, message: 'Некорректный JSON в теле запроса' }));
                    return;
                }

                if (studentListCache.some(s => s.id === newStudent.id)) {
                    res.writeHead(409, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 3, message: `студент с id равным ${newStudent.id} уже есть` }));
                } else {
                    studentListCache.push(newStudent);
                    saveStudentList((saveErr) => {
                        if (saveErr) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(saveErr));
                            return;
                        }
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(newStudent));
                    });
                }
            });
        }
        else if (method === 'PUT' && url === '/') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let updatedStudent;
                try {
                    updatedStudent = JSON.parse(body);
                } catch (jsonErr) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 4, message: 'Некорректный JSON в теле запроса' }));
                    return;
                }

                const index = studentListCache.findIndex(s => s.id === updatedStudent.id);
                if (index !== -1) {
                    studentListCache[index] = updatedStudent;
                    saveStudentList((saveErr) => {
                        if (saveErr) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(saveErr));
                            return;
                        }
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(updatedStudent));
                    });
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 2, message: `студент с id равным ${updatedStudent.id} не найден` }));
                }
            });
        }
        else if (method === 'DELETE' && studentIdMatch) {
            const id = parseInt(studentIdMatch[1]);
            const index = studentListCache.findIndex(s => s.id === id);
            if (index !== -1) {
                const deletedStudent = studentListCache.splice(index, 1)[0];
                saveStudentList((saveErr) => {
                    if (saveErr) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(saveErr));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(deletedStudent));
                });
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 2, message: `студент с id равным ${id} не найден` }));
            }
        }
        else if (method === 'POST' && url === '/backup') {
            const now = new Date();
            const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
            const backupFileName = `${timestamp}_${STUDENT_LIST_FILE}`;
            const backupFilePath = BACKUP_DIR + '/' + backupFileName; 

            if (!fs.existsSync(BACKUP_DIR)) {
                fs.mkdirSync(BACKUP_DIR);
            }

            setTimeout(() => {
                fs.readFile(STUDENT_LIST_FILE, (readErr, data) => {
                    if (readErr) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 1, message: 'Ошибка при чтении файла для резервной копии' }));
                        return;
                    }
                    fs.writeFile(backupFilePath, data, (writeErr) => {
                        if (writeErr) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 1, message: 'Ошибка при создании резервной копии' }));
                            return;
                        }
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: `Backup created: ${backupFileName}` }));
                        notifyClients({ event: 'backup_created', filename: backupFileName });
                    });
                });
            }, 2000); 
        }
        else if (method === 'DELETE' && deleteBackupMatch) {
            const targetDateStr = deleteBackupMatch[1];
            const targetDate = new Date(
                parseInt(targetDateStr.substring(0, 4)),
                parseInt(targetDateStr.substring(4, 6)) - 1, 
                parseInt(targetDateStr.substring(6, 8))
            );

            fs.readdir(BACKUP_DIR, (readDirErr, files) => {
                if (readDirErr && readDirErr.code !== 'ENOENT') {
                    console.error('Error reading backup directory:', readDirErr);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 1, message: 'Ошибка при чтении директории резервных копий' }));
                    return;
                }
                if (!files) files = [];

                let deletedCount = 0;
                let deletedFiles = [];
                let filesToProcess = files.filter(file => file.endsWith(`_${STUDENT_LIST_FILE}`));
                let processedCount = 0;

                if (filesToProcess.length === 0) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Нет резервных копий старше указанной даты для удаления.' }));
                    return;
                }

                filesToProcess.forEach(file => {
                    const filePath = BACKUP_DIR + '/' + file; 
                    fs.stat(filePath, (statErr, stats) => {
                        if (statErr) {
                            console.error(`Error stat-ing file ${filePath}:`, statErr);
                            processedCount++;
                            if (processedCount === filesToProcess.length) {
                                
                                if (deletedCount > 0) {
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify({ message: `Удалено ${deletedCount} старых резервных копий.`, deletedFiles }));
                                    notifyClients({ event: 'backup_deleted', deletedFiles });
                                } else {
                                    res.writeHead(404, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify({ message: 'Нет резервных копий старше указанной даты для удаления.' }));
                                }
                            }
                            return;
                        }

                        const fileCreationDate = stats.birthtime;

                        if (fileCreationDate < targetDate) {
                            fs.unlink(filePath, (unlinkErr) => {
                                if (unlinkErr) {
                                    console.error(`Error deleting file ${filePath}:`, unlinkErr);
                                } else {
                                    deletedCount++;
                                    deletedFiles.push(file);
                                }
                                processedCount++;
                                if (processedCount === filesToProcess.length) {
                                    if (deletedCount > 0) {
                                        res.writeHead(200, { 'Content-Type': 'application/json' });
                                        res.end(JSON.stringify({ message: `Удалено ${deletedCount} старых резервных копий.`, deletedFiles }));
                                        notifyClients({ event: 'backup_deleted', deletedFiles });
                                    } else {
                                        res.writeHead(404, { 'Content-Type': 'application/json' });
                                        res.end(JSON.stringify({ message: 'Нет резервных копий старше указанной даты для удаления.' }));
                                    }
                                }
                            });
                        } else {
                            processedCount++;
                            if (processedCount === filesToProcess.length) {
                                if (deletedCount > 0) {
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify({ message: `Удалено ${deletedCount} старых резервных копий.`, deletedFiles }));
                                    notifyClients({ event: 'backup_deleted', deletedFiles });
                                } else {
                                    res.writeHead(404, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify({ message: 'Нет резервных копий старше указанной даты для удаления.' }));
                                }
                            }
                        }
                    });
                });
            });
        }
        else if (method === 'GET' && url === '/backup') {
            fs.readdir(BACKUP_DIR, (readDirErr, files) => {
                if (readDirErr && readDirErr.code !== 'ENOENT') {
                    console.error('Error reading backup directory:', readDirErr);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 1, message: 'Ошибка при чтении директории резервных копий' }));
                    return;
                }
                if (!files) files = [];

                const backupList = [];
                let filesToProcess = files.filter(file => file.endsWith(`_${STUDENT_LIST_FILE}`));
                let processedCount = 0;

                if (filesToProcess.length === 0) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify([]));
                    return;
                }

                filesToProcess.forEach(file => {
                    const filePath = BACKUP_DIR + '/' + file; 
                    fs.stat(filePath, (statErr, stats) => {
                        processedCount++;
                        if (statErr) {
                            console.error(`Error stat-ing file ${filePath}:`, statErr);
                        } else {
                            backupList.push({
                                filename: file,
                                size: stats.size,
                                created: stats.birthtime.toISOString(),
                                modified: stats.mtime.toISOString()
                            });
                        }

                        if (processedCount === filesToProcess.length) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(backupList));
                        }
                    });
                });
            });
        }
        else{
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 404, message: 'Метод или URI не найдены' }));
        }
    });
});

server.listen(3000, () => {
    console.log(`HTTP Server running on http://localhost:3000`);
    
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR);
        console.log(`Created backup directory: ${BACKUP_DIR}`);
    }
});



const wss = new WebSocket.Server({ port: 4000, host:'localhost' });

wss.on('connection', ws => {
    wsClients.push(ws);

    ws.on('message', message => {
        console.log('Received WebSocket message:', message.toString());
    });

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
        wsClients = wsClients.filter(client => client !== ws);
    });

    ws.on('error', error => {
        console.error('WebSocket error:', error.message);
    });
});

console.log(`WebSocket Server running on ws://localhost:4000`);