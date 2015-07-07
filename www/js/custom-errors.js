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

/**
 * Simple error object class which has no differences
 * with std Error
 *
 * @param {string} message
 * @constructor
 * @extends Error
 */
function InvalidArgumentError ( message ) {
    this.constructor.prototype.__proto__ = Error.prototype;
    Error.captureStackTrace( this, this.constructor );
    this.name = this.constructor.name;
    this.message = (message || "");
}

/**
 * Simple error object class which has no differences
 * with std Error
 *
 * @param {string} [message]
 * @constructor
 * @extends Error
 */
function ConvertingError ( message ) {
    this.constructor.prototype.__proto__ = Error.prototype;
    Error.captureStackTrace( this, this.constructor );
    this.name = this.constructor.name;
    this.message = (message || "");
}