/**
 * A lazyload common js  module
 * @requires: jquery or zepto
 */
define(function(require,exports,module){
	var $ = require('jquery.min.js'); //jq path
    // var $ = require('zepto.min.js');//zepto path

	var Lazyloader = function(options){
		this.options = $.extend({}, Lazyloader.defaults, options);
		this._init();
	}

	Lazyloader.prototype = {
		constructor: 'Lazyloader',

		_init: function(){
			var opts = this.options;
			this.container = opts.container && $(opts.container).length != 0 ? $(opts.container) : $(document);
			this.scollTimer = null;
            //若无动态插入的内容,缓存待加载的内容
			if (!opts.dynamic) {
				this.lazyItems = this.container.find('[' + opts.lazyAttr + ']');
				if (this.lazyItems.length == 0) {
					return ; //无加载内容 return
				}
			}
			this._bindEvent();
			this._loadItems();//初始化时，load一次
		},

		_bindEvent: function(){
			var self = this;
			this._loadFn = function(){
				clearTimeout(self.scollTimer);
                self.scrollTimer = setTimeout(function(){
                    self._loadItems();    
                },self.options.scrollTimerDelay);
			}
			$(window).bind('resize.lazyload scroll.lazyload', this._loadFn);
		},

		/*
		 * load the target pictures
		*/
		_loadItems: function(){
			//dynamic为true(存在动态内容)时，每次都取一次待加载内容
			var opts = this.options, 
				self = this,
				lazyAttr = opts.lazyAttr, 
				items = opts.dynamic ? this.container.find('[' + lazyAttr + ']') : this.lazyItems;
			$.each(items, function(){
				var item = $(this);
				if (self._isInViewport(item)) {
					var src = item.attr(lazyAttr);
					item.attr('src', src).removeAttr(lazyAttr);
				}
			});
			//无动态插入时，更新待加载内容
			if (!opts.dynamic) {
				this.lazyItems = items.filter('[' + lazyAttr + ']');
				//完全加载时，若autoDestroy为true，执行destroy方法
				if (this.lazyItems.length == 0 && opts.autoDestroy) {
					self.destroy();
				}
			}
		},

		/*
		 * whether an element is visible
		*/
		_isInViewport: function(item){
			var item = $(item),
				win = $(window),
				scrollTop = win.scrollTop(),
				threshold = this.options.threshold,
				maxTop = scrollTop + win.height() + threshold,
				minTop = scrollTop - threshold,
				itemTop = item.offset().top,
				itemBottom = itemTop + item.outerHeight();

			if (itemTop > maxTop || itemBottom < minTop) {
				return false;
			}
			return true;
		},

		/*
		 * destroy the event bindings
		*/
		destroy: function(){
			$(window).unbind('resize.lazyload scroll.lazyload', this._loadFn);
		}
	}

	/*
	 * parse specified html to lazyloadable
	*/
	Lazyloader.toLazyloadHtml = function(html, lazyAttr, placeholder){
		var lazyAttr = lazyAttr || this.defaults.lazyAttr,
			placeholder = placeholder || this.defaults.placeholder,
			reg = /(<img.*?)src=["']([^"']+)["'](.*?>)/gi;
		return html.replace(reg, '$1src=\"'+placeholder+'\" '+lazyAttr+'=\"$2\" $3');
	}	

	/*
	 * default configurations
	*/
	Lazyloader.defaults = {
		container: 'document',
		placeholder: 'http://static.gtimg.com/icson/img/common/blank.png', 
		lazyAttr: 'data-lazyload', //实际待加载的图片地址
		autoDestroy: true, //图片全部加载完毕后自动销毁相关事件绑定.
		dynamic: false, // 是否有动态插入的html.
		threshold: 100, // 元素与可视范围的提前加载距离
        scrollTimerDelay:50 // 滚动事件触发的延时，单位ms。滚动属于高频事件，加一个延时计时器能极大提升性能。
	}

	return Lazyloader;
});
