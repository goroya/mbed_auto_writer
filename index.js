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
commander._name = 'mbedaw'
commander
.version(packageJson.version)
.option('-w, --watch  <watch path>', 'Watching mbed write file directory (example: mbedaw -w \'C:\\Users\\hogehoge\\Desktop\\*.bin\')')
.option('-m, --mount  <mount path>', 'Mbed Mount Drive (example: mbedaw -m \'D:\')')
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
        const watchPath = [];
        if(commander.watch){
            watchPath.push(commander.watch);
        }else{
            watchPath.push(path.join(currentPath, "*.hex"));
            watchPath.push(path.join(currentPath, "*.bin"));
        }
        console.log(` Watching File Path is ${watchPath.join(", ")}`);
        let mountDrive = '';
        if(commander.mount !== undefined){
            mountDrive = commander.mount;
        }else{
            const drives = await getDrive();
            let writeDrive = '';
            for (const drive of drives) {
                if ( drive && (drive.description.toUpperCase().indexOf('MBED') != -1) ) {
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

        const watcher = chokidar.watch(watchPath, {
            ignoreInitial: true,
            usePolling: true,
            awaitWriteFinish: true,
            interval: 100,
            ignorePermissionErrors: false
        });
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
        }).on('error', (error) => {
            console.error(colors.red(' Watch Error Occur'));
            throw error;
        });
    } catch (error) {
        console.error(colors.red('Error'));
        console.error(colors.red(JSON.stringify(error)));
        process.exit(1);
    }
})();

