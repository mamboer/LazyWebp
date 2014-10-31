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

