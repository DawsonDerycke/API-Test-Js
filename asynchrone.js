/* // intro callback
function message(timeout, message, callback) {
    setTimeout(() => {
        console.log(message);
        callback();
    }, timeout);
}

message(3000, 'Hello ! Comment tu vas ?', () => {
    message(1000, 'Ca va et toi ?', () => {
        message(2000, 'ça va.', () => { })
    });
});
*/

/* // intro Promise
function message(timeout, message) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(message);
            resolve();
        }, timeout);
    });
}

message(3000, 'Hello ! Comment tu vas ?')
    .then(() => message(1000, 'Ca va et toi ?'))
    .then(() => message(2000, 'ça va.'));
*/
// intro Async await
function message(timeout, message) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(message);
            resolve();
        }, timeout);
    });
}

async function synchrone() {
    console.log('Message 1');
    await message(3000, 'Hello ! Comment tu vas ?')
    await message(1000, 'Ca va et toi ?')
    await message(2000, 'ça va.');
    console.log('Message 2');
}

synchrone();