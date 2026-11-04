/* @ds-bundle: {"format":4,"namespace":"ColorteamDesignSystem_c88c1f","components":[{"name":"DisplayHeading","sourcePath":"components/brand/DisplayHeading.jsx"},{"name":"Icon","sourcePath":"components/brand/Icon.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"MetaFrame","sourcePath":"components/brand/MetaFrame.jsx"},{"name":"Squircle","sourcePath":"components/brand/Squircle.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"RadioGroup","sourcePath":"components/forms/Radio.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/brand/DisplayHeading.jsx":"69b9731008d6","components/brand/Icon.jsx":"88eb13ccf204","components/brand/Logo.jsx":"995ac9bce6ee","components/brand/MetaFrame.jsx":"05a886612421","components/brand/Squircle.jsx":"b23b9d200b1b","components/core/Badge.jsx":"b3d61be752cc","components/core/Button.jsx":"5891536a32fa","components/core/Card.jsx":"a2d9c8986643","components/core/IconButton.jsx":"4ce8aa1a10b1","components/core/Tag.jsx":"9fbcb8b218b6","components/feedback/Dialog.jsx":"ca142ed0635a","components/feedback/Toast.jsx":"5347ef91ffc1","components/feedback/Tooltip.jsx":"9692e8debdd2","components/forms/Checkbox.jsx":"2180528ccf2d","components/forms/Input.jsx":"13a1fe0c2570","components/forms/Radio.jsx":"9b4f78382cc8","components/forms/Select.jsx":"40112128f301","components/forms/Switch.jsx":"adea3ddd9969","components/navigation/Tabs.jsx":"63ce296b9e3f","image-slot.js":"fff26d081c8d","ui_kits/website/Home.jsx":"bff423d8b583","ui_kits/website/Pages.jsx":"dcfd40f33520","ui_kits/website/Shell.jsx":"b29ab59aa222","ui_kits/website/data.js":"8622ecc64603"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ColorteamDesignSystem_c88c1f = window.ColorteamDesignSystem_c88c1f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/DisplayHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function DisplayHeading({
  children,
  size = 'display',
  tone = 'lime',
  serifAmpersand = true,
  as = 'h1',
  style,
  ...rest
}) {
  const sizes = {
    mega: 'var(--fs-mega)',
    display: 'var(--fs-display)',
    h1: 'var(--fs-h1)',
    h2: 'var(--fs-h2)'
  };
  const colors = {
    lime: 'var(--ct-lime)',
    white: 'var(--ct-white)',
    forest: 'var(--ct-forest-900)',
    black: 'var(--ct-black)'
  };
  const Tag = as;
  const render = node => typeof node === 'string' && serifAmpersand ? node.split('&').flatMap((p, i) => i ? [/*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      fontFamily: 'var(--font-serif)',
      fontWeight: 600,
      letterSpacing: 0
    }
  }, "&"), p] : [p]) : node;
  const kids = React.Children.map(children, render);
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      margin: 0,
      font: '700 ' + sizes[size] + '/' + (size === 'h2' ? 1.05 : 0.92) + ' var(--font-display)',
      letterSpacing: 'var(--tracking-display)',
      color: colors[tone] || tone,
      textWrap: 'balance',
      ...style
    }
  }, rest), kids);
}
Object.assign(__ds_scope, { DisplayHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/DisplayHeading.jsx", error: String((e && e.message) || e) }); }

// components/brand/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeVersion = '0.460.0',
  style,
  ...rest
}) {
  const url = 'https://unpkg.com/lucide-static@' + strokeVersion + '/icons/' + name + '.svg';
  return /*#__PURE__*/React.createElement("span", _extends({
    "aria-hidden": "true",
    style: {
      display: 'inline-block',
      width: size,
      height: size,
      background: color,
      WebkitMask: 'url(' + url + ') center/contain no-repeat',
      mask: 'url(' + url + ') center/contain no-repeat',
      flexShrink: 0,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Icon.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const FILES = {
  wordmark: {
    light: 'wordmark-white.png',
    dark: 'wordmark-black.png',
    forest: 'wordmark-forest.png'
  },
  full: {
    light: 'logo-full-on-dark.png'
  },
  mark: {
    light: 'logo-mark-lime.png'
  },
  podcast: {
    lime: 'podcast-mark-lime.png',
    pale: 'podcast-mark-pale.png',
    inverse: 'podcast-mark-inverse.png',
    white: 'podcast-mark-white.png'
  }
};
function Logo({
  variant = 'wordmark',
  tone,
  height = 28,
  assetBase = 'assets/logo',
  podcastLabel = false,
  style,
  ...rest
}) {
  const set = FILES[variant] || FILES.wordmark;
  const t = tone && set[tone] ? tone : Object.keys(set)[0];
  const img = /*#__PURE__*/React.createElement("img", {
    src: assetBase.replace(/\/$/, '') + '/' + set[t],
    alt: variant === 'podcast' ? 'The Colorteam Podcast' : 'colorteam',
    style: {
      height,
      width: 'auto',
      display: 'block'
    }
  });
  if (variant === 'podcast' && podcastLabel) {
    return /*#__PURE__*/React.createElement("span", _extends({
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: height * 0.22,
        ...style
      }
    }, rest), img, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '500 ' + height * 0.3 + 'px/1.02 var(--font-sans)',
        color: tone === 'inverse' ? 'var(--ct-black)' : 'var(--ct-white)'
      }
    }, "The", /*#__PURE__*/React.createElement("br", null), "Colorteam", /*#__PURE__*/React.createElement("br", null), "Podcast"));
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-block',
      ...style
    }
  }, rest), img);
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/brand/MetaFrame.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function MetaFrame({
  topLeft = 'colorteam',
  topRight,
  bottomLeft,
  bottomRight,
  tone = 'dark',
  background,
  padding = 'var(--frame-margin)',
  children,
  style,
  ...rest
}) {
  const fg = tone === 'dark' ? 'var(--ct-white)' : 'var(--text-on-light)';
  const bg = background || (tone === 'dark' ? 'var(--surface-page)' : tone === 'lime' ? 'var(--ct-lime)' : 'var(--surface-page-light)');
  const meta = {
    font: '400 var(--fs-small)/1.2 var(--font-sans)',
    color: fg
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      background: bg,
      color: fg,
      padding,
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      gap: 'var(--space-6)',
      boxSizing: 'border-box',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 16,
      ...meta
    }
  }, /*#__PURE__*/React.createElement("span", null, topLeft), /*#__PURE__*/React.createElement("span", null, topRight)), /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: 0
    }
  }, children), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 16,
      ...meta
    }
  }, /*#__PURE__*/React.createElement("span", null, bottomLeft), /*#__PURE__*/React.createElement("span", null, bottomRight)));
}
Object.assign(__ds_scope, { MetaFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/MetaFrame.jsx", error: String((e && e.message) || e) }); }

// components/brand/Squircle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Squircle({
  size = 64,
  fill = 'var(--ct-lime)',
  outline = false,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: size,
      height: size,
      borderRadius: '24%',
      background: outline ? 'transparent' : fill,
      border: outline ? '1.5px solid ' + fill : 'none',
      display: 'grid',
      placeItems: 'center',
      flexShrink: 0,
      boxSizing: 'border-box',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Squircle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Squircle.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Badge({
  children,
  tone = 'lime',
  style,
  ...rest
}) {
  const t = {
    lime: ['var(--ct-lime)', 'var(--ct-forest-900)'],
    correct: ['var(--status-correct)', '#fff'],
    incorrect: ['var(--status-incorrect)', '#fff'],
    dark: ['var(--ct-forest-900)', 'var(--ct-lime)'],
    yellow: ['var(--ct-yellow)', 'var(--ct-forest-900)']
  }[tone];
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 10px',
      borderRadius: 'var(--radius-pill)',
      background: t[0],
      color: t[1],
      font: '500 11px/1.3 var(--font-sans)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Button({
  children,
  variant = 'primary',
  size = 'md',
  onDark = true,
  iconRight,
  iconLeft,
  disabled,
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const [p, setP] = React.useState(false);
  const pads = {
    sm: '8px 14px',
    md: '12px 20px',
    lg: '16px 28px'
  };
  const fs = {
    sm: 13,
    md: 15,
    lg: 17
  };
  const fg = onDark ? 'var(--ct-white)' : 'var(--text-on-light)';
  const v = {
    primary: {
      background: h ? 'var(--ct-lime-300)' : 'var(--ct-lime)',
      color: 'var(--ct-forest-900)',
      border: '1px solid transparent'
    },
    secondary: {
      background: h ? onDark ? 'rgba(255,255,255,.08)' : 'rgba(16,48,43,.06)' : 'transparent',
      color: fg,
      border: '1px solid ' + (onDark ? 'var(--ct-white)' : 'var(--ct-forest-900)')
    },
    dark: {
      background: h ? 'var(--ct-forest-700)' : 'var(--ct-forest-900)',
      color: 'var(--ct-white)',
      border: '1px solid transparent'
    },
    ghost: {
      background: 'transparent',
      color: onDark ? 'var(--ct-lime)' : 'var(--ct-forest-800)',
      border: '1px solid transparent',
      textDecoration: h ? 'underline' : 'none',
      textUnderlineOffset: 4
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => {
      setH(false);
      setP(false);
    },
    onMouseDown: () => setP(true),
    onMouseUp: () => setP(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: pads[size],
      font: '500 ' + fs[size] + 'px/1 var(--font-sans)',
      letterSpacing: '-0.005em',
      borderRadius: 'var(--radius-pill)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .4 : 1,
      transform: p ? 'scale(.97)' : 'none',
      transition: 'background var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out)',
      ...v,
      ...style
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  children,
  tone = 'forest',
  image,
  imageBg,
  imageHeight = 220,
  eyebrow,
  title,
  body,
  footer,
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const t = {
    forest: {
      bg: 'var(--ct-forest-800)',
      fg: 'var(--ct-white)',
      mute: 'var(--text-muted-dark)',
      bd: 'transparent'
    },
    black: {
      bg: 'var(--ct-black)',
      fg: 'var(--ct-white)',
      mute: 'var(--text-muted-dark)',
      bd: 'transparent'
    },
    lime: {
      bg: 'var(--ct-lime)',
      fg: 'var(--ct-forest-900)',
      mute: 'var(--ct-forest-700)',
      bd: 'transparent'
    },
    light: {
      bg: 'var(--ct-white)',
      fg: 'var(--text-on-light)',
      mute: 'var(--text-muted-light)',
      bd: 'var(--border-hairline-light)'
    },
    outline: {
      bg: 'transparent',
      fg: 'var(--ct-white)',
      mute: 'var(--text-muted-dark)',
      bd: 'var(--border-guide)'
    }
  }[tone];
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      background: t.bg,
      color: t.fg,
      border: '1px solid ' + t.bd,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      ...style
    }
  }, rest), image && /*#__PURE__*/React.createElement("div", {
    style: {
      height: imageHeight,
      background: (imageBg || 'var(--surface-photo)') + ' url(' + image + ') center/cover no-repeat',
      transform: h ? 'scale(1.02)' : 'none',
      transition: 'transform var(--dur-slow) var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      flex: 1
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 12px/1.2 var(--font-sans)',
      color: t.mute
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 22px/1.12 var(--font-display)',
      letterSpacing: '-0.02em'
    }
  }, title), body && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 15px/1.5 var(--font-sans)',
      color: t.mute
    }
  }, body), children, footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 12
    }
  }, footer)));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  children,
  variant = 'lime',
  size = 44,
  label,
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const v = {
    lime: {
      background: h ? 'var(--ct-lime-300)' : 'var(--ct-lime)',
      color: 'var(--ct-forest-900)',
      border: 'none'
    },
    outline: {
      background: h ? 'rgba(255,255,255,.08)' : 'transparent',
      color: 'var(--ct-white)',
      border: '1px solid var(--border-hairline-dark)'
    },
    dark: {
      background: h ? 'var(--ct-forest-700)' : 'var(--ct-forest-900)',
      color: 'var(--ct-lime)',
      border: 'none'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label,
    title: label,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      display: 'inline-grid',
      placeItems: 'center',
      cursor: 'pointer',
      padding: 0,
      transition: 'background var(--dur-fast) var(--ease-out)',
      ...v,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tag({
  children,
  variant = 'chip',
  onDark = true,
  style,
  ...rest
}) {
  const v = {
    chip: {
      background: 'var(--ct-lime)',
      color: 'var(--ct-forest-900)',
      borderRadius: 'var(--radius-chip)',
      padding: '8px 12px',
      font: '400 14px/1 var(--font-sans)'
    },
    pill: {
      background: 'transparent',
      color: onDark ? 'var(--ct-white)' : 'var(--text-on-light)',
      border: '1px solid ' + (onDark ? 'rgba(255,255,255,.7)' : 'var(--ct-forest-900)'),
      borderRadius: 'var(--radius-pill)',
      padding: '5px 12px',
      font: '400 12px/1 var(--font-sans)'
    },
    soft: {
      background: onDark ? 'rgba(168,252,120,.14)' : 'var(--ct-mist)',
      color: onDark ? 'var(--ct-lime)' : 'var(--ct-forest-800)',
      borderRadius: 'var(--radius-pill)',
      padding: '6px 12px',
      font: '500 12px/1 var(--font-sans)'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      whiteSpace: 'nowrap',
      ...v,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open,
  onClose,
  title,
  children,
  actions,
  tone = 'forest',
  width = 480,
  inline = false
}) {
  if (!open) return null;
  const bg = tone === 'lime' ? 'var(--ct-lime)' : tone === 'light' ? 'var(--ct-white)' : 'var(--ct-forest-800)';
  const fg = tone === 'forest' ? 'var(--ct-white)' : 'var(--text-on-light)';
  const panel = /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation(),
    style: {
      width,
      maxWidth: 'calc(100vw - 32px)',
      background: bg,
      color: fg,
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-6)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      boxShadow: 'var(--shadow-mockup)',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 26px/1.1 var(--font-display)',
      letterSpacing: '-0.02em'
    }
  }, title), onClose && /*#__PURE__*/React.createElement("button", {
    "aria-label": "Close",
    onClick: onClose,
    style: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      border: '1px solid currentColor',
      background: 'transparent',
      color: 'inherit',
      cursor: 'pointer',
      font: '400 18px/1 var(--font-sans)',
      flexShrink: 0
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 15px/1.5 var(--font-sans)',
      opacity: .85
    }
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      justifyContent: 'flex-end',
      flexWrap: 'wrap'
    }
  }, actions));
  if (inline) return panel;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(16,48,43,.6)',
      backdropFilter: 'blur(6px)',
      display: 'grid',
      placeItems: 'center',
      zIndex: 1000
    }
  }, panel);
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function Toast({
  children,
  tone = 'lime',
  icon,
  onClose,
  style
}) {
  const t = {
    lime: ['var(--ct-lime)', 'var(--ct-forest-900)'],
    dark: ['var(--ct-black)', 'var(--ct-white)'],
    error: ['var(--status-incorrect)', '#fff']
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      borderRadius: 'var(--radius-pill)',
      background: t[0],
      color: t[1],
      font: '500 14px/1.3 var(--font-sans)',
      ...style
    }
  }, icon, /*#__PURE__*/React.createElement("span", null, children), onClose && /*#__PURE__*/React.createElement("button", {
    "aria-label": "Dismiss",
    onClick: onClose,
    style: {
      background: 'transparent',
      border: 'none',
      color: 'inherit',
      cursor: 'pointer',
      font: '400 16px/1 var(--font-sans)',
      padding: 0,
      opacity: .7
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  content,
  children,
  placement = 'top',
  forceOpen = false
}) {
  const [o, setO] = React.useState(false);
  const show = o || forceOpen;
  const pos = placement === 'bottom' ? {
    top: 'calc(100% + 8px)'
  } : {
    bottom: 'calc(100% + 8px)'
  };
  return /*#__PURE__*/React.createElement("span", {
    onMouseEnter: () => setO(true),
    onMouseLeave: () => setO(false),
    style: {
      position: 'relative',
      display: 'inline-flex'
    }
  }, children, show && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      ...pos,
      background: 'var(--ct-black)',
      color: 'var(--ct-white)',
      font: '400 12px/1.3 var(--font-sans)',
      padding: '6px 10px',
      borderRadius: 'var(--radius-sm)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      zIndex: 10
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  onDark = true,
  radio = false,
  name,
  value,
  style
}) {
  const [inner, setInner] = React.useState(!!defaultChecked);
  const on = checked !== undefined ? checked : inner;
  const toggle = () => {
    if (checked === undefined) setInner(radio ? true : !on);
    onChange && onChange(radio ? true : !on, value);
  };
  const fg = onDark ? 'var(--ct-white)' : 'var(--text-on-light)';
  return /*#__PURE__*/React.createElement("label", {
    onClick: e => {
      e.preventDefault();
      toggle();
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer',
      font: '400 15px/1.3 var(--font-sans)',
      color: fg,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: radio ? 'radio' : 'checkbox',
    "aria-checked": on,
    style: {
      width: 20,
      height: 20,
      borderRadius: radio ? '50%' : 6,
      border: '1.5px solid ' + (on ? 'var(--ct-lime)' : onDark ? 'rgba(255,255,255,.5)' : 'var(--ct-sage)'),
      background: on && !radio ? 'var(--ct-lime)' : 'transparent',
      display: 'grid',
      placeItems: 'center',
      transition: 'all var(--dur-fast) var(--ease-out)',
      boxSizing: 'border-box'
    }
  }, on && (radio ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--ct-lime)'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 9,
      borderRight: '2px solid var(--ct-forest-900)',
      borderBottom: '2px solid var(--ct-forest-900)',
      transform: 'translateY(-1px) rotate(45deg)'
    }
  }))), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  hint,
  error,
  multiline = false,
  onDark = true,
  rows = 4,
  style,
  ...rest
}) {
  const [f, setF] = React.useState(false);
  const labelSt = {
    font: '500 13px/1.2 var(--font-sans)',
    color: onDark ? 'var(--ct-white)' : 'var(--text-on-light)'
  };
  const box = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 14px',
    font: '400 15px/1.4 var(--font-sans)',
    color: onDark ? 'var(--ct-white)' : 'var(--text-on-light)',
    background: onDark ? 'rgba(255,255,255,.04)' : 'var(--ct-white)',
    border: '1px solid ' + (error ? 'var(--status-incorrect)' : f ? 'var(--ct-lime)' : onDark ? 'var(--border-hairline-dark)' : 'var(--border-hairline-light)'),
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    boxShadow: f ? '0 0 0 3px rgba(168,252,120,.25)' : 'none',
    transition: 'border-color var(--dur-fast),box-shadow var(--dur-fast)'
  };
  const El = multiline ? 'textarea' : 'input';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: labelSt
  }, label), /*#__PURE__*/React.createElement(El, _extends({
    rows: multiline ? rows : undefined,
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      ...box,
      resize: multiline ? 'vertical' : undefined
    }
  }, rest)), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 12px/1.3 var(--font-sans)',
      color: error ? 'var(--status-incorrect)' : onDark ? 'var(--text-muted-dark)' : 'var(--text-muted-light)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function RadioGroup({
  options = [],
  value,
  defaultValue,
  onChange,
  onDark = true,
  direction = 'column',
  style
}) {
  const [inner, setInner] = React.useState(defaultValue);
  const v = value !== undefined ? value : inner;
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    style: {
      display: 'flex',
      flexDirection: direction,
      gap: direction === 'row' ? 20 : 12,
      ...style
    }
  }, options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lab = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement(__ds_scope.Checkbox, {
      key: val,
      radio: true,
      onDark: onDark,
      label: lab,
      checked: v === val,
      onChange: () => {
        setInner(val);
        onChange && onChange(val);
      }
    });
  }));
}
function Radio(props) {
  return /*#__PURE__*/React.createElement(__ds_scope.Checkbox, _extends({}, props, {
    radio: true
  }));
}
Object.assign(__ds_scope, { RadioGroup, Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  options = [],
  error,
  onDark = true,
  style,
  ...rest
}) {
  const [f, setF] = React.useState(false);
  const labelSt = {
    font: '500 13px/1.2 var(--font-sans)',
    color: onDark ? 'var(--ct-white)' : 'var(--text-on-light)'
  };
  const box = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 14px',
    font: '400 15px/1.4 var(--font-sans)',
    color: onDark ? 'var(--ct-white)' : 'var(--text-on-light)',
    background: onDark ? 'rgba(255,255,255,.04)' : 'var(--ct-white)',
    border: '1px solid ' + (error ? 'var(--status-incorrect)' : f ? 'var(--ct-lime)' : onDark ? 'var(--border-hairline-dark)' : 'var(--border-hairline-light)'),
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    boxShadow: f ? '0 0 0 3px rgba(168,252,120,.25)' : 'none',
    transition: 'border-color var(--dur-fast),box-shadow var(--dur-fast)'
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: labelSt
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      ...box,
      appearance: 'none',
      paddingRight: 40,
      cursor: 'pointer'
    }
  }, rest), options.map(o => typeof o === 'string' ? /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o,
    style: {
      color: '#000'
    }
  }, o) : /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value,
    style: {
      color: '#000'
    }
  }, o.label))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 14,
      top: '50%',
      width: 8,
      height: 8,
      borderRight: '1.5px solid currentColor',
      borderBottom: '1.5px solid currentColor',
      transform: 'translateY(-70%) rotate(45deg)',
      color: onDark ? 'var(--ct-lime)' : 'var(--ct-forest-800)',
      pointerEvents: 'none'
    }
  })), error && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 12px/1.3 var(--font-sans)',
      color: 'var(--status-incorrect)'
    }
  }, error));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  label,
  checked,
  defaultChecked,
  onChange,
  onDark = true,
  style
}) {
  const [inner, setInner] = React.useState(!!defaultChecked);
  const on = checked !== undefined ? checked : inner;
  return /*#__PURE__*/React.createElement("label", {
    onClick: e => {
      e.preventDefault();
      if (checked === undefined) setInner(!on);
      onChange && onChange(!on);
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer',
      font: '400 15px/1.3 var(--font-sans)',
      color: onDark ? 'var(--ct-white)' : 'var(--text-on-light)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "switch",
    "aria-checked": on,
    style: {
      width: 40,
      height: 24,
      borderRadius: 999,
      background: on ? 'var(--ct-lime)' : onDark ? 'rgba(255,255,255,.18)' : 'var(--ct-mist-200)',
      position: 'relative',
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: on ? 19 : 3,
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: on ? 'var(--ct-forest-900)' : 'var(--ct-white)',
      transition: 'left var(--dur-base) var(--ease-out)'
    }
  })), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = 'chip',
  onDark = true,
  style
}) {
  const [inner, setInner] = React.useState(defaultValue ?? (items[0] && (items[0].value ?? items[0])));
  const v = value !== undefined ? value : inner;
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: variant === 'underline' ? 24 : 8,
      borderBottom: variant === 'underline' ? '1px solid ' + (onDark ? 'var(--border-hairline-dark)' : 'var(--border-hairline-light)') : 'none',
      ...style
    }
  }, items.map(it => {
    const val = it.value ?? it;
    const lab = it.label ?? it;
    const on = val === v;
    const s = variant === 'underline' ? {
      padding: '10px 0',
      borderBottom: '2px solid ' + (on ? 'var(--ct-lime)' : 'transparent'),
      color: on ? onDark ? 'var(--ct-white)' : 'var(--text-on-light)' : onDark ? 'var(--text-muted-dark)' : 'var(--text-muted-light)',
      marginBottom: -1
    } : {
      padding: '8px 14px',
      borderRadius: 'var(--radius-pill)',
      background: on ? 'var(--ct-lime)' : 'transparent',
      color: on ? 'var(--ct-forest-900)' : onDark ? 'var(--ct-white)' : 'var(--text-on-light)',
      border: '1px solid ' + (on ? 'var(--ct-lime)' : onDark ? 'var(--border-hairline-dark)' : 'var(--border-hairline-light)')
    };
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      role: "tab",
      "aria-selected": on,
      onClick: () => {
        setInner(val);
        onChange && onChange(val);
      },
      style: {
        font: '500 14px/1 var(--font-sans)',
        cursor: 'pointer',
        background: 'transparent',
        border: 'none',
        transition: 'all var(--dur-fast) var(--ease-out)',
        ...s
      }
    }, lab);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// image-slot.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever a design needs an image.
 * You control the slot's shape; it sizes to its container by default. When the search_stock_photos tool
 * is available, prefill the slot by default — write the photo's URL into
 * src (with credit/credit-href); the user can still fill or replace it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The sidecar is a SIBLING of the HTML file that uses this component: the
 * read is a document-relative fetch, and the host resolves the bridge's
 * sidecar writes into the previewed file's directory to match (same
 * contract as design_canvas.jsx). Pages in the same directory share one
 * sidecar; keep slot ids distinct across them.
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          Initial framing baseline: cover | contain.   (default 'cover')
 *                cover starts the image filling the frame (overflow cropped);
 *                contain starts it fully visible (letterboxed). Either way the
 *                user can always pan/scale from there — double-click, or the
 *                Edit control, enters reframe mode (drag to move, scroll or
 *                corner-handles to scale; Escape / click-out commits). The
 *                crop persists alongside the image in the sidecar.
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. Prefill it with a real
 *                photo via search_stock_photos when that tool is available
 *                (set credit/credit-href from the result). A user drop
 *                overrides it; clearing the drop reveals src again.
 *   credit       Attribution text shown as a small overlay at the
 *                bottom-left of the filled slot. REQUIRED whenever src
 *                points at any Unsplash host (images.unsplash.com,
 *                plus.unsplash.com, …): an Unsplash src with no credit
 *                renders an error tile INSTEAD of the photo (Unsplash
 *                terms forbid showing their photos unattributed). Use the
 *                exact form 'Photo by {photographer name} on Unsplash' —
 *                the overlay then links the name to credit-href and
 *                'Unsplash' to the Unsplash homepage, and links back to
 *                unsplash.com automatically get the required utm referral
 *                params appended at render time. The credit belongs to
 *                the src image, so it only shows while src is what's
 *                displayed — a user-dropped image hides it.
 *   credit-href  Link for the photographer's name in the credit overlay
 *                (their Unsplash profile URL from the stock-photo search
 *                results). http(s) URLs only — anything else renders the
 *                name as plain text.
 *
 * Sizing: the slot fills its container by default (width/height 100%).
 * Put it in a sized wrapper — absolutely positioned, a grid cell, a fixed
 * frame — and it takes exactly that box. When the parent's height is
 * indefinite (ordinary flow), it falls back to full width at a 3:2 aspect
 * ratio instead of collapsing. In a shrink-to-fit parent (a float,
 * width:max-content, an unsized absolute wrapper), percentages have
 * nothing to resolve against — size the slot or its wrapper explicitly
 * there. For a fixed-size slot, set
 * width/height on the element itself (inline style), which overrides the
 * default. When
 * layering content above a slot (full-bleed layouts), make the overlay
 * click-through — pointer-events: none on scrims/text plates, re-enabled
 * on interactive children — so the slot's hover controls stay reachable.
 * Keep the slot's bottom-left corner visually clear as well: the credit
 * overlay renders there, and a dark fade or text plate covering it hides
 * the attribution Unsplash's terms require — end the fade above that
 * corner, or keep it nearly transparent where the credit sits.
 *
 * Usage:
 *   <div style="position:relative;width:100%;height:100%">      <!-- full-bleed: -->
 *     <image-slot id="bg" shape="rect"></image-slot>            <!-- fills the wrapper -->
 *   </div>
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';

  // Unsplash terms require visible attribution wherever their photos
  // display, and every link back to unsplash.com must carry utm referral
  // params. Two render-time rules enforce that here:
  //  - an Unsplash-src slot with NO credit attribute renders an error
  //    tile INSTEAD of the photo (an uncredited Unsplash photo on screen
  //    is itself the terms violation, so it never renders bare);
  //  - rendered credit links pointing at unsplash.com get the referral
  //    params appended when absent (credit-href values live in page
  //    content that can't be edited after the fact).
  // Keep the utm_source value in sync with UTM_SOURCE in
  // platform/web-agent/unsplash.ts — this file is a project-local
  // artifact and cannot import it (equality is pinned by tests).
  const UNSPLASH_HOMEPAGE_HREF = 'https://unsplash.com/?utm_source=claude_design&utm_medium=referral';
  // Host rule mirrors the hotlink validator that admits Unsplash srcs into
  // pages in the first place (cdn$ in unsplash.ts: apex or any subdomain)
  // — Unsplash+ results serve from plus.unsplash.com, not just images.*,
  // and an admitted-but-uncredited photo must error whatever unsplash
  // host it rides on.
  // Trailing-dot FQDNs (images.unsplash.com.) are the same host to the
  // browser but would miss the regex — strip one dot so the check fails
  // CLOSED (unrecognized-but-real Unsplash srcs must error, not render).
  const isUnsplashHost = u => {
    try {
      return /(^|\.)unsplash\.com$/.test(new URL(u, document.baseURI).hostname.replace(/\.$/, ''));
    } catch {
      return false;
    }
  };
  // Render-time referral normalization for links back to Unsplash:
  // appends utm_source/utm_medium when absent, preserves every existing
  // query param, never overwrites an existing utm_source, and passes
  // non-Unsplash URLs through untouched. Input is an ABSOLUTE validated
  // http(s) URL (the credit render funnel resolves + validates first).
  const withReferral = href => {
    try {
      const u = new URL(href);
      if (!/(^|\.)unsplash\.com$/.test(u.hostname.replace(/\.$/, ''))) {
        return href;
      }
      if (!u.searchParams.has('utm_source')) {
        u.searchParams.set('utm_source', 'claude_design');
      }
      if (!u.searchParams.has('utm_medium')) {
        u.searchParams.set('utm_medium', 'referral');
      }
      return u.toString();
    } catch (e) {
      return href;
    }
  };
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  // Unload-time flush: save()'s serialization defers a mid-RTT re-fire to a
  // .then that never runs in an unloading document, silently dropping a
  // pagehide commit. Post the current slots immediately instead — content
  // is a superset snapshot of any in-flight save's, the write is a
  // whole-file last-writer-wins replace, and postMessage FIFO delivers it
  // to the host after the in-flight one, so a backend-side reorder at
  // worst reproduces the dropped-commit outcome this flush improves on.
  // Guarded on the initial sidecar read: pre-hydration slots can miss
  // other slots' persisted entries, and flushing it would clobber them —
  // that narrow case stays best-effort (the in-memory merge in load()
  // cannot happen in an unloading document anyway).
  function flushNow() {
    if (!loaded) return;
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    try {
      Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {});
    } catch (e) {}
  }
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet =
  // Fill the container by default: slots are usually placed inside a
  // sized wrapper (a hero frame, a grid cell, an inset:0 layer) and are
  // expected to take that box — a fixed intrinsic size would render as
  // a small tile in the corner of a full-bleed wrapper instead.
  // aspect-ratio is the companion fallback that keeps a bare slot
  // visible when the parent's height is indefinite: height:100%
  // resolves to auto there, and the ratio then derives height from
  // width instead of letting the slot collapse to zero height.
  // Explicit width/height on the element override all of this.
  // color:inherit (not a fixed near-black): the placeholder chrome —
  // empty-state icon/caption (currentColor) and the dashed ring — must
  // read on dark decks too, and the slide's own text color is the one
  // color guaranteed to contrast with the slide background. The soft
  // look comes from opacity on those parts, not from a baked-in alpha.
  ':host{display:block;position:relative;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;' + '  width:100%;height:100%;aspect-ratio:3/2}' + '.empty .cap,.empty .sub{opacity:.75}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(127,127,127,.08)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  // popover=manual promotes the spill to the top layer on reframe, so it is
  // not clipped by any overflow:hidden / clip-path / scroll-container
  // ancestor (a plain z-index can't escape overflow clipping). UA popover
  // defaults (inset:0;margin:auto) are reset; _applyView sets viewport px.
  '.spill{position:fixed;margin:0;inset:auto;border:0;padding:0;background:transparent;' + '  overflow:visible;transform:translate(-50%,-50%);z-index:1;cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px}' + '.empty:hover .sub{opacity:1}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed currentColor;' + '  opacity:.35;transition:border-color .12s,opacity .12s}' + ':host([data-over]) .ring{border-color:#c96442;opacity:1}' + ':host([data-filled]) .ring{display:none}' +
  // Controls overlay INSIDE the frame, pinned to the top-right corner, so
  // a full-bleed slot in an overflow:hidden container still shows them
  // (the old below-mask placement got clipped). Credit sits bottom-left,
  // so top-right avoids collision. The blurred pill background keeps them
  // legible over the image.
  // The UA [popover] base rule styles the element in EVERY state (only
  // display:none is gated on :not(:popover-open), and the display:flex
  // below overrides that) — so the UA resets live HERE, like .spill's,
  // or the ordinary hover-state strip renders as a bordered Canvas box
  // centered by margin:auto. inset:auto precedes top/right (shorthand).
  '.ctl{position:absolute;inset:auto;top:8px;right:8px;margin:0;border:0;padding:0;' + '  background:transparent;overflow:visible;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' +
  // While reframing, the spill owns the top layer and would swallow every
  // click on the in-frame controls. Promoting .ctl into the top layer
  // ABOVE the spill (shown after it — later popovers stack higher) keeps
  // Edit-as-toggle and Replace clickable mid-reframe. _applyView pins it
  // to the frame's top-right in viewport px (translateX(-100%)
  // right-aligns against the computed left edge); inset:auto clears the
  // base rule's top/right so the inline left/top position it alone.
  '.ctl:popover-open{position:fixed;inset:auto;transform:translateX(-100%)}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}' +
  // Replacement in flight: after a src swap the browser keeps painting
  // the PREVIOUS image until the new one decodes, so a Replace would
  // flash the old photo and then pop. Hide the stale frame (visibility,
  // not display — _applyView geometry still applies) and spin until the
  // new image reports in (load/error clears data-swapping).
  ':host([data-swapping]) .frame img{visibility:hidden}' + '.loading{position:absolute;inset:0;display:none;align-items:center;' + '  justify-content:center;pointer-events:none}' + ':host([data-swapping]) .loading{display:flex}' + '.loading::after{content:"";width:22px;height:22px;border-radius:50%;' + '  border:2px solid rgba(127,127,127,.25);border-top-color:currentColor;' + '  animation:om-slot-spin .7s linear infinite}' + '@keyframes om-slot-spin{to{transform:rotate(360deg)}}' +
  // Reduced motion: the static two-tone ring still reads as "working".
  '@media (prefers-reduced-motion:reduce){.loading::after{animation:none}}' + '.credit{position:absolute;left:6px;bottom:6px;max-width:calc(100% - 12px);display:none;' + '  padding:3px 7px;border-radius:5px;background:rgba(0,0,0,.55);color:#fff;' + '  font:10px/1.2 system-ui,-apple-system,sans-serif;text-decoration:none;' + '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;backdrop-filter:blur(6px)}' +
  // The credit is a SPAN holding one or two <a>s (Unsplash's prescribed
  // form links the photographer AND Unsplash) — anchors style inline so
  // the overlay reads as one line of text.
  '.credit a{color:inherit;text-decoration:none}' + '.credit a:hover,.credit a:focus-visible{text-decoration:underline}' + ':host([data-filled][data-credit]) .credit{display:block}' +
  // Exports must ship JUST the image — no hover controls, no credit chip
  // (the host marks <html data-om-exporting> for the capture window; the
  // page-level hide script can't reach shadow DOM, this rule can).
  ':host-context([data-om-exporting]) .ctl,' + ':host-context([data-om-exporting]) .credit{display:none !important}' +
  // Print must ship just the image too: the hover-gated controls can be
  // mid-hover when print() fires, and the credit chip is screen chrome —
  // the same rule the capture window gets, keyed on print media instead
  // of the host's data-om-exporting mark (the print path sets no mark).
  '@media print{.ctl,.credit{display:none !important}}' +
  // No export-window mask rules here on purpose: the export capture
  // releases the replacement mask by REMOVING data-swapping (the
  // shadow-root pass in pages/export/shared.ts HIDE_EXPORT_CHROME_SCRIPT)
  // — attribute removal works in every engine (:host-context is
  // Chromium-only), is scoped by construction to slots actually
  // mid-swap, and hides the spinner through the same gate. A masked img
  // would otherwise be silently dropped from PPTX decks (the capture
  // walk skips visibility:hidden imgs).
  // Attribution error tile: REPLACES the photo when an Unsplash src has
  // no credit attribute — rendering the photo uncredited is the terms
  // violation, so the photo must not appear at all.
  // Calm and neutral on purpose (review feedback): the tile informs the
  // user; the fix instructions are machine-facing (usage docblock, tool
  // description, and the turn-end scan's bounce copy name the attributes
  // for the agent).
  '.attr-error{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  background:#f2f1ef;color:#6e6c66;user-select:none;' + '  font:13px/1.45 system-ui,-apple-system,sans-serif}' + '.attr-error svg{opacity:.55}' + '.attr-error .cap{max-width:92%;font-weight:500;letter-spacing:.01em}' + ':host([data-attribution-error]) .attr-error{display:flex}' + ':host([data-attribution-error]) .ring{display:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  const warnIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>' + '<path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'placeholder', 'src', 'id', 'credit', 'credit-href'];
    }

    /** Duplicate-slide hook (called by deck-stage, see its
     *  _remintDuplicateIds): copy this id's stored image, if any, under a
     *  freshly minted key and return that key — so a duplicated slide's
     *  slot keeps its dropped photo instead of reverting to the
     *  placeholder. 'isFree' is the caller's uniqueness check (document
     *  ids); candidates must ALSO be unused in the sidecar, which can
     *  hold keys from other pages sharing the project root. (An EMPTY
     *  slot on another page leaves no sidecar entry, so its id is not
     *  detectable here — a minted key can collide with it and that slot
     *  would show this photo. Same blast radius as two pages reusing an
     *  id by hand, which the shared sidecar already permits.) Returns null
     *  when no id could be minted (caller strips the id, today's
     *  behavior). */
    static cloneSlot(fromId, isFree) {
      if (typeof fromId !== 'string' || !fromId) return null;
      // Pre-hydration the store can't veto candidates or source the copy
      // — degrade to the strip (today's behavior) rather than mint
      // against keys we can't see yet. Any rendered (= droppable) slot
      // means load() has already settled.
      if (!loaded) return null;
      const stem = fromId.replace(/-\d+$/, '') || fromId;
      for (let n = 2; n < 100; n++) {
        const toId = stem + '-' + n;
        if (toId === fromId) continue;
        if (slots[toId] !== undefined) {
          // Reuse a key holding this exact value (bytes AND crop) if no
          // live element here owns it — a duplicate op the host refused
          // after minting leaves such a key behind, and reusing keeps
          // refused retries from accumulating one orphaned copy per
          // attempt. Full equality (not just bytes) so a byte-identical
          // key another PAGE owns with its own crop is stepped past, not
          // adopted or rewritten. (Entries without .u never match.)
          const prev = getSlot(toId);
          const cur = getSlot(fromId);
          if (!(prev && cur && prev.u && prev.u === cur.u && prev.s === cur.s && prev.x === cur.x && prev.y === cur.y && (typeof isFree !== 'function' || isFree(toId)))) continue;
          return toId;
        }
        if (typeof isFree === 'function' && !isFree(toId)) continue;
        const v = getSlot(fromId);
        if (v) setSlot(toId, Object.assign({}, v));
        return toId;
      }
      return null;
    }
    constructor() {
      super();
      // clonable: rail thumbnails deep-clone slides and carry this shadow
      // along; reuse an already-cloned root so upgrade-after-clone works.
      // (Deliberately NOT serializable — a getHTML consumer would embed
      // multi-MB sidecar data-URLs into serialized page HTML.)
      const root = this.shadowRoot || this.attachShadow({
        mode: 'open',
        clonable: true
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="attr-error" part="attribution-error">' + warnIcon + '    <div class="cap">This photo needs attribution</div></div>' + '  <div class="loading" part="loading"></div>' + '  <div class="ring" part="ring"></div>' + '</div>' +
      // Outside .frame, like .spill/.ctl — the frame's overflow:hidden +
      // border-radius/clip-path would cut the credit off on circle/pill/mask.
      // A SPAN, not an <a>: the prescribed Unsplash credit holds two links
      // (photographer + Unsplash), built per-render in _render().
      '<span class="credit" part="credit"></span>' + '<div class="spill" popover="manual" data-dc-edit-transparent>' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' +
      // data-dc-edit-transparent: the DC editor's edit-mode picker lets
      // clicks through for chrome marked with it (EDIT_TRANSPARENT_SEL)
      // — without it, Replace/Edit clicks in Edit mode are swallowed by
      // element selection and the controls look dead.
      '<div class="ctl" popover="manual" data-dc-edit-transparent><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="edit" title="Reframe image">Edit</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ctl = root.querySelector('.ctl');
      this._credit = root.querySelector('.credit');
      this._attrError = root.querySelector('.attr-error');
      // Credit clicks open the link, not browse/reframe.
      this._credit.addEventListener('click', e => e.stopPropagation());
      this._credit.addEventListener('dblclick', e => e.stopPropagation());
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      // Encode-in-flight marker (the owning _ingest generation): while set,
      // the same-src "nothing in flight" clear in _render must not fire —
      // the stored value still points at the OLD image until the encode
      // lands, so that clear would unmask the stale image mid-replace.
      this._swapGen = 0;
      // Render-owned swap in flight: set when _render assigns a new src,
      // cleared only by the img's own load/error (or the empty branch).
      // img.complete CANNOT stand in for this — setting src only QUEUES
      // the current-request swap (a microtask), so synchronously after an
      // assignment, complete still reports the OLD settled request. The
      // pick path does exactly that: the host sets src, credit, and
      // credit-href back-to-back in one task, and renders #2/#3 would
      // read the stale complete === true and drop the mask one render
      // after it was set.
      this._loadPending = false;
      // See _render's empty branch: a transient attribution-error wipe of a
      // showing image must make the follow-up render a replacement (spinner),
      // not a first fill (blank frame).
      this._hidShowing = false;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        // The hidden controls are opacity-0 but still tabbable — without
        // this gate a keyboard user could drive them on a read-only share
        // link (mirrors the dblclick handler's editable gate).
        if (!this.hasAttribute('data-editable')) return;
        if (act === 'replace') {
          this._exitReframe(true);
          // Host-owned picker (Unsplash modal; it also offers local import).
          this.dispatchEvent(new CustomEvent('image-slot:pick', {
            bubbles: true,
            composed: true,
            detail: {
              id: this.id || null
            }
          }));
        }
        if (act === 'edit') {
          if (!this._reframes()) return;
          if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      // load/error also release the replacement-in-flight mask (via the
      // single discipline in _releaseMask): the swap is only revealed once
      // the new image can actually paint (on error the frame shows its
      // background, same as a fresh slot with a broken src).
      this._img.addEventListener('load', () => {
        this._loadPending = false;
        this._releaseMask(true);
        this._applyView();
      });
      this._img.addEventListener('error', () => {
        this._loadPending = false;
        this._releaseMask(true);
      });
      // Gated only on editable — any filled slot can be repositioned/scaled,
      // regardless of fit. Share links (no writeFile) stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
          const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // The host may inject window.omelette.writeFile AFTER the first render;
      // re-render on hover so the editable-gated controls reliably appear.
      this.addEventListener('pointerenter', this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('pointerenter', this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      // commit=false: a disconnect is not a user intent — committing here
      // would persist whatever half-finished drag a React remount or DOM
      // splice happened to interrupt. Deliberate exits commit on their own
      // paths (Escape/click-out/toggle), and unloads commit via pagehide.
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._signalReframe(true);
      // Best-effort commit when the document unloads mid-reframe (a host
      // navigation racing the enter signal, a manual reload, tab close):
      // the sidecar write rides the host bridge, which outlives this
      // document, so the crop survives even though the mode dies with the
      // DOM. Held on the instance so _exitReframe detaches exactly what
      // was attached.
      this._pagehide = () => {
        this._exitReframe(true);
        flushNow();
      };
      window.addEventListener('pagehide', this._pagehide);
      // Promote spill to the top layer, then keep it pinned over the frame:
      // scroll/resize cover the common cases, and a per-frame rect check
      // catches layout shifts that fire neither (an image above finishing
      // load, streamed DOM pushing the slot down, an ancestor transform
      // change) so the overlay can't detach from the frame.
      try {
        this._spill.showPopover();
      } catch {}
      // After the spill, so the controls stack above it in the top layer.
      try {
        this._ctl.showPopover();
      } catch {}
      this._reposition = () => {
        if (this.hasAttribute('data-reframe')) this._applyView();
      };
      window.addEventListener('scroll', this._reposition, true);
      window.addEventListener('resize', this._reposition);
      this._lastRect = '';
      this._watch = () => {
        if (!this.hasAttribute('data-reframe')) return;
        const r = this.getBoundingClientRect();
        const key = r.left + ',' + r.top + ',' + r.width + ',' + r.height;
        if (key !== this._lastRect) {
          this._lastRect = key;
          this._applyView();
        }
        this._watchId = requestAnimationFrame(this._watch);
      };
      this._watchId = requestAnimationFrame(this._watch);
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (this._reposition) {
        window.removeEventListener('scroll', this._reposition, true);
        window.removeEventListener('resize', this._reposition);
        this._reposition = null;
      }
      if (this._watchId) {
        cancelAnimationFrame(this._watchId);
        this._watchId = 0;
      }
      if (this._pagehide) {
        window.removeEventListener('pagehide', this._pagehide);
        this._pagehide = null;
      }
      try {
        this._spill.hidePopover();
      } catch {}
      try {
        this._ctl.hidePopover();
      } catch {}
      this._ctl.style.left = '';
      this._ctl.style.top = '';
      if (commit) this._commitView();
      this._signalReframe(false);
    }

    // Reframe state lives only in this DOM until commit, invisible to the
    // host's dirty signals — announce enter/exit so the host can hold
    // auto-reloads for exactly the gesture (the guest bundle forwards
    // image-slot:reframe to the host as imageSlotReframe). Dispatched on
    // the element (composed, so it escapes shadow roots) while connected;
    // a disconnected exit (disconnectedCallback) falls back to document so
    // the host still hears it.
    _signalReframe(active) {
      const target = this.isConnected ? this : document;
      target.dispatchEvent(new CustomEvent('image-slot:reframe', {
        bubbles: true,
        composed: true,
        detail: {
          active: active,
          id: this.id || null
        }
      }));
    }

    // Public: host's "Import from computer" calls this to run local browse.
    openFilePicker() {
      this._exitReframe(true);
      this._input.click();
    }

    // A src write is a newer intent for this slot's content — the host
    // pick path (setImageSlotImage) or an agent edit — so it must win
    // over any encode still in flight from an earlier drop: left live,
    // that encode lands later, passes _ingest's gen guard, and its
    // setSlot silently overwrites the pick (the stored value shadows
    // src in _render). Bumping _gen kills the encode before its own
    // _swapGen clear runs, so clear the dead claim here too — otherwise
    // _releaseMask (gated on !_swapGen) never fires and the pick's
    // spinner is stranded. src ONLY: the pick sets credit/credit-href
    // in the same task, and clearing _swapGen on those would let the
    // same-src branch unmask the old image mid-encode.
    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'src' && oldVal !== newVal) {
        this._gen++;
        this._swapGen = 0;
      }
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      // Replacing a shown image: surface the swap through the encode too,
      // not just the decode — otherwise the old photo sits there with no
      // feedback while the canvas re-encode runs. An empty slot keeps its
      // placeholder (no spinner) until the encode lands, as before.
      // _swapGen guards the mask against re-renders DURING the encode
      // (pointerenter, ResizeObserver, another slot's store write): the
      // stored value still resolves to the old image there, so _render's
      // same-src clear would otherwise unmask it mid-replace.
      if (this.hasAttribute('data-filled')) {
        this.setAttribute('data-swapping', '');
        this._swapGen = gen;
      }
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        // Clear BEFORE setSlot: its synchronous re-render must see no
        // pending encode, so a byte-identical re-upload (same data URL, no
        // load event coming) still clears the mask via the complete branch.
        this._swapGen = 0;
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._swapGen = 0;
        // Reveal the kept old image — unless another replacement (a
        // remote pick's src swap) is still in flight, in which case the
        // mask stays until THAT image settles (its load/error releases).
        this._releaseMask();
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is available on any filled slot — the user can
    // always reposition/scale. `fit` only sets the initial baseline (see
    // _geom): contain starts fully-visible, cover starts frame-filling.
    _reframes() {
      return this.hasAttribute('data-filled');
    }

    // The single release discipline for the replacement-in-flight mask
    // (data-swapping). The mask comes off only when BOTH hold:
    //  - no encode is pending (_swapGen) — mid-encode the stored value
    //    still resolves to the old image, so any reveal paints it;
    //  - the frame img has settled on its current src — an unsettled src
    //    means some replacement is still in flight (e.g. a remote pick),
    //    whoever started it, and revealing would paint the previous
    //    frame. The load/error listeners pass settled=true (the event IS
    //    the settlement signal, per spec complete is true by then);
    //    other callers rely on the complete flag (covers loaded AND
    //    failed).
    // Every release path funnels through here EXCEPT _render's empty
    // branch (the img is being cleared — nothing will ever settle).
    _releaseMask(settled) {
      if (!this._swapGen && !this._loadPending && (settled || this._img.complete)) {
        this.removeAttribute('data-swapping');
      }
    }

    // Baseline geometry, shared by clamp/apply/resize. `base` is the scale at
    // view-scale s=1: cover = fill the frame (overflow on the looser axis),
    // contain = fit fully inside (letterboxed). Zooming a contain image past
    // s where it overflows naturally becomes a crop. Null until the img has
    // loaded (naturalWidth is 0 before that) or when the slot has no layout
    // box — ResizeObserver fires with a 0×0 rect under display:none, and
    // clamping against a degenerate 1×1 frame would silently pull the stored
    // pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
      const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
      return {
        iw,
        ih,
        fw,
        fh,
        base
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      // Top-layer controls: pin to the frame's top-right in viewport px
      // (the same 8px inset as the in-frame layout; unscaled — top-layer UI
      // reads as chrome, not page content). BEFORE the geometry branch:
      // placement needs only the frame rect, and a not-yet-loaded or broken
      // src must not leave the promoted strip floating unpositioned. Gated
      // on the popover actually being open: without the Popover API,
      // showPopover() threw (swallowed in _enterReframe), .ctl stays in
      // its in-frame absolute layout, and viewport-px coordinates would
      // shove it off-frame — and matches(':popover-open') itself throws
      // there (unknown pseudo-class), hence the try/catch.
      if (this.hasAttribute('data-reframe')) {
        let onTop = false;
        try {
          onTop = this._ctl.matches(':popover-open');
        } catch {}
        if (onTop) {
          const r = this.getBoundingClientRect();
          this._ctl.style.left = r.right - 8 + 'px';
          this._ctl.style.top = r.top + 8 + 'px';
        }
      }
      if (!g) {
        // Dimensions not known yet (before img load) — centered fit so there
        // is no flash of an unpositioned image before the geometry lands.
        const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = contain ? 'contain' : 'cover';
        return;
      }
      // Baseline (cover-fill or contain-fit) × view scale. Width/height and
      // left/top are all frame-% — depends only on the frame aspect ratio, so
      // a responsive resize keeps the same crop. The spill layer mirrors the
      // same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      if (this.hasAttribute('data-reframe')) {
        // Top-layer spill: position in viewport px over the frame. The top
        // layer escapes ancestor transforms entirely, so EVERY term must be
        // in viewport units: getBoundingClientRect gives the frame's scaled
        // origin AND size, and the rect/layout ratio rescales the ghost —
        // sizing from layout px alone renders it 1/scale too large under a
        // scaled deck slide. Inner ghost + handles stay box-relative.
        const r = this.getBoundingClientRect();
        const sx = g.fw ? r.width / g.fw : 1;
        const sy = g.fh ? r.height / g.fh : 1;
        this._spill.style.width = g.iw * k * sx + 'px';
        this._spill.style.height = g.ih * k * sy + 'px';
        this._spill.style.left = r.left + (50 + this._view.x) / 100 * r.width + 'px';
        this._spill.style.top = r.top + (50 + this._view.y) / 100 * r.height + 'px';
      }
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      // An Unsplash src with no credit attribute must NOT render — showing
      // the photo uncredited is the Unsplash-terms violation itself. The
      // error tile replaces the photo until the credit is written. A
      // user-dropped image is the user's own content and always renders.
      // Trimmed: credit is agent/user-editable content, and a whitespace-
      // only value must count as missing — otherwise it would suppress the
      // error tile AND render an empty credit box (no text, no links),
      // exactly the unattributed state this gate exists to prevent.
      const credit = (this.getAttribute('credit') || '').trim();
      const attrError = !!(!credit && !this._userUrl && srcAttr && isUnsplashHost(srcAttr));
      this.toggleAttribute('data-attribution-error', attrError);
      if (url && !attrError) {
        const prev = this._img.getAttribute('src');
        if (prev !== url) {
          // Replacing an already-shown image: mark the swap BEFORE setting
          // src so the stale frame is never revealed (see the data-swapping
          // stylesheet rules). First fill (prev empty) keeps the existing
          // placeholder-until-load behavior — no spinner. _hidShowing
          // covers the pick path's transient attribution-error wipe: prev
          // is gone, but an image WAS showing, so this is a replacement.
          if (prev || this._hidShowing) this.setAttribute('data-swapping', '');
          // Mark the swap BEFORE assigning src: complete keeps reporting
          // the old settled request until the browser's
          // update-the-image-data microtask runs, so same-task re-renders
          // (the pick path's credit/credit-href setAttributes) need this
          // flag, not complete, to know a load is in flight.
          this._loadPending = true;
          this._img.src = url;
          this._ghost.src = url;
        } else {
          // Same-src re-render — release if settled, so an ingest-set
          // spinner can't stick after a byte-identical re-upload (same
          // data URL, no further load event ever fires).
          this._releaseMask();
        }
        this._hidShowing = false;
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this.removeAttribute('data-swapping');
        // The src is being removed — no load/error will ever fire for it.
        this._loadPending = false;
        // A transient attribution-error wipe of a showing image happens on
        // the pick path: the host sets src one setAttribute before credit,
        // so render N hides the old image (attrError) and render N+1
        // restores a URL. Remember the wipe so that restore renders as a
        // replacement (spinner), not a first fill (blank frame).
        this._hidShowing = attrError && !!this._img.getAttribute('src');
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        // The error tile owns the blocked-photo state; .empty stays for
        // the genuinely-empty slot.
        this._empty.style.display = attrError ? 'none' : 'flex';
        this.removeAttribute('data-filled');
      }

      // Credit belongs to the author src, so a user drop hides it.
      // textContent + the http(s)-only funnel keep external strings inert.
      const showCredit = !!(url && credit && !this._userUrl && !attrError);
      this._credit.textContent = '';
      if (showCredit) {
        // Validate once (resolved against the document, http(s) only),
        // then append the terms-required utm referral params to links
        // that point back at unsplash.com.
        let href = '';
        const rawHref = this.getAttribute('credit-href') || '';
        if (rawHref) {
          try {
            const u = new URL(rawHref, document.baseURI);
            if (u.protocol === 'http:' || u.protocol === 'https:') {
              href = withReferral(u.href);
            }
          } catch {}
        }
        const mkLink = (text, linkHref) => {
          const a = document.createElement('a');
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          a.setAttribute('href', linkHref);
          a.textContent = text;
          return a;
        };
        // Unsplash's prescribed credit is TWO links — the photographer's
        // name to their profile (credit-href) and 'Unsplash' to the
        // homepage. Render that split whenever the text has the canonical
        // shape; other text keeps the legacy single-link rendering.
        const m = /^Photo by (.+) on Unsplash$/.exec(credit);
        if (m) {
          this._credit.appendChild(document.createTextNode('Photo by '));
          this._credit.appendChild(href ? mkLink(m[1], href) : document.createTextNode(m[1]));
          this._credit.appendChild(document.createTextNode(' on '));
          this._credit.appendChild(mkLink('Unsplash', UNSPLASH_HOMEPAGE_HREF));
        } else if (href) {
          this._credit.appendChild(mkLink(credit, href));
        } else {
          this._credit.textContent = credit;
        }
      }
      this.toggleAttribute('data-credit', showCredit);
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "image-slot.js", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
const {
  Icon,
  Tag,
  Logo
} = window.ColorteamDesignSystem_c88c1f;
function Card({
  children,
  bg,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 20,
      background: bg || W.field,
      overflow: 'hidden',
      position: 'relative',
      ...style
    }
  }, children);
}
function Hero({
  go
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'clamp(96px,12vw,170px) 0 40px',
      background: 'linear-gradient(180deg,#fff 0%,#fff 55%,#EAF7DE 100%)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: W.wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '6px 14px 6px 6px',
      borderRadius: 999,
      background: W.field,
      font: '500 14px/1 var(--font-sans)',
      color: W.ink
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: W.ink,
      color: 'var(--ct-lime)',
      borderRadius: 999,
      padding: '6px 10px',
      fontWeight: 600
    }
  }, "New"), "The Colorteam Podcast is live", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 14
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: '600 clamp(52px,7.2vw,100px)/1.1 var(--font-sans)',
      letterSpacing: '-0.04em',
      color: W.ink,
      maxWidth: 1000,
      textWrap: 'balance'
    }
  }, "Your brand ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontWeight: 500,
      letterSpacing: 0
    }
  }, "&"), " growth partner"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: '400 20px/1.4 var(--font-sans)',
      color: W.mute,
      maxWidth: 520
    }
  }, "Branding, design, marketing and web development for startups \u2014 from Warsaw and Lagos."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(ArrowBtn, {
    onClick: () => go('contact')
  }, "Get started"), /*#__PURE__*/React.createElement("button", {
    onClick: () => go('work'),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '0 22px',
      height: 52,
      borderRadius: 999,
      border: '1px solid ' + W.line,
      background: '#fff',
      color: W.ink,
      font: '500 16px/1 var(--font-sans)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 16
  }), "See our work"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'clamp(48px,6vw,80px)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
      gap: 20,
      alignItems: 'end'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    bg: "var(--ct-studio-grey)",
    style: {
      height: 360
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/imagery/portrait-cutout-woman-desaturated.png",
    alt: "",
    style: {
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      height: '96%'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 16,
      bottom: 16,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: '#fff',
      borderRadius: 999,
      padding: '8px 12px',
      font: '500 14px/1 var(--font-sans)',
      color: W.ink,
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: 10,
      height: 10,
      background: 'var(--ct-lime)',
      borderRadius: 2
    }
  }), "Marketing Team")), /*#__PURE__*/React.createElement(Card, {
    bg: "#fff",
    style: {
      height: 258,
      border: '1px solid ' + W.line,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
      textAlign: 'center',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 56px/1 var(--font-sans)',
      letterSpacing: '-0.04em',
      color: W.ink
    }
  }, "80+"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 16px/1.4 var(--font-sans)',
      color: W.mute,
      maxWidth: 150
    }
  }, "Startups branded and launched")), /*#__PURE__*/React.createElement(Card, {
    bg: W.dark,
    style: {
      height: 420
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/examples/mockups-podcast-studio.jpg",
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: .9
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 20,
      bottom: 20,
      right: 20,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 24px/1.3 var(--font-sans)',
      color: '#fff',
      maxWidth: 180
    }
  }, "Trusted & transparent growth"), /*#__PURE__*/React.createElement(Logo, {
    variant: "podcast",
    tone: "lime",
    height: 48,
    assetBase: "../../assets/logo"
  }))), /*#__PURE__*/React.createElement(Card, {
    bg: "#fff",
    style: {
      height: 338,
      border: '1px solid ' + W.line,
      padding: 24,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 56px/1 var(--font-sans)',
      letterSpacing: '-0.04em',
      color: W.ink
    }
  }, "2"), /*#__PURE__*/React.createElement("span", {
    style: {
      margin: '6px 0 18px',
      font: '500 16px/1.4 var(--font-sans)',
      color: W.mute
    }
  }, "Studios, one team, global clients"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap',
      marginTop: 'auto'
    }
  }, ['Warsaw', 'Lagos', 'Global'].map(c => /*#__PURE__*/React.createElement("span", {
    key: c,
    style: {
      padding: '10px 16px',
      borderRadius: 40,
      background: W.ink,
      color: 'var(--ct-lime)',
      font: '500 16px/1 var(--font-sans)'
    }
  }, c)))))));
}
function About() {
  return /*#__PURE__*/React.createElement("section", {
    style: W.sec
  }, /*#__PURE__*/React.createElement("div", {
    style: W.wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
      gap: 'clamp(32px,6vw,100px)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Pill, null, "About Colorteam"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: '600 clamp(36px,4vw,56px)/1.1 var(--font-sans)',
      letterSpacing: '-0.04em',
      color: W.ink
    }
  }, "We love startups. We build the brand, then the engine that grows it.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: '400 20px/1.5 var(--font-sans)',
      color: W.mute
    }
  }, "One team across strategy, identity, campaigns and web \u2014 so what you launch looks, sounds and performs the same everywhere."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
      gap: 20,
      borderTop: '1px solid ' + W.line,
      paddingTop: 24
    }
  }, [['13.5K', 'Instagram community'], ['98', 'Posts in the playbook'], ['4', 'Core services']].map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: l
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 40px/1.1 var(--font-sans)',
      letterSpacing: '-0.04em',
      color: W.ink
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 16px/1.4 var(--font-sans)',
      color: W.mute,
      marginTop: 6
    }
  }, l))))))));
}
function WorkTile({
  w,
  onOpen,
  big
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onOpen(w);
    },
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      textDecoration: 'none',
      color: W.ink,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: big ? '16/11' : '4/3',
      borderRadius: 20,
      overflow: 'hidden',
      background: '#000',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: w.img,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: h ? 'scale(1.04)' : 'none',
      transition: 'transform 600ms ease'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 16,
      top: 16,
      width: 48,
      height: 48,
      borderRadius: 999,
      background: 'var(--ct-lime)',
      display: 'grid',
      placeItems: 'center',
      opacity: h ? 1 : 0,
      transform: h ? 'scale(1)' : 'scale(.8)',
      transition: 'all 400ms ease'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-up-right",
    size: 20,
    color: W.ink
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 24px/1.3 var(--font-sans)',
      letterSpacing: '-0.02em'
    }
  }, w.title), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Pill, null, w.cat), /*#__PURE__*/React.createElement(Pill, null, w.year))));
}
function Work({
  go,
  openCase
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      ...W.sec,
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: W.wrap
  }, /*#__PURE__*/React.createElement(SectionHead, {
    pill: "Selected work",
    title: "Work that moves the needle"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
      gap: '40px 24px'
    }
  }, window.CT_WORK.slice(0, 4).map(w => /*#__PURE__*/React.createElement(WorkTile, {
    key: w.id,
    w: w,
    onOpen: openCase,
    big: true
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement(ArrowBtn, {
    onClick: () => go('work')
  }, "View all work"))));
}
function Trusted() {
  const names = ['Netflix', 'Client', 'Client', 'Client', 'Client', 'Client'];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '0 0 clamp(72px,9vw,140px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: W.wrap
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      font: '500 16px/1.4 var(--font-sans)',
      color: W.mute,
      margin: '0 0 24px'
    }
  }, "Trusted by founders and teams worldwide"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6,minmax(0,1fr))',
      gap: 12
    }
  }, names.map((n, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      height: 88,
      borderRadius: 16,
      background: W.field,
      display: 'grid',
      placeItems: 'center',
      font: '600 20px/1 var(--font-sans)',
      color: i ? '#A8B0A6' : W.ink,
      letterSpacing: '-0.02em'
    }
  }, n)))));
}
function Growth() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      ...W.sec,
      background: W.dark,
      borderRadius: 40,
      margin: '0 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: W.wrap
  }, /*#__PURE__*/React.createElement(SectionHead, {
    dark: true,
    pill: "What we do",
    title: "Everything your brand needs to grow",
    sub: "Branding || Design || Marketing || Web Development"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
      gap: 20
    }
  }, window.CT_SERVICES.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.name,
    style: {
      borderRadius: 20,
      background: i === 0 ? 'var(--ct-lime)' : 'rgba(255,255,255,.05)',
      color: i === 0 ? W.ink : '#fff',
      padding: 30,
      minHeight: 300,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 16,
      background: i === 0 ? W.ink : 'rgba(255,255,255,.08)',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: 24,
    color: "var(--ct-lime)"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 'auto',
      font: '600 30px/1.1 var(--font-sans)',
      letterSpacing: '-0.03em'
    }
  }, s.name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 16px/1.4 var(--font-sans)',
      opacity: .75
    }
  }, s.body))))));
}
function Plans({
  go
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: W.sec
  }, /*#__PURE__*/React.createElement("div", {
    style: W.wrap
  }, /*#__PURE__*/React.createElement(SectionHead, {
    pill: "Pricing",
    title: "Simple plans, no hidden pricing"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
      gap: 20,
      alignItems: 'stretch'
    }
  }, window.CT_PLANS.map(p => {
    const dark = p.tone === 'dark',
      lime = p.tone === 'lime';
    const fg = dark ? '#fff' : W.ink;
    return /*#__PURE__*/React.createElement("div", {
      key: p.name,
      style: {
        borderRadius: 24,
        padding: 30,
        background: dark ? W.dark : lime ? 'var(--ct-lime)' : W.field,
        color: fg,
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 24px/1.3 var(--font-sans)'
      }
    }, p.name), p.tag && /*#__PURE__*/React.createElement("span", {
      style: {
        padding: '6px 12px',
        borderRadius: 999,
        background: W.ink,
        color: 'var(--ct-lime)',
        font: '600 14px/1 var(--font-sans)'
      }
    }, p.tag)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 56px/1 var(--font-sans)',
        letterSpacing: '-0.04em'
      }
    }, p.price), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 16px/1 var(--font-sans)',
        opacity: .7
      }
    }, p.per)), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        font: '400 16px/1.4 var(--font-sans)',
        opacity: .75
      }
    }, p.note), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        borderTop: '1px solid ' + (dark ? 'rgba(255,255,255,.12)' : 'rgba(16,48,43,.12)'),
        paddingTop: 20
      }
    }, p.items.map(it => /*#__PURE__*/React.createElement("span", {
      key: it,
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        font: '400 16px/1.4 var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 16,
      color: dark ? 'var(--ct-lime)' : W.ink
    }), it))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 'auto',
        paddingTop: 8
      }
    }, /*#__PURE__*/React.createElement(ArrowBtn, {
      tone: dark ? 'lime' : 'dark',
      onClick: () => go('contact'),
      style: {
        width: '100%',
        justifyContent: 'space-between'
      }
    }, "Choose ", p.name)));
  }))));
}
function Feedback() {
  const [i, setI] = React.useState(0);
  const q = window.CT_QUOTES[i];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      ...W.sec,
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: W.wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,.8fr) minmax(0,1.2fr)',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Card, {
    bg: "var(--ct-gradient-glow)",
    style: {
      minHeight: 420
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: q.img,
    alt: "",
    style: {
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      height: '94%'
    }
  })), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 'clamp(28px,4vw,56px)',
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    style: {
      alignSelf: 'flex-start',
      background: '#fff'
    }
  }, "Client feedback"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: '500 clamp(24px,2.6vw,34px)/1.3 var(--font-sans)',
      letterSpacing: '-0.02em',
      color: W.ink
    }
  }, "\u201C", q.q, "\u201D"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 18px/1.4 var(--font-sans)',
      color: W.ink
    }
  }, q.name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 16px/1.4 var(--font-sans)',
      color: W.mute
    }
  }, q.role)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, ['arrow-left', 'arrow-right'].map((a, k) => /*#__PURE__*/React.createElement("button", {
    key: a,
    "aria-label": a,
    onClick: () => setI((i + (k ? 1 : -1) + window.CT_QUOTES.length) % window.CT_QUOTES.length),
    style: {
      width: 48,
      height: 48,
      borderRadius: 999,
      border: 'none',
      cursor: 'pointer',
      background: k ? W.ink : '#fff',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: a,
    size: 18,
    color: k ? 'var(--ct-lime)' : W.ink
  })))))))));
}
function Blog() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      ...W.sec,
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: W.wrap
  }, /*#__PURE__*/React.createElement(SectionHead, {
    pill: "Insights",
    title: "From the studio & the podcast"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
      gap: 24
    }
  }, window.CT_POSTS.map(p => /*#__PURE__*/React.createElement("a", {
    key: p.title,
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      textDecoration: 'none',
      color: W.ink,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '4/3',
      borderRadius: 20,
      overflow: 'hidden',
      background: '#000'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: p.img,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      font: '500 14px/1 var(--font-sans)',
      color: W.mute
    }
  }, /*#__PURE__*/React.createElement(Pill, null, p.cat), p.date), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 24px/1.3 var(--font-sans)',
      letterSpacing: '-0.02em'
    }
  }, p.title))))));
}
function HomePage({
  go,
  openCase
}) {
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Hero, {
    go: go
  }), /*#__PURE__*/React.createElement(About, null), /*#__PURE__*/React.createElement(Work, {
    go: go,
    openCase: openCase
  }), /*#__PURE__*/React.createElement(Trusted, null), /*#__PURE__*/React.createElement(Growth, null), /*#__PURE__*/React.createElement(Plans, {
    go: go
  }), /*#__PURE__*/React.createElement(Feedback, null), /*#__PURE__*/React.createElement(Blog, null));
}
Object.assign(window, {
  HomePage,
  WorkTile,
  Plans,
  Growth,
  Feedback
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Pages.jsx
try { (() => {
const {
  Tabs,
  Input,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  Dialog,
  Toast,
  Icon,
  Button
} = window.ColorteamDesignSystem_c88c1f;
function PageHero({
  pill,
  title,
  sub
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: 'clamp(96px,12vw,170px) 0 clamp(40px,5vw,60px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: W.wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Pill, null, pill), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: '600 clamp(48px,7vw,100px)/1.1 var(--font-sans)',
      letterSpacing: '-0.04em',
      color: W.ink,
      maxWidth: 1000,
      textWrap: 'balance'
    }
  }, title), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: '400 20px/1.4 var(--font-sans)',
      color: W.mute,
      maxWidth: 560
    }
  }, sub))));
}
function WorkPage({
  openCase
}) {
  const [f, setF] = React.useState('All');
  const items = window.CT_WORK.filter(w => f === 'All' || w.cat === f);
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(PageHero, {
    pill: "Our work",
    title: "Brands we've built",
    sub: "Identity, campaigns and content engines for startups and the teams behind them."
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      ...W.sec,
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: W.wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    onDark: false,
    items: ['All', 'Branding', 'Design', 'Marketing'],
    value: f,
    onChange: setF
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))',
      gap: '40px 24px'
    }
  }, items.map(w => /*#__PURE__*/React.createElement(window.WorkTile, {
    key: w.id,
    w: w,
    onOpen: openCase
  }))))));
}
function CaseStudyPage({
  w,
  go
}) {
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(PageHero, {
    pill: w.cat,
    title: w.title
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      ...W.sec,
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: W.wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 40,
      overflow: 'hidden',
      background: '#000',
      aspectRatio: '16/8'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: w.img,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
      gap: 20,
      margin: '40px 0 80px'
    }
  }, [['Client', w.client], ['Service', w.cat], ['Year', w.year], ['Team', 'Warsaw · Lagos']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      background: W.field,
      borderRadius: 20,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 14px/1.4 var(--font-sans)',
      color: W.mute
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 20px/1.3 var(--font-sans)',
      color: W.ink,
      marginTop: 6
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,.8fr) minmax(0,1.2fr)',
      gap: 'clamp(32px,6vw,100px)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: '600 clamp(32px,3.4vw,48px)/1.1 var(--font-sans)',
      letterSpacing: '-0.04em',
      color: W.ink
    }
  }, "The challenge"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: '400 20px/1.5 var(--font-sans)',
      color: W.mute
    }
  }, "Case study copy goes here \u2014 the challenge, approach and outcome. Replace with the real write-up from the Works CMS collection.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 60
    }
  }, /*#__PURE__*/React.createElement(ArrowBtn, {
    onClick: () => go('work')
  }, "Back to all work")))));
}
function ServicesPage({
  go
}) {
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(PageHero, {
    pill: "Services",
    title: "One team, four disciplines",
    sub: "Pick one, or let us run all four."
  }), /*#__PURE__*/React.createElement(window.Growth, null), /*#__PURE__*/React.createElement(window.Plans, {
    go: go
  }));
}
function PricingPage({
  go
}) {
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(PageHero, {
    pill: "Pricing",
    title: "Plans that grow with you",
    sub: "No hidden pricing. Cancel retainers any month."
  }), /*#__PURE__*/React.createElement(window.Plans, {
    go: go
  }), /*#__PURE__*/React.createElement(window.Feedback, null));
}
function ContactPage() {
  const [sent, setSent] = React.useState(false);
  const [toast, setToast] = React.useState(false);
  const [svc, setSvc] = React.useState({
    Branding: true
  });
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(PageHero, {
    pill: "Contact",
    title: "Let's talk about your brand",
    sub: "Tell us what you're building. We reply within one working day."
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      ...W.sec,
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...W.wrap,
      display: 'grid',
      gridTemplateColumns: 'minmax(0,.7fr) minmax(0,1.3fr)',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, [['mail', 'Email', 'hello@colorteam.io'], ['map-pin', 'Studios', 'Warsaw · Lagos · Global'], ['instagram', 'Instagram', '@yourcolorteam']].map(([i, k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      background: W.field,
      borderRadius: 20,
      padding: 24,
      display: 'flex',
      gap: 16,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 14,
      background: W.ink,
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: i,
    size: 20,
    color: "var(--ct-lime)"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 14px/1.4 var(--font-sans)',
      color: W.mute
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 18px/1.3 var(--font-sans)',
      color: W.ink
    }
  }, v))))), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      background: W.field,
      borderRadius: 24,
      padding: 'clamp(24px,3vw,40px)',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    onDark: false,
    label: "Name",
    placeholder: "Your name",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    onDark: false,
    label: "Email",
    type: "email",
    placeholder: "you@company.com",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 13px/1 var(--font-sans)',
      color: W.ink
    }
  }, "What do you need?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      flexWrap: 'wrap'
    }
  }, ['Branding', 'Design', 'Marketing', 'Web Development'].map(s => /*#__PURE__*/React.createElement(Checkbox, {
    key: s,
    onDark: false,
    label: s,
    checked: !!svc[s],
    onChange: v => setSvc({
      ...svc,
      [s]: v
    })
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 13px/1 var(--font-sans)',
      color: W.ink
    }
  }, "Budget"), /*#__PURE__*/React.createElement(RadioGroup, {
    onDark: false,
    direction: "row",
    options: ['< $10k', '$10–25k', '$25–50k', '$50k+'],
    defaultValue: "$10\u201325k"
  })), /*#__PURE__*/React.createElement(Select, {
    onDark: false,
    label: "Timeline",
    options: ['As soon as possible', 'Next 1–3 months', 'Just exploring']
  }), /*#__PURE__*/React.createElement(Input, {
    onDark: false,
    label: "Project details",
    multiline: true,
    placeholder: "Goals, audience and deadlines"
  }), /*#__PURE__*/React.createElement(Switch, {
    onDark: false,
    label: "Send me the Weekly Marketing Clarity Check",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ArrowBtn, null, "Send message"))))), /*#__PURE__*/React.createElement(Dialog, {
    open: sent,
    tone: "light",
    onClose: () => setSent(false),
    title: "Thanks \u2014 message received",
    actions: /*#__PURE__*/React.createElement(Button, {
      variant: "dark",
      onDark: false,
      onClick: () => {
        setSent(false);
        setToast(true);
        setTimeout(() => setToast(false), 2600);
      }
    }, "Done")
  }, "We'll get back to you within one working day."), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 60
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 16
    })
  }, "Message sent")));
}
Object.assign(window, {
  WorkPage,
  CaseStudyPage,
  ServicesPage,
  PricingPage,
  ContactPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Pages.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Shell.jsx
try { (() => {
const {
  Logo,
  Button,
  Icon
} = window.ColorteamDesignSystem_c88c1f;
const W = {
  ink: '#10302B',
  mute: '#6F7781',
  field: '#F1F3EE',
  line: '#DEE3DC',
  lime: 'var(--ct-lime)',
  dark: '#0C211D',
  wrap: {
    maxWidth: 1390,
    margin: '0 auto',
    padding: '0 24px',
    boxSizing: 'border-box'
  },
  sec: {
    padding: 'clamp(72px,9vw,140px) 0'
  }
};
function Pill({
  children,
  dark,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 12px',
      borderRadius: 999,
      background: dark ? 'rgba(255,255,255,.08)' : W.field,
      color: dark ? '#fff' : W.ink,
      font: '600 14px/1 var(--font-sans)',
      ...style
    }
  }, children);
}
function ArrowBtn({
  children,
  onClick,
  tone = 'dark',
  style
}) {
  const [h, setH] = React.useState(false);
  const dark = tone === 'dark';
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      padding: '6px 6px 6px 22px',
      borderRadius: 999,
      border: 'none',
      cursor: 'pointer',
      background: dark ? W.ink : 'var(--ct-lime)',
      color: dark ? '#fff' : W.ink,
      font: '500 16px/1 var(--font-sans)',
      transition: 'all 400ms ease',
      ...style
    }
  }, children, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 999,
      display: 'grid',
      placeItems: 'center',
      background: dark ? 'var(--ct-lime)' : W.ink,
      transform: h ? 'rotate(45deg)' : 'none',
      transition: 'transform 400ms ease'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-up-right",
    size: 18,
    color: dark ? W.ink : 'var(--ct-lime)'
  })));
}
function SectionHead({
  pill,
  title,
  sub,
  dark,
  align = 'center'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      textAlign: align,
      gap: 20,
      marginBottom: 'clamp(40px,5vw,60px)'
    }
  }, pill && /*#__PURE__*/React.createElement(Pill, {
    dark: dark
  }, pill), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: '600 clamp(40px,5.4vw,76px)/1.1 var(--font-sans)',
      letterSpacing: '-0.05em',
      color: dark ? '#fff' : W.ink,
      maxWidth: 900,
      textWrap: 'balance'
    }
  }, title), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: '400 18px/1.4 var(--font-sans)',
      color: dark ? 'rgba(255,255,255,.7)' : W.mute,
      maxWidth: 560
    }
  }, sub));
}
function SiteNav({
  page,
  go
}) {
  const links = [['home', 'Home'], ['work', 'Work'], ['services', 'Services'], ['pricing', 'Pricing'], ['contact', 'Contact']];
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 16,
      zIndex: 50,
      padding: '0 16px'
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      maxWidth: 940,
      margin: '0 auto',
      padding: '8px 8px 8px 18px',
      borderRadius: 12,
      background: 'rgba(241,243,238,.92)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go('home');
    },
    style: {
      display: 'flex',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "wordmark",
    tone: "dark",
    height: 20,
    assetBase: "../../assets/logo"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'clamp(14px,2vw,28px)',
      minWidth: 0,
      flexShrink: 1,
      overflow: 'hidden'
    }
  }, links.map(([k, l]) => /*#__PURE__*/React.createElement("a", {
    key: k,
    href: "#",
    onClick: e => {
      e.preventDefault();
      go(k);
    },
    style: {
      font: '500 16px/1.4 var(--font-sans)',
      color: page === k ? W.ink : W.mute,
      textDecoration: 'none',
      whiteSpace: 'nowrap'
    }
  }, l))), /*#__PURE__*/React.createElement(Button, {
    variant: "dark",
    onDark: false,
    size: "sm",
    onClick: () => go('contact'),
    style: {
      borderRadius: 10,
      padding: '12px 18px',
      whiteSpace: 'nowrap',
      flexShrink: 0
    }
  }, "Book a call")));
}
function CTA({
  go
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '0 0 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: W.wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 40,
      background: W.dark,
      color: '#fff',
      padding: 'clamp(56px,8vw,110px) 24px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(60% 80% at 50% 120%,rgba(168,252,120,.55) 0%,rgba(43,227,107,.25) 40%,transparent 70%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    dark: true
  }, "Let's work together"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: '600 clamp(40px,6vw,88px)/1.05 var(--font-sans)',
      letterSpacing: '-0.05em',
      maxWidth: 900
    }
  }, "Ready to build a brand ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ct-lime)'
    }
  }, "people remember?")), /*#__PURE__*/React.createElement(ArrowBtn, {
    tone: "lime",
    onClick: () => go('contact')
  }, "Start a project")))));
}
function SiteFooter({
  go
}) {
  const cols = [['Company', [['About', 'home'], ['Work', 'work'], ['Pricing', 'pricing']]], ['Services', [['Branding', 'services'], ['Design', 'services'], ['Marketing', 'services'], ['Web Development', 'services']]], ['Connect', [['Instagram', 'home'], ['LinkedIn', 'home'], ['Podcast', 'home']]]];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      padding: '0 0 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: W.wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: W.field,
      borderRadius: 40,
      padding: 'clamp(40px,5vw,64px)',
      display: 'grid',
      gap: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1.6fr) repeat(3,minmax(0,1fr))',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      maxWidth: 340
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "wordmark",
    tone: "dark",
    height: 26,
    assetBase: "../../assets/logo"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: '400 16px/1.4 var(--font-sans)',
      color: W.mute
    }
  }, "360\xB0 creative agency for startups. Branding, design, marketing and web development."), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 16px/1.4 var(--font-sans)',
      color: W.ink
    }
  }, "hello@colorteam.io")), cols.map(([h, ls]) => /*#__PURE__*/React.createElement("div", {
    key: h,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 16px/1.4 var(--font-sans)',
      color: W.ink
    }
  }, h), ls.map(([l, k]) => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    onClick: e => {
      e.preventDefault();
      go(k);
    },
    style: {
      font: '400 16px/1.4 var(--font-sans)',
      color: W.mute,
      textDecoration: 'none'
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 16,
      borderTop: '1px solid ' + W.line,
      paddingTop: 24,
      font: '400 14px/1.4 var(--font-sans)',
      color: W.mute
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Colorteam. Warsaw \xB7 Lagos \xB7 Global"), /*#__PURE__*/React.createElement("span", null, "Privacy Policy \xB7 Terms & Conditions")))));
}
Object.assign(window, {
  W,
  Pill,
  ArrowBtn,
  SectionHead,
  SiteNav,
  CTA,
  SiteFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/data.js
try { (() => {
window.CT_WORK = [{
  id: 'netflix',
  client: 'Netflix',
  title: 'Content syndication engine',
  cat: 'Marketing',
  img: '../../assets/examples/reel-behind-the-design.jpg',
  year: '2026'
}, {
  id: 'clarity',
  client: 'Colorteam',
  title: 'Weekly Marketing Clarity Check',
  cat: 'Marketing',
  img: '../../assets/examples/social-post-lead-magnet.jpg',
  year: '2026'
}, {
  id: 'podcast',
  client: 'The Colorteam Podcast',
  title: 'Podcast identity & studio',
  cat: 'Branding',
  img: '../../assets/examples/mockups-podcast-studio.jpg',
  year: '2026'
}, {
  id: 'systems',
  client: 'Colorteam',
  title: 'Systems over speed',
  cat: 'Branding',
  img: '../../assets/examples/reel-founder-quote.jpg',
  year: '2025'
}, {
  id: 'team',
  client: 'Colorteam',
  title: 'Team spotlight series',
  cat: 'Design',
  img: '../../assets/examples/social-post-team-spotlight.jpg',
  year: '2025'
}, {
  id: 'ep',
  client: 'The Colorteam Podcast',
  title: 'Episode artwork system',
  cat: 'Design',
  img: '../../assets/examples/reel-podcast-episode.jpg',
  year: '2025'
}];
window.CT_SERVICES = [{
  icon: 'palette',
  name: 'Branding',
  body: 'Positioning, identity systems and guidelines that scale with you.'
}, {
  icon: 'pen-tool',
  name: 'Design',
  body: 'Campaign, social and product design with one visual voice.'
}, {
  icon: 'megaphone',
  name: 'Marketing',
  body: 'Content engines, launches and the weekly clarity check.'
}, {
  icon: 'globe',
  name: 'Web Development',
  body: 'Fast marketing sites your team can update.'
}];
window.CT_PLANS = [{
  name: 'Starter',
  price: '$2,500',
  per: '/project',
  note: 'For founders who need a sharp first brand.',
  items: ['Logo & wordmark', 'Colour & type system', 'Social starter kit'],
  tone: 'light'
}, {
  name: 'Growth',
  price: '$6,000',
  per: '/month',
  note: 'Design and marketing on retainer.',
  items: ['Everything in Starter', 'Monthly campaign design', 'Content engine & reporting', 'Weekly clarity check'],
  tone: 'lime',
  tag: 'Popular'
}, {
  name: 'Studio',
  price: 'Custom',
  per: '',
  note: 'A full creative team for scale-ups.',
  items: ['Everything in Growth', 'Website build', 'Podcast & video production', 'Dedicated lead'],
  tone: 'dark'
}];
window.CT_QUOTES = [{
  q: 'Colorteam gave us a brand our whole team finally agrees on — and the system to keep it consistent.',
  name: 'Client Name',
  role: 'Founder, Company',
  img: '../../assets/imagery/portrait-cutout-woman-desaturated.png'
}, {
  q: 'The weekly clarity check changed how we run marketing. Fewer meetings, more output.',
  name: 'Client Name',
  role: 'Head of Growth, Company',
  img: '../../assets/imagery/portrait-cutout-man-chair.png'
}];
window.CT_POSTS = [{
  cat: 'Podcast',
  title: 'Creative Talk with Subomi',
  date: 'Oct 2026',
  img: '../../assets/imagery/podcast-documentary.png'
}, {
  cat: 'Branding',
  title: 'Systems over speed: compounding brand trust',
  date: 'Sep 2026',
  img: '../../assets/graphics/grain-gradient-green.jpg'
}, {
  cat: 'Marketing',
  title: 'How we built a content syndication engine for Netflix',
  date: 'Aug 2026',
  img: '../../assets/examples/reel-behind-the-design.jpg'
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/data.js", error: String((e && e.message) || e) }); }

__ds_ns.DisplayHeading = __ds_scope.DisplayHeading;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.MetaFrame = __ds_scope.MetaFrame;

__ds_ns.Squircle = __ds_scope.Squircle;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.RadioGroup = __ds_scope.RadioGroup;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
