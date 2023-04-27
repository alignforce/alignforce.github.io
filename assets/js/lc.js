(function () {
    var gt = window.gtranslateSettings || {};
    gt = gt[document.currentScript.getAttribute('data-gt-widget-id')] || gt;
    var lang_array_english = {
        "en": "English",
        "de": "German"
    };
    var lang_array_native = {
        "en": "English",
        "de": "Deutsch"
    };
    var default_language = gt.default_language || 'auto';
    var languages = gt.languages || Object.keys(lang_array_english);
    var url_structure = gt.url_structure || 'none';
    var custom_domains = gt.custom_domains || {};
    var horizontal_position = gt.horizontal_position || 'inline';
    var vertical_position = gt.vertical_position || null;
    var native_language_names = gt.native_language_names || false;
    var detect_browser_language = gt.detect_browser_language || false;
    var wrapper_selector = gt.wrapper_selector || '.gtranslate_wrapper';
    var custom_css = gt.custom_css || '';
    var lang_array = native_language_names && lang_array_native || lang_array_english;
    var u_class = '.gt_container-' + Array.from('lc' + wrapper_selector).reduce(function (h, c) {
        return 0 | (31 * h + c.charCodeAt(0))
    }, 0).toString(36);
    var widget_code = '<!-- GTranslate: https://gtranslate.com -->';
    var widget_css = custom_css;

    function get_lang_href(lang) {
        var href = '#';
        if (url_structure == 'sub_directory') {
            var gt_request_uri = (document.currentScript.getAttribute('data-gt-orig-url') || (location.pathname.startsWith('/' + current_lang + '/') && '/' + location.pathname.split('/').slice(2).join('/') || location.pathname)) + location.search + location.hash;
            href = (lang == default_language) && location.protocol + '//' + location.hostname + gt_request_uri || location.protocol + '//' + location.hostname + '/' + lang + gt_request_uri;
        } else if (url_structure == 'sub_domain') {
            var gt_request_uri = (document.currentScript.getAttribute('data-gt-orig-url') || location.pathname) + location.search + location.hash;
            var domain = document.currentScript.getAttribute('data-gt-orig-domain') || location.hostname;
            if (typeof custom_domains == 'object' && custom_domains[lang])
                href = (lang == default_language) && location.protocol + '//' + domain + gt_request_uri || location.protocol + '//' + custom_domains[lang] + gt_request_uri;
            else
                href = (lang == default_language) && location.protocol + '//' + domain + gt_request_uri || location.protocol + '//' + lang + '.' + domain.replace(/^www\./, '') + gt_request_uri;
        }
        return href;
    }
    widget_css += "a.glink{text-decoration:none}a.glink.gt-current-lang{font-weight:bold}";
    var current_lang = document.querySelector('html').getAttribute('lang') || default_language;
    if (url_structure == 'none') {
        var googtrans_matches = document.cookie.match('(^|;) ?googtrans=([^;]*)(;|$)');
        current_lang = googtrans_matches && googtrans_matches[2].split('/')[2] || current_lang;
    }
    if (!lang_array[current_lang])
        current_lang = default_language;
    languages.forEach(function (lang) {
        var el_a = document.createElement('a');
        el_a.href = get_lang_href(lang);
        el_a.title = lang_array[lang];
        el_a.setAttribute('data-gt-lang', lang);
        el_a.classList.add('glink', 'nturl', 'notranslate');
        lang == current_lang && el_a.classList.add('gt-current-lang');
        el_a.innerHTML += lang.toUpperCase();
        widget_code += el_a.outerHTML + ' ';
    });
    if (url_structure == 'none') {
        widget_code += '<div id="google_translate_element2"></div>';
        widget_css += "div.skiptranslate,#google_translate_element2{display:none!important}";
        widget_css += "body{top:0!important}";
    }
    if (horizontal_position != 'inline')
        widget_code = '<div class="gt_switcher_wrapper" style="position:fixed;' + vertical_position + ':15px;' + horizontal_position + ':15px;z-index:999999;">' + widget_code + '</div>';
    var add_css = document.createElement('style');
    add_css.classList.add('gtranslate_css');
    add_css.textContent = widget_css;
    document.head.appendChild(add_css);
    document.querySelectorAll(wrapper_selector).forEach(function (e) {
        e.classList.add(u_class.substring(1));
        e.innerHTML += widget_code
    });
    if (url_structure == 'none') {
        function get_current_lang() {
            var keyValue = document.cookie.match('(^|;) ?googtrans=([^;]*)(;|$)');
            return keyValue ? keyValue[2].split('/')[2] : null;
        }

        function fire_event(element, event) {
            try {
                if (document.createEventObject) {
                    var evt = document.createEventObject();
                    element.fireEvent('on' + event, evt)
                } else {
                    var evt = document.createEvent('HTMLEvents');
                    evt.initEvent(event, true, true);
                    element.dispatchEvent(evt)
                }
            } catch (e) {}
        }

        function load_tlib() {
            if (!window.gt_translate_script) {
                window.gt_translate_script = document.createElement('script');
                gt_translate_script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit2';
                document.body.appendChild(gt_translate_script);
            }
        }
        window.doGTranslate = function (lang_pair) {
            if (lang_pair.value) lang_pair = lang_pair.value;
            if (lang_pair == '') return;
            var lang = lang_pair.split('|')[1];
            if (get_current_lang() == null && lang == lang_pair.split('|')[0]) return;
            var teCombo;
            var sel = document.getElementsByTagName('select');
            for (var i = 0; i < sel.length; i++)
                if (sel[i].className.indexOf('goog-te-combo') != -1) {
                    teCombo = sel[i];
                    break;
                } if (document.getElementById('google_translate_element2') == null || document.getElementById('google_translate_element2').innerHTML.length == 0 || teCombo.length == 0 || teCombo.innerHTML.length == 0) {
                setTimeout(function () {
                    doGTranslate(lang_pair)
                }, 500)
            } else {
                teCombo.value = lang;
                fire_event(teCombo, 'change');
                fire_event(teCombo, 'change')
            }
        }
        window.googleTranslateElementInit2 = function () {
            new google.translate.TranslateElement({
                pageLanguage: default_language,
                autoDisplay: false
            }, 'google_translate_element2')
        };
        if (current_lang != default_language)
            load_tlib();
        else
            document.querySelectorAll(u_class).forEach(function (e) {
                e.addEventListener('pointerenter', load_tlib)
            });
        document.querySelectorAll(u_class + ' a[data-gt-lang]').forEach(function (e) {
            e.addEventListener('click', function (evt) {
                evt.preventDefault();
                document.querySelectorAll(u_class + ' a.gt-current-lang').forEach(function (e) {
                    e.classList.remove('gt-current-lang')
                });
                e.classList.add('gt-current-lang');
                doGTranslate(default_language + '|' + e.getAttribute('data-gt-lang'));
            })
        });
    }
    if (detect_browser_language && window.sessionStorage && window.navigator && sessionStorage.getItem('gt_autoswitch') == null && !/bot|spider|slurp|facebook/i.test(navigator.userAgent)) {
        var accept_language = (navigator.language || navigator.userLanguage).toLowerCase();
        switch (accept_language) {
            case 'zh':
            case 'zh-cn':
                var preferred_language = 'zh-CN';
                break;
            case 'zh-tw':
            case 'zh-hk':
                var preferred_language = 'zh-TW';
                break;
            case 'he':
                var preferred_language = 'iw';
                break;
            default:
                var preferred_language = accept_language.substr(0, 2);
                break;
        }
        if (current_lang == default_language && preferred_language != default_language && languages.includes(preferred_language)) {
            if (url_structure == 'none') {
                load_tlib();
                window.gt_translate_script.onload = function () {
                    doGTranslate(default_language + '|' + preferred_language);
                    document.querySelectorAll(u_class + ' a.gt-current-lang').forEach(function (e) {
                        e.classList.remove('gt-current-lang')
                    });
                    document.querySelector(u_class + ' a[data-gt-lang="' + preferred_language + '"]').classList.add('gt-current-lang');
                };
            } else
                document.querySelectorAll(u_class + ' a[data-gt-lang="' + preferred_language + '"]').forEach(function (e) {
                    location.href = e.href
                });
        }
        sessionStorage.setItem('gt_autoswitch', 1);
    }
})();