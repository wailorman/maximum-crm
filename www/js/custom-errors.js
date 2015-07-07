/**
 * Custom Http Error.
 *
 * @param {number} [status]
 * @param {string} [statusText]
 * @param {object} [config]     Angular http config object
 * @param {object} [data]
 * @constructor
 * @extends Error
 */
function HttpError(status, statusText, config, data) {
    this.constructor.prototype.__proto__ = Error.prototype;
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;

    this.status = ( status || 0 );
    this.statusText = ( statusText || "" );
    this.config = ( config || {} );
    this.data = ( data || {} );

    this.message = "";

    if ( this.config.url ) this.message += this.config.url + ': ';
    if ( this.status ) this.message += this.status + ' ';
    if ( this.statusText ) this.message += this.statusText;
}