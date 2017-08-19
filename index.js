#!/usr/bin/env node

const path = require('path');
const chokidar = require('chokidar');
const drivelist = require('drivelist');
const colors = require('colors/safe');
const keypress = require('keypress');
const notifier = require('node-notifier');
const commander = require('commander');
const fs = require('fs');
const fse = require('fs-extra');

const packageJson = require('./package.json');

commander
.version(packageJson.version)
.usage('Usage: mbedaw [options]')
.option('-w, --watch  <watch path>', 'Watching mbed hex file directory (example: -w \'C:\Users\hogehoge\Desktop\*.hex\')')
.option('-m, --mount  <mount path>', 'Mbed Mount Drive (example:  -m \'D:\')')
.parse(process.argv);

const stdin = process.stdin;
const currentPath = process.cwd();
function getDrive() {
    return new Promise((resolve, reject) => {
        drivelist.list((error, drives) => {
            if (error) {
                reject(error);
            }
            resolve(drives);
        });
    });
};

(async () => {
    try {
        console.log(commander.watch)
        const watchPath = commander.watch || path.join(currentPath, "*.hex");
        console.log(` Watching File Path is ${watchPath}`);

        let mountDrive = '';
        if(commander.mount !== undefined){
            mountDrive = commander.mount;
        }else{
            const drives = await getDrive();
            let writeDrive = '';
            for (const drive of drives) {
                if (drive && drive.description == 'MBED VFS USB Device') {
                    writeDrive = drive.mountpoints[0].path
                    console.log(colors.green(`Found Mbed Drive is "${writeDrive}"`));
                    break;
                }
            }
            if (writeDrive == '') {
                throw 'Not Found MBED VFS USB Device'
            }
            mountDrive = writeDrive;
        }
        console.log(` Mbed mounted is ${mountDrive}`);

        keypress(process.stdin);
        process.stdin.on('keypress', function (ch, key) {
            if (key && key.name == 'q') {
                process.stdin.pause();
                process.exit(0);
            }
            if (key && key.ctrl && key.name == 'c') {
                process.stdin.pause();
                process.exit(0);
            }
        });
        process.stdin.setRawMode(true);
        process.stdin.resume();
        console.log(colors.green.underline('Press q to exit'))

        const watcher = chokidar.watch(watchPath, {});
        watcher.on('add', (addFilePath) => {
            try {
                const writeFilePath = path.join(mountDrive, path.basename(addFilePath));
                console.log(` Witing Start ${addFilePath}`);
                if(fs.existsSync(mountDrive) === false){
                    throw `Mbed Mount Path (${mountDrive}) does not exist.`
                }
                fse.copySync(addFilePath, writeFilePath, {overwrite: true});
                console.log(` Witing End ${writeFilePath}`);
                notifier.notify({
                    title: 'Mbed Auto Writer',
                    message: 'Write Success!',
                    sound: true,
                });
            } catch (error) {
                console.error(colors.red(' Witing Failure'));
                console.error(colors.red(' Reason is ' + JSON.stringify(error)));
                notifier.notify({
                    title: 'Mbed Auto Writer',
                    message: 'Write Failure!',
                    sound: true,
                });
            }
        });
    } catch (error) {
        console.error(colors.red('Error'));
        console.error(colors.red(error));
        process.exit(1);
    }
})();
