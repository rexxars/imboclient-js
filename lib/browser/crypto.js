/**
 * This file is part of the imboclient-js package
 *
 * (c) Espen Hovlandsdal <espen@hovlandsdal.com>
 *
 * For the full copyright and license information, please view the LICENSE file that was
 * distributed with this source code.
 */
'use strict';

/**
 * Checks if webworkers are supported
 *
 * @return {Boolean}
 */
var supportsWebWorkers = function() {
    if (typeof window.Worker === 'undefined' || typeof window.URL === 'undefined') {
        return false;
    }

    try {
        /* eslint-disable no-new */
        new Worker(window.URL.createObjectURL(
            new Blob([''], { type: 'text/javascript' })
        ));
        /* eslint-enable no-new */
    } catch (e) {
        return false;
    }

    return true;
};

var Sha = require('./sha'),
    md5 = require('./md5.min'),
    readers = require('./readers');

var isBrowser = typeof window !== 'undefined',
    supportsWorkers = isBrowser && supportsWebWorkers(),
    workerQueue = [],
    md5Worker;

/**
 * Process the next MD5 task in the queue (if any)
 *
 */
var nextMd5Task = function() {
    if (workerQueue.length > 1) {
        // Worker should already be processing, next task
        // will be run once the current one is done
        return;
    } else if (workerQueue.length) {
        // Only one item in queue? Let the worker process it now
        md5Worker.postMessage(workerQueue[0].buffer);
    }
};

/**
 * Add a new MD5 task to the queue
 *
 * @param {ArrayBuffer} buffer - Buffer containing the file data
 * @param {Function} callback  - Callback to run when the MD5 task has been completed
 */
var addMd5Task = function(buffer, callback) {
    if (supportsWorkers) {
        // We have a worker queue, push an item into it and start processing
        workerQueue.push({ buffer: buffer, callback: callback });
        nextMd5Task();
    } else {
        // We don't have any Web Worker support,
        // queue an MD5 operation on the next tick
        process.nextTick(function() {
            callback(null, md5.ArrayBuffer.hash(buffer));
        });
    }
};

// Initialize the web worker for generating MD5 hashes if supported
if (supportsWorkers) {
    // Set up the actual web worker
    md5Worker = new Worker('./md5-worker.js');
    md5Worker.addEventListener('message', function(e) {
        var item = workerQueue.shift();
        item.callback(null, e.data);

        nextMd5Task();
    }, false);
}

module.exports = {
    /**
     * Generate a SHA256 HMAC hash from the given data
     *
     * @param  {String} key
     * @param  {String} data
     * @return {String}
     */
    sha256: function(key, data) {
        var shaObj = new Sha('SHA-256', 'TEXT');
        shaObj.setHMACKey(key, 'TEXT');
        shaObj.update(data);
        return shaObj.getHMAC('HEX');
    },

    /**
     * Generate an MD5-sum of the given ArrayBuffer
     *
     * @param  {ArrayBuffer} buffer
     * @param  {Function}    callback
     * @param  {Object}      [options]
     */
    md5: function(buffer, callback, options) {
        if (options && options.type === 'url') {
            readers.getContentsFromUrl(buffer, function(err, data) {
                if (err) {
                    return callback(err);
                }

                module.exports.md5(data, callback, { binary: true });
            });
        } else if (buffer instanceof window.File) {
            readers.getContentsFromFile(buffer, function(err, data) {
                if (err) {
                    return callback(err);
                }

                module.exports.md5(data, callback, { binary: true });
            });
        } else {
            // ArrayBuffer, then.
            process.nextTick(function() {
                addMd5Task(buffer, callback);
            });
        }
    }
};
