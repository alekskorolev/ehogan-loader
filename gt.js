/* gettext library */
var catalog = window.catalog = window.catalog || new Array();

function pluralidx(count) { return (count == 1) ? 0 : 1; }


function gettext(msgid) {
  var value = catalog[msgid];
  if (typeof(value) == 'undefined') {
    return msgid;
  } else {
    return (typeof(value) == 'string') ? value : value[0];
  }
}

function ngettext(singular, plural, count) {
  value = catalog[singular];
  if (typeof(value) == 'undefined') {
    return (count == 1) ? singular : plural;
  } else {
    return value[pluralidx(count)];
  }
}

function gettext_noop(msgid) { return msgid; }

function pgettext(context, msgid) {
    var value = gettext(context + String.fromCharCode(4) + msgid);
    if (value.indexOf(String.fromCharCode(4)) != -1) {
    value = msgid;
  }
  return value;
}

function npgettext(context, singular, plural, count) {
    var value = ngettext(context + String.fromCharCode(4) + singular, context + String.fromCharCode(4) + plural, count);
    if (value.indexOf(String.fromCharCode(4)) != -1) {
    value = ngettext(singular, plural, count);
  }
  return value;
}

function interpolate(fmt, obj, named) {
  if (named) {
    return fmt.replace(/%\(\w+\)s/g, function(match){return String(obj[match.slice(2,-2)])});
  } else {
    return fmt.replace(/%s/g, function(match){return String(obj.shift())});
  }
}

/* formatting library */

if (window.formats === void 0) { var formats = new Array(); }

formats['DATETIME_FORMAT'] = 'j E Y \u0433. G:i:s';
formats['DATE_FORMAT'] = 'j E Y \u0433.';
formats['DECIMAL_SEPARATOR'] = ',';
formats['MONTH_DAY_FORMAT'] = 'j F';
formats['NUMBER_GROUPING'] = '3';
formats['TIME_FORMAT'] = 'G:i:s';
formats['FIRST_DAY_OF_WEEK'] = '1';
formats['TIME_INPUT_FORMATS'] = ['%H:%M:%S', '%H:%M'];
formats['THOUSAND_SEPARATOR'] = '\u00a0';
formats['DATE_INPUT_FORMATS'] = ['%d.%m.%Y', '%d.%m.%y', '%Y-%m-%d'];
formats['YEAR_MONTH_FORMAT'] = 'F Y \u0433.';
formats['SHORT_DATE_FORMAT'] = 'd.m.Y';
formats['SHORT_DATETIME_FORMAT'] = 'd.m.Y H:i';
formats['DATETIME_INPUT_FORMATS'] = ['%d.%m.%Y %H:%M:%S', '%d.%m.%Y %H:%M', '%d.%m.%Y', '%d.%m.%y %H:%M:%S', '%d.%m.%y %H:%M', '%d.%m.%y', '%Y-%m-%d %H:%M:%S', '%Y-%m-%d %H:%M', '%Y-%m-%d'];

function get_format(format_type) {
    var value = formats[format_type];
    if (typeof(value) == 'undefined') {
      return msgid;
    } else {
      return value;
    }
}

  /* add to global namespace */
if (!window.pluralidx) {
    window.pluralidx = pluralidx;
}
if (!window.gettext) {
    window.gettext = gettext;
}
if (!window.ngettext) {
    window.ngettext = ngettext;
}
if (!window.gettext_noop) {
    window.gettext_noop = gettext_noop;
}
if (!window.pgettext) {
    window.pgettext = pgettext;
}
if (!window.npgettext) {
    window.npgettext = npgettext;
}
if (!window.interpolate) {
    window.interpolate = interpolate;
}
if (!window.get_format) {
    window.get_format = get_format;
}
