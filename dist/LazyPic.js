(function (name, definition, context, dependencies) {
    if ( typeof context['module'] !== 'undefined' && context['module']['exports'] ) { 
        // CommonJS support
        if ( dependencies && context['require'] ) { 
            for (var i = 0; i < dependencies.length; i++) 
                context[dependencies[i]] = context['require'](dependencies[i]); 
        } 
        context['module']['exports'] = definition.apply(context); 
    } else if ( typeof context['define'] !== 'undefined' && typeof context['define'] === 'function' && context['define']['amd'] ) { 
        //AMD support
        define(name, (dependencies || []), definition); 
    } else {
        //without AMD & CommonJS
        context[name] = definition.apply(context); 
    }
})('WebpDetect', function () {

    var WebP = {}
        CTX = this;

    WebP._cb = function(isSupport, _cb) {
        this.isSupport = function(cb) {
            cb(isSupport);
        };
        _cb(isSupport);
        if (CTX.chrome || CTX.opera && CTX.localStorage) {
            CTX.localStorage.setItem("webpsupport", isSupport);
        }
    };

    WebP.isSupport = function(cb) {
        if (!cb) return;
        if (!CTX.chrome && !CTX.opera) return WebP._cb(false, cb);
        if (CTX.localStorage && CTX.localStorage.getItem("webpsupport") !== null) {
            var val = CTX.localStorage.getItem("webpsupport");
            WebP._cb(val === "true", cb);
            return;
        }
        var img = new Image();
        img.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        img.onload = img.onerror = function() {
            WebP._cb(img.width === 2 && img.height === 2, cb);
        };
    };

    WebP.run = function(cbkYes,cbkNo) {
        this.isSupport(function(isSupport) {
            if (isSupport) {
                cbkYes();
            }else{
                cbkNo();
            }
        });
    };

    return WebP;

}, this);


(function (name, definition, context, dependencies) {
    if ( typeof context['module'] !== 'undefined' && context['module']['exports'] ) { 
        // CommonJS support
        if ( dependencies && context['require'] ) { 
            for (var i = 0; i < dependencies.length; i++) 
                context[dependencies[i]] = context['require'](dependencies[i]); 
        } 
        context['module']['exports'] = definition.apply(context); 
    } else if ( typeof context['define'] !== 'undefined' && typeof context['define'] === 'function' && context['define']['amd'] ) { 
        //AMD support
        define(name, (dependencies || []), definition); 
    } else {
        //without AMD & CommonJS
        context[name] = definition.apply(context); 
    }
})('LazyPic', function (Webp,$) {

    Webp = Webp || this['WebpDetect'];
    $ = $ || this['jQuery'] || this['Zepto'];

	var Lazyloader = function(options){
		this.options = $.extend({}, Lazyloader.defaults, options);
		this._init();
	}

	Lazyloader.prototype = {
		constructor: 'Lazyloader',

		_init: function(){
			var opts = this.options;
			this.scrollTimer = null;
            this.container = opts.container && $(opts.container).length != 0 ? $(opts.container) : $(document);
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
				clearTimeout(self.scrollTimer);
                self.scrollTimer = setTimeout(function(){
                    self._loadItems();    
                },self.options.scrollTimerDelay);
			}
			$(window).on('resize.lazyload scroll.lazyload', this._loadFn );
		},

		/*
		 * 加载图片
		*/
		_loadItems: function(){
			//dynamic为true(存在动态内容)时，每次都取一次待加载内容
			var opts = this.options, 
				self = this,
				lazyAttr = opts.lazyAttr, 
				lazyAttrWebp = opts.lazyAttrWebp,
                items = opts.dynamic ? this.container.find('[' + lazyAttr + ']') : this.lazyItems;

            Webp.run(function(){

                $.each(items, function(){
				    var item = $(this);
				    if (self._isInViewport(item)) {
					    var src = item.attr(lazyAttrWebp) || item.attr(lazyAttr);
                        item.attr('src',src).removeAttr(lazyAttrWebp).removeAttr(lazyAttr);
				    }
			    });


            },function(){
                
                $.each(items, function(){
                    var item = $(this);
                    if (self._isInViewport(item)) {
                        var src = item.attr(lazyAttr);
                        item.attr('src', src).removeAttr(lazyAttr);
                    }
                });

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
		 * 是否在视窗中
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
		 * 停止监听
		*/
		destroy: function(){
			$(window).off('resize.lazyload scroll.lazyload', this._loadFn);
		}
	}

	/*
	 * static function
	 * 替换Html代码中src
	*/
	Lazyloader.toLazyloadHtml = function(html, lazyAttr, placeholder){
		var lazyAttr = lazyAttr || this.defaults.lazyAttr,
			placeholder = placeholder || this.defaults.placeholder,
			reg = /(<img.*?)src=["']([^"']+)["'](.*?>)/gi;
		return html.replace(reg, '$1src=\"'+placeholder+'\" '+lazyAttr+'=\"$2\" $3');
	}	

	/*
	 * 默认配置
	*/
	Lazyloader.defaults = {
		container: 'document',
		placeholder: 'http://static.gtimg.com/icson/img/common/blank.png', //占位图地址
		lazyAttr: 'data-lazyload', //lazyload属性名，值为图片真实地址
        lazyAttrWebp: 'data-webp', // webp image url
		autoDestroy: true, //容器内的图片都加载完成时，是否自动停止监听
		dynamic: false, //是否有动态的内容插入
		threshold: 100, //阀值，提前加载的距离
        scrollTimerDelay: 30 // 滚动事件触发的延时，单位ms。滚动事件属于高频事件，增加延时可以显著提升性能
	}

	return Lazyloader;

}, this,['WebpDetect','jquery']);
