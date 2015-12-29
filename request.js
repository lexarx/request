define('request', [
	'class', 'event'
], function(Class, Event) {
	/**
	 * @class Request
	 */
	var Request = Class.extend({
		method: 'GET',
		async: true,

		/**
		 * @constructor
		 * @param {Request.Parameters} parameters
		 */
		constructor: function(parameters) {
			this.completed = new Event();
			this.failed = new Event();
			this.aborted = new Event();
			this.timeout = new Event();
			this.stateChanged = new Event();
			this.progressChanged = new Event();
			this.xhr = new XMLHttpRequest();
			if (parameters !== undefined && parameters.url !== undefined) {
				this.setUrl(parameters.url);
			}
			if (parameters !== undefined && parameters.method !== undefined) {
				this.setMethod(parameters.method);
			}
			if (parameters !== undefined && parameters.async !== undefined) {
				this.setAsync(parameters.async);
			}
			if (parameters !== undefined && parameters.data !== undefined) {
				this.setData(parameters.data);
			}
			this.headers = {};
			if (parameters !== undefined && parameters.headers !== undefined) {
				this.setHeaders(parameters.headers);
			}
			if (parameters !== undefined && parameters.responseType !== undefined) {
				this.setResponseType(parameters.responseType);
			}
			if (parameters !== undefined && parameters.timeout !== undefined) {
				this.setTimeout(parameters.timeout);
			}
			if (parameters !== undefined && parameters.mimeType !== undefined) {
				this.setMimeType(parameters.mimeType);
			}
			var self = this;
			this.xhr.addEventListener('readystatechanged', function(event) {
				self.onReadyStateChanged(event);
			});
			this.xhr.addEventListener('progress', function(event) {
				self.onProgress(event);
			});
			this.xhr.addEventListener('load', function(event) {
				self.onLoad(event);
			});
			this.xhr.addEventListener('error', function(event) {
				self.onError(event);
			});
			this.xhr.addEventListener('abort', function(event) {
				self.onAbort(event);
			});
			this.xhr.addEventListener('timeout', function(event) {
				self.onTimeout(event);
			});
		},

		setUrl: function(url) {
			this.url = url;
		},

		getUrl: function() {
			return this.url;
		},

		setMethod: function(method) {
			this.method = method;
		},

		getMethod: function() {
			return this.method;
		},

		setAsync: function(async) {
			this.async = async;
		},

		getAsync: function() {
			return this.async;
		},

		setData: function(data) {
			this.data = data;
		},

		getData: function() {
			return this.data;
		},

		setHeaders: function(headers) {
			this.headers = headers;
		},

		getHeaders: function() {
			return this.headers;
		},

		setHeader: function(name, value) {
			var header = this.headers[name];
			if (header === undefined) {
				this.headers[name] = [value];
			} else {
				this.headers[name].push(value);
			}
		},

		setResponseType: function(responseType) {
			return this.xhr.responseType = responseType;
		},

		getResponseType: function() {
			return this.xhr.responseType;
		},

		setTimeout: function(timeout) {
			this.xhr.timeout = timeout;
		},

		getTimeout: function() {
			return this.xhr.timeout;
		},

		setMimeType: function(mimeType) {
			this.mimeType = mimeType;
		},

		getMimeType: function() {
			return this.mimeType;
		},

		send: function() {
			this.xhr.open(this.method, this.url, this.async);
			for (var name in this.headers) {
				var values = this.headers[name];
				for (var i = 0; i < values.length; i++) {
					this.xhr.setRequestHeader(name, values[i]);
				}
			}
			if (this.mimeType !== undefined && this.mimeType !== null) {
				this.xhr.overrideMimeType(this.mimeType);
			}
			this.xhr.send(this.data);
		},

		abort: function() {
			this.xhr.abort();
		},

		getState: function() {
			// xhr.readyState values match Request.State values
			return this.xhr.readyState;
		},

		getStatus: function() {
			return this.xhr.status;
		},

		getStatusText: function() {
			return this.xhr.statusText;
		},

		getResponse: function() {
			return this.xhr.response;
		},

		getResponseText: function() {
			return this.xhr.responseText;
		},

		onReadyStateChanged: function(event) {
			this.stateChanged.trigger(this, this.xhr.readyState, event);
		},

		onProgress: function(event) {
			this.progressChanged.trigger(this, event);
		},

		onLoad: function(event) {
			this.completed.trigger(this, this.xhr.response, event);
		},

		onError: function(event) {
			this.failed.trigger(this, event);
		},

		onAbort: function(event) {
			this.aborted.trigger(this, event);
		},

		onTimeout: function(event) {
			this.timeout.trigger(this, event);
		},

		getResponseHeaders: function() {
			return this.xhr.getAllResponseHeaders();
		},

		getResponseHeader: function(name) {
			return this.xhr.getResponseHeader(name);
		}
	});

	Request.State = {
		UNSENT: 0,
		OPENED: 1,
		HEADERS_RECEIVED: 2,
		LOADING: 3,
		DONE: 4
	};

	return Request;

	/**
	 * @typedef Parameters
	 * @namespace Request
	 * @property {String} url
	 * @property {String} method
	 * @property {Boolean} async
	 * @property {*} data
	 * @property {Object} headers
	 * @property {String} responseType
	 * @property {Number} timeout
	 */
});