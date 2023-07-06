/**
 * Utility to generate a unique code
 * @author Yousuf Kalim
 */
import crypto from 'crypto';

/**
 * 62 characters in the ascii range that can be used in URLs without special
 * encoding.
 */
const UIDCHARS = 'ABCDEFGHJKLMNPQRSTUVWXYabcdefghijklmnopqrstuvwxyz3456789';

/**
 * Make a Buffer into a string ready for use in URLs
 *
 * @param {String} bytes a Buffer containing the bytes to convert
 * @returns {String} UID
 * @api private
 */
function tostr(bytes: Buffer): string {
  let r = '';

  for (let i = 0; i < bytes.length; i++) {
    if (i === bytes.length / 2) {
      r += `-${UIDCHARS[bytes[i] % 56]}`;
    } else {
      r += UIDCHARS[bytes[i] % 56];
    }
  }
  return r.toUpperCase();
}

/**
 * Generate a Unique ID
 *
 * @param {Number} length  The number of chars of the uid
 * @api public
 */

function uid(length = 8): string {
  return tostr(crypto.randomBytes(length));
}

/**
 * Exports
 */
export default uid;
