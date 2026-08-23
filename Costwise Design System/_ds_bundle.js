/* @ds-bundle: {"format":4,"namespace":"CostwiseDesignSystem_f2dfa3","components":[{"name":"ChatBubble","sourcePath":"components/agent/ChatBubble.jsx"},{"name":"Composer","sourcePath":"components/agent/Composer.jsx"},{"name":"SuggestionChip","sourcePath":"components/agent/SuggestionChip.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"DataRow","sourcePath":"components/data/DataRow.jsx"},{"name":"ProgressMeter","sourcePath":"components/data/ProgressMeter.jsx"},{"name":"StatTile","sourcePath":"components/data/StatTile.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"MoneyInput","sourcePath":"components/forms/MoneyInput.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"SidebarNav","sourcePath":"components/navigation/SidebarNav.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/agent/ChatBubble.jsx":"d0cc96f375dd","components/agent/Composer.jsx":"65e3728fc0b5","components/agent/SuggestionChip.jsx":"d960a73c550c","components/brand/Logo.jsx":"f55930680898","components/core/Avatar.jsx":"86bcdf18508f","components/core/Badge.jsx":"5a119910e147","components/core/Button.jsx":"10e69b5fdd2b","components/core/Card.jsx":"fb63a70cc240","components/core/Icon.jsx":"0337f0f9e972","components/core/IconButton.jsx":"6f25b3bed1da","components/data/DataRow.jsx":"3df071cd11fa","components/data/ProgressMeter.jsx":"7a654deba8ab","components/data/StatTile.jsx":"f6d796aac605","components/feedback/Dialog.jsx":"432e9acd4582","components/feedback/EmptyState.jsx":"e8239b1b0968","components/feedback/Toast.jsx":"2d335f0f603d","components/feedback/Tooltip.jsx":"952fb2508e3c","components/forms/Checkbox.jsx":"e2360894f86b","components/forms/Input.jsx":"2db5ef2da9af","components/forms/MoneyInput.jsx":"9ccc28a12aae","components/forms/Select.jsx":"c9a68551ae15","components/forms/Switch.jsx":"89046f81a81c","components/navigation/SidebarNav.jsx":"50f0264378eb","components/navigation/Tabs.jsx":"c0ff3d66b330","ui_kits/costwise-app/AppShell.jsx":"b24b70ccb005","ui_kits/costwise-app/AskScreen.jsx":"ef66eb28276f","ui_kits/costwise-app/DishScreen.jsx":"4bc297fd6591","ui_kits/costwise-app/InvoicesScreen.jsx":"35eb62352205","ui_kits/costwise-app/LoginScreen.jsx":"92fb7cc9d3bf","ui_kits/costwise-app/TodayScreen.jsx":"d3ee706dddcb"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CostwiseDesignSystem_f2dfa3 = window.CostwiseDesignSystem_f2dfa3 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/agent/ChatBubble.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cw-bub{display:flex;gap:10px;max-width:100%;align-items:flex-end}
.cw-bub--me{flex-direction:row-reverse}
.cw-bub__body{max-width:min(560px,86%);display:flex;flex-direction:column;gap:6px}
.cw-bub__msg{padding:12px 15px;border-radius:var(--radius-bubble);font:var(--type-body);color:var(--text-body);background:var(--surface-card);border:1px solid var(--border-subtle);box-shadow:var(--shadow-xs);border-bottom-left-radius:8px}
.cw-bub--me .cw-bub__msg{background:var(--green-800);color:var(--cream-50);border-color:transparent;box-shadow:var(--shadow-brand);border-bottom-left-radius:var(--radius-bubble);border-bottom-right-radius:8px}
.cw-bub--note .cw-bub__msg{background:var(--surface-accent-soft);border-color:#F0E3BE;box-shadow:none;color:var(--ink-800)}
.cw-bub__msg strong{font-weight:var(--weight-bold);color:inherit}
.cw-bub__meta{display:flex;align-items:center;gap:7px;font:var(--type-caption);color:var(--text-muted);padding:0 4px}
.cw-bub--me .cw-bub__meta{justify-content:flex-end}
.cw-bub__typing{display:inline-flex;gap:4px;align-items:center;padding:4px 2px}
.cw-bub__typing i{width:6px;height:6px;border-radius:50%;background:var(--green-400);animation:cw-bounce 1.1s var(--ease-in-out-soft) infinite}
.cw-bub__typing i:nth-child(2){animation-delay:.14s}
.cw-bub__typing i:nth-child(3){animation-delay:.28s}
@keyframes cw-bounce{0%,60%,100%{transform:translateY(0);opacity:.45}30%{transform:translateY(-4px);opacity:1}}
.cw-bub__slot{margin-top:2px}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'bubble');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function ChatBubble({
  from = 'agent',
  children,
  avatar,
  meta,
  typing = false,
  tone = 'default',
  attachment,
  ...rest
}) {
  inject();
  const cls = ['cw-bub', from === 'me' && 'cw-bub--me', tone === 'note' && 'cw-bub--note'].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), avatar, /*#__PURE__*/React.createElement("div", {
    className: "cw-bub__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cw-bub__msg"
  }, typing ? /*#__PURE__*/React.createElement("span", {
    className: "cw-bub__typing"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)) : children), attachment && /*#__PURE__*/React.createElement("div", {
    className: "cw-bub__slot"
  }, attachment), meta && /*#__PURE__*/React.createElement("span", {
    className: "cw-bub__meta"
  }, meta)));
}
Object.assign(__ds_scope, { ChatBubble });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/agent/ChatBubble.jsx", error: String((e && e.message) || e) }); }

// components/agent/Composer.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cw-comp{display:flex;align-items:center;gap:10px;padding:8px 10px 8px 12px;background:var(--surface-card);border:1px solid var(--border-default);border-radius:var(--radius-pill);box-shadow:var(--shadow-md);transition:var(--transition-control)}
.cw-comp:focus-within{border-color:var(--green-400);box-shadow:var(--shadow-lg)}
.cw-comp input{flex:1;min-width:0;height:32px;border:0;outline:none;background:transparent;font:var(--type-body);color:var(--text-strong)}
.cw-comp input::placeholder{color:var(--text-faint)}
.cw-comp__lead{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;background:var(--surface-brand-soft);color:var(--green-700);flex:0 0 auto}
.cw-comp__send{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border:0;border-radius:50%;background:var(--green-800);color:var(--cream-50);cursor:pointer;flex:0 0 auto;transition:var(--transition-control)}
.cw-comp__send:hover{background:var(--green-700)}
.cw-comp__send:active{transform:scale(var(--press-scale))}
.cw-comp__send:disabled{background:var(--sand-300);color:var(--stone-500);cursor:not-allowed}
.cw-comp__tools{display:flex;align-items:center;gap:2px}
.cw-comp--flat{border-radius:var(--radius-card);box-shadow:var(--shadow-sm)}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'composer');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Composer({
  placeholder = 'Ask Costwise anything about your numbers…',
  value,
  onChange,
  onSend,
  lead,
  tools,
  sendIcon,
  flat = false,
  ...rest
}) {
  inject();
  const submit = e => {
    e.preventDefault();
    onSend && onSend();
  };
  return /*#__PURE__*/React.createElement("form", _extends({
    className: 'cw-comp' + (flat ? ' cw-comp--flat' : ''),
    onSubmit: submit
  }, rest), lead && /*#__PURE__*/React.createElement("span", {
    className: "cw-comp__lead"
  }, lead), /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: onChange,
    placeholder: placeholder
  }), tools && /*#__PURE__*/React.createElement("span", {
    className: "cw-comp__tools"
  }, tools), /*#__PURE__*/React.createElement("button", {
    className: "cw-comp__send",
    type: "submit",
    "aria-label": "Send",
    disabled: !value
  }, sendIcon || '↑'));
}
Object.assign(__ds_scope, { Composer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/agent/Composer.jsx", error: String((e && e.message) || e) }); }

// components/agent/SuggestionChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cw-chip{display:inline-flex;align-items:center;gap:7px;min-height:36px;padding:0 14px;background:var(--surface-card);border:1px solid var(--border-default);border-radius:var(--radius-pill);color:var(--text-body);font:var(--weight-semibold) var(--text-sm)/1.2 var(--font-body);cursor:pointer;text-align:left;transition:var(--transition-control)}
.cw-chip:hover{border-color:var(--green-400);background:var(--surface-brand-soft);color:var(--green-800);transform:translateY(var(--lift-hover))}
.cw-chip:active{transform:scale(var(--press-scale))}
.cw-chip--accent{background:var(--surface-accent-soft);border-color:#EFE0B8;color:var(--gold-800)}
.cw-chip--accent:hover{background:var(--gold-300);border-color:var(--gold-400);color:var(--gold-800)}
.cw-chip--soft{background:var(--surface-brand-soft);border-color:transparent;color:var(--green-800)}
.cw-chip--filter{border-radius:var(--radius-pill);min-height:32px;font-size:var(--text-xs)}
.cw-chip--selected{background:var(--green-800);border-color:transparent;color:var(--cream-50)}
.cw-chip--selected:hover{background:var(--green-700);color:var(--cream-50)}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'chip');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function SuggestionChip({
  icon,
  children,
  variant = 'default',
  selected = false,
  ...rest
}) {
  inject();
  const cls = ['cw-chip', variant !== 'default' && 'cw-chip--' + variant, selected && 'cw-chip--selected'].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls
  }, rest), icon, children);
}
Object.assign(__ds_scope, { SuggestionChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/agent/SuggestionChip.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cw-logo{display:inline-flex;align-items:center;gap:9px;text-decoration:none;border:0;color:inherit}
.cw-logo img{display:block;flex:0 0 auto}
.cw-logo__word{font-family:var(--font-logotype);font-weight:800;letter-spacing:-.015em;line-height:1;color:var(--green-800)}
.cw-logo--inverse .cw-logo__word{color:var(--cream-50)}
.cw-logo__plate{display:inline-flex;align-items:center;justify-content:center;background:var(--green-800);border-radius:var(--radius-md);padding:5px}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'logo');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Logo({
  size = 28,
  variant = 'full',
  inverse = false,
  plate = false,
  src = 'assets/logo-mark-transparent.png',
  ...rest
}) {
  inject();
  const mark = /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "Costwise",
    width: size,
    height: size
  });
  return /*#__PURE__*/React.createElement("span", _extends({
    className: 'cw-logo' + (inverse ? ' cw-logo--inverse' : '')
  }, rest), plate ? /*#__PURE__*/React.createElement("span", {
    className: "cw-logo__plate"
  }, mark) : mark, variant === 'full' && /*#__PURE__*/React.createElement("span", {
    className: "cw-logo__word",
    style: {
      fontSize: Math.round(size * 0.82)
    }
  }, "Costwise"));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cw-avatar{--s:36px;position:relative;display:inline-flex;align-items:center;justify-content:center;width:var(--s);height:var(--s);border-radius:var(--radius-pill);background:var(--green-100);color:var(--green-800);font:var(--weight-bold) 13px/1 var(--font-body);overflow:hidden;flex:0 0 auto;user-select:none}
.cw-avatar--sm{--s:28px;font-size:11px}
.cw-avatar--lg{--s:48px;font-size:16px}
.cw-avatar--xl{--s:64px;font-size:20px}
.cw-avatar img{width:100%;height:100%;object-fit:cover;display:block}
.cw-avatar--agent{background:var(--green-800);padding:3px}
.cw-avatar--agent img{object-fit:contain}
.cw-avatar__dot{position:absolute;right:-1px;bottom:-1px;width:10px;height:10px;border-radius:50%;background:var(--good);box-shadow:0 0 0 2px var(--surface-card)}
.cw-avatar__ring{box-shadow:0 0 0 2px var(--surface-card)}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'avatar');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Avatar({
  name = '',
  src,
  size = 'md',
  agent = false,
  online = false,
  style,
  ...rest
}) {
  inject();
  const initials = name.trim().split(/\s+/).slice(0, 2).map(p => p[0] || '').join('').toUpperCase();
  const cls = ['cw-avatar', size !== 'md' && 'cw-avatar--' + size, agent && 'cw-avatar--agent'].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls,
    style: style,
    title: name || undefined
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name
  }) : initials, online && /*#__PURE__*/React.createElement("span", {
    className: "cw-avatar__dot"
  }));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cw-badge{display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 10px;border-radius:var(--radius-pill);font:var(--weight-bold) var(--text-xs)/1 var(--font-body);letter-spacing:var(--tracking-snug);white-space:nowrap}
.cw-badge--lg{height:28px;padding:0 12px;font-size:var(--text-sm)}
.cw-badge--neutral{background:var(--cream-200);color:var(--ink-700)}
.cw-badge--good{background:var(--good-soft);color:var(--good-text)}
.cw-badge--watch{background:var(--watch-soft);color:var(--watch-text)}
.cw-badge--over{background:var(--over-soft);color:var(--over-text)}
.cw-badge--info{background:var(--info-soft);color:var(--info-text)}
.cw-badge--agent{background:var(--agent-soft);color:var(--agent-text)}
.cw-badge--brand{background:var(--green-800);color:var(--text-on-brand)}
.cw-badge--outline{background:transparent;border:1px solid var(--border-default);color:var(--text-body)}
.cw-badge__dot{width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.8}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'badge');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Badge({
  tone = 'neutral',
  size = 'md',
  dot = false,
  icon,
  children,
  ...rest
}) {
  inject();
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ['cw-badge', 'cw-badge--' + tone, size === 'lg' && 'cw-badge--lg'].filter(Boolean).join(' ')
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "cw-badge__dot"
  }), icon, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cw-btn{--h:44px;display:inline-flex;align-items:center;justify-content:center;gap:8px;height:var(--h);padding:0 18px;border:1px solid transparent;border-radius:var(--radius-control);font:var(--weight-bold) var(--text-base)/1 var(--font-body);letter-spacing:var(--tracking-snug);cursor:pointer;white-space:nowrap;transition:var(--transition-control);text-decoration:none}
.cw-btn:active:not(:disabled){transform:scale(var(--press-scale))}
.cw-btn:disabled{opacity:.42;cursor:not-allowed;box-shadow:none}
.cw-btn--sm{--h:36px;padding:0 14px;font-size:var(--text-sm)}
.cw-btn--lg{--h:52px;padding:0 24px;font-size:var(--text-md)}
.cw-btn--pill{border-radius:var(--radius-pill)}
.cw-btn--block{width:100%}
.cw-btn--primary{background:var(--green-800);color:var(--text-on-brand);box-shadow:var(--shadow-brand)}
.cw-btn--primary:hover:not(:disabled){background:var(--green-700);transform:translateY(var(--lift-hover))}
.cw-btn--primary:active:not(:disabled){background:var(--green-900);transform:scale(var(--press-scale))}
.cw-btn--accent{background:var(--gold-500);color:var(--text-on-accent);box-shadow:var(--shadow-sm)}
.cw-btn--accent:hover:not(:disabled){background:var(--gold-400);transform:translateY(var(--lift-hover))}
.cw-btn--secondary{background:var(--surface-card);color:var(--text-strong);border-color:var(--border-default);box-shadow:var(--shadow-xs)}
.cw-btn--secondary:hover:not(:disabled){background:var(--cream-100);border-color:var(--border-strong)}
.cw-btn--ghost{background:transparent;color:var(--text-brand)}
.cw-btn--ghost:hover:not(:disabled){background:var(--surface-brand-soft)}
.cw-btn--danger{background:var(--over);color:#fff}
.cw-btn--danger:hover:not(:disabled){background:var(--tomato-700)}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'button');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Button({
  variant = 'primary',
  size = 'md',
  pill = false,
  block = false,
  iconLeft,
  iconRight,
  children,
  as = 'button',
  ...rest
}) {
  inject();
  const Tag = as;
  const cls = ['cw-btn', 'cw-btn--' + variant, size !== 'md' && 'cw-btn--' + size, pill && 'cw-btn--pill', block && 'cw-btn--block'].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cw-card{position:relative;background:var(--surface-card);border:1px solid var(--border-subtle);border-radius:var(--radius-card);box-shadow:var(--shadow-sm);transition:var(--transition-surface)}
.cw-card--sunken{background:var(--surface-sunken);box-shadow:none}
.cw-card--brand{background:var(--surface-brand);border-color:transparent;color:var(--text-on-brand);box-shadow:var(--shadow-brand)}
.cw-card--accent{background:var(--surface-accent-soft);border-color:#F0E3BE;box-shadow:none}
.cw-card--flat{box-shadow:none}
.cw-card--pad{padding:var(--pad-card)}
.cw-card--pad-tight{padding:var(--pad-card-tight)}
.cw-card--interactive{cursor:pointer}
.cw-card--interactive:hover{box-shadow:var(--shadow-md);transform:translateY(-2px)}
.cw-card--interactive:active{transform:scale(.995)}
.cw-card__head{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.cw-card__title{flex:1;font:var(--type-heading);color:inherit;letter-spacing:var(--tracking-snug)}
.cw-card__eyebrow{display:block;font:var(--type-overline);letter-spacing:var(--tracking-caps);text-transform:uppercase;color:var(--text-muted);margin-bottom:3px}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'card');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Card({
  variant = 'default',
  padding = 'md',
  interactive = false,
  title,
  eyebrow,
  icon,
  action,
  children,
  ...rest
}) {
  inject();
  const cls = ['cw-card', variant !== 'default' && 'cw-card--' + variant, padding === 'md' && 'cw-card--pad', padding === 'tight' && 'cw-card--pad-tight', interactive && 'cw-card--interactive'].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), (title || action) && /*#__PURE__*/React.createElement("div", {
    className: "cw-card__head"
  }, icon, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    className: "cw-card__eyebrow"
  }, eyebrow), title && /*#__PURE__*/React.createElement("div", {
    className: "cw-card__title"
  }, title)), action), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useEffect,
  useRef
} = React;
const pascal = n => n.split(/[-_ ]/).filter(Boolean).map(p => p[0].toUpperCase() + p.slice(1)).join('');
/** Lucide glyph wrapper. Costwise ships no icon binaries, so Lucide (rounded caps, 1.75 stroke) is the house set. */
function Icon({
  name,
  size = 20,
  strokeWidth = 1.75,
  color = 'currentColor',
  style,
  ...rest
}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current,
      L = typeof window !== 'undefined' ? window.lucide : null;
    if (!el || !L) return;
    const node = L.icons && L.icons[pascal(name)];
    el.innerHTML = '';
    if (!node) return;
    try {
      const svg = L.createElement(node);
      svg.setAttribute('width', size);
      svg.setAttribute('height', size);
      svg.setAttribute('stroke-width', strokeWidth);
      svg.setAttribute('stroke', 'currentColor');
      el.appendChild(svg);
    } catch (e) {}
  }, [name, size, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", _extends({
    ref: ref,
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      flex: '0 0 auto',
      color,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cw-ibtn{--s:40px;display:inline-flex;align-items:center;justify-content:center;width:var(--s);height:var(--s);border:1px solid transparent;border-radius:var(--radius-control);background:transparent;color:var(--text-body);cursor:pointer;transition:var(--transition-control)}
.cw-ibtn:hover:not(:disabled){background:var(--cream-100);color:var(--text-strong)}
.cw-ibtn:active:not(:disabled){transform:scale(var(--press-scale))}
.cw-ibtn:disabled{opacity:.42;cursor:not-allowed}
.cw-ibtn--sm{--s:32px}
.cw-ibtn--lg{--s:48px}
.cw-ibtn--round{border-radius:var(--radius-pill)}
.cw-ibtn--outline{background:var(--surface-card);border-color:var(--border-default);box-shadow:var(--shadow-xs)}
.cw-ibtn--outline:hover:not(:disabled){border-color:var(--border-strong)}
.cw-ibtn--solid{background:var(--green-800);color:var(--text-on-brand)}
.cw-ibtn--solid:hover:not(:disabled){background:var(--green-700)}
.cw-ibtn--soft{background:var(--surface-brand-soft);color:var(--text-brand)}
.cw-ibtn--soft:hover:not(:disabled){background:var(--green-100)}
.cw-ibtn--active{background:var(--surface-brand-soft);color:var(--text-brand)}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'iconbutton');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function IconButton({
  icon,
  variant = 'plain',
  size = 'md',
  round = false,
  active = false,
  label,
  ...rest
}) {
  inject();
  const cls = ['cw-ibtn', variant !== 'plain' && 'cw-ibtn--' + variant, size !== 'md' && 'cw-ibtn--' + size, round && 'cw-ibtn--round', active && 'cw-ibtn--active'].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    "aria-label": label,
    title: label
  }, rest), icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data/DataRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cw-row{display:flex;align-items:center;gap:12px;padding:12px 4px;border-bottom:1px solid var(--border-subtle);text-align:left;background:none;border-left:0;border-right:0;border-top:0;width:100%;transition:var(--transition-control)}
.cw-row:last-child{border-bottom:0}
.cw-row--card{padding:14px 16px;border:1px solid var(--border-subtle);border-radius:var(--radius-card);background:var(--surface-card);box-shadow:var(--shadow-xs);margin-bottom:0}
.cw-row--interactive{cursor:pointer}
.cw-row--interactive:hover{background:var(--cream-100)}
.cw-row--card.cw-row--interactive:hover{background:var(--surface-card);box-shadow:var(--shadow-md);transform:translateY(-1px)}
.cw-row__thumb{flex:0 0 auto;width:40px;height:40px;border-radius:var(--radius-md);background:var(--surface-brand-soft);display:inline-flex;align-items:center;justify-content:center;color:var(--green-700);overflow:hidden}
.cw-row__thumb img{width:100%;height:100%;object-fit:cover}
.cw-row__body{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.cw-row__title{font:var(--weight-semibold) var(--text-base)/1.3 var(--font-body);color:var(--text-strong);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cw-row__sub{font:var(--type-caption);color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cw-row__end{display:flex;align-items:center;gap:10px;flex:0 0 auto}
.cw-row__amount{font:var(--weight-bold) var(--text-base)/1.2 var(--font-mono);font-variant-numeric:tabular-nums;color:var(--text-strong);text-align:right}
.cw-row__amount small{display:block;font:var(--type-caption);font-family:var(--font-body);color:var(--text-muted);font-weight:400}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'datarow');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function DataRow({
  thumb,
  title,
  subtitle,
  amount,
  amountNote,
  end,
  card = false,
  onClick,
  ...rest
}) {
  inject();
  const Tag = onClick ? 'button' : 'div';
  const cls = ['cw-row', card && 'cw-row--card', onClick && 'cw-row--interactive'].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    onClick: onClick
  }, rest), thumb && /*#__PURE__*/React.createElement("span", {
    className: "cw-row__thumb"
  }, thumb), /*#__PURE__*/React.createElement("span", {
    className: "cw-row__body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cw-row__title"
  }, title), subtitle && /*#__PURE__*/React.createElement("span", {
    className: "cw-row__sub"
  }, subtitle)), /*#__PURE__*/React.createElement("span", {
    className: "cw-row__end"
  }, amount != null && /*#__PURE__*/React.createElement("span", {
    className: "cw-row__amount"
  }, amount, amountNote && /*#__PURE__*/React.createElement("small", null, amountNote)), end));
}
Object.assign(__ds_scope, { DataRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataRow.jsx", error: String((e && e.message) || e) }); }

// components/data/ProgressMeter.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cw-meter{display:flex;flex-direction:column;gap:7px;min-width:0}
.cw-meter__top{display:flex;align-items:baseline;justify-content:space-between;gap:12px}
.cw-meter__label{font:var(--type-label);color:var(--text-strong)}
.cw-meter__value{font:var(--weight-bold) var(--text-sm)/1 var(--font-mono);font-variant-numeric:tabular-nums;color:var(--text-body)}
.cw-meter__track{position:relative;height:10px;border-radius:var(--radius-pill);background:var(--viz-track);overflow:hidden}
.cw-meter--thick .cw-meter__track{height:14px}
.cw-meter__fill{position:absolute;inset:0 auto 0 0;border-radius:var(--radius-pill);transition:width var(--dur-slow) var(--ease-out-soft)}
.cw-meter__target{position:absolute;top:-3px;bottom:-3px;width:2px;background:var(--ink-800);opacity:.55;border-radius:1px}
.cw-meter__foot{display:flex;align-items:center;gap:6px;font:var(--type-caption);color:var(--text-muted)}
.cw-meter__seg{display:flex;height:100%;width:100%}
.cw-meter__seg>span{height:100%}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'meter');
  s.textContent = CSS;
  document.head.appendChild(s);
}
const TONES = {
  good: 'var(--good)',
  watch: 'var(--watch)',
  over: 'var(--over)',
  brand: 'var(--green-600)',
  info: 'var(--info)'
};
function ProgressMeter({
  label,
  value = 0,
  max = 100,
  tone = 'brand',
  display,
  target,
  caption,
  segments,
  thick = false,
  ...rest
}) {
  inject();
  const pct = Math.max(0, Math.min(100, value / max * 100));
  return /*#__PURE__*/React.createElement("div", _extends({
    className: 'cw-meter' + (thick ? ' cw-meter--thick' : '')
  }, rest), (label || display) && /*#__PURE__*/React.createElement("div", {
    className: "cw-meter__top"
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "cw-meter__label"
  }, label), display && /*#__PURE__*/React.createElement("span", {
    className: "cw-meter__value"
  }, display)), /*#__PURE__*/React.createElement("div", {
    className: "cw-meter__track"
  }, segments ? /*#__PURE__*/React.createElement("div", {
    className: "cw-meter__seg"
  }, segments.map((s, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: s.value / max * 100 + '%',
      background: s.color || `var(--viz-${i % 6 + 1})`
    }
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "cw-meter__fill",
    style: {
      width: pct + '%',
      background: TONES[tone] || tone
    }
  }), target != null && /*#__PURE__*/React.createElement("span", {
    className: "cw-meter__target",
    style: {
      left: Math.min(100, target / max * 100) + '%'
    }
  })), caption && /*#__PURE__*/React.createElement("span", {
    className: "cw-meter__foot"
  }, caption));
}
Object.assign(__ds_scope, { ProgressMeter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ProgressMeter.jsx", error: String((e && e.message) || e) }); }

// components/data/StatTile.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cw-stat{display:flex;flex-direction:column;gap:6px;padding:var(--pad-card-tight) 16px;background:var(--surface-card);border:1px solid var(--border-subtle);border-radius:var(--radius-tile);box-shadow:var(--shadow-xs);min-width:0;transition:var(--transition-surface)}
.cw-stat--sunken{background:var(--surface-sunken);border-color:transparent;box-shadow:none}
.cw-stat--brand{background:var(--surface-brand);border-color:transparent;box-shadow:var(--shadow-brand)}
.cw-stat--brand .cw-stat__label,.cw-stat--brand .cw-stat__value,.cw-stat--brand .cw-stat__unit{color:var(--cream-50)}
.cw-stat--brand .cw-stat__label{opacity:.72}
.cw-stat__label{display:flex;align-items:center;gap:6px;font:var(--type-overline);letter-spacing:var(--tracking-caps);text-transform:uppercase;color:var(--text-muted)}
.cw-stat__row{display:flex;align-items:baseline;gap:5px;flex-wrap:wrap}
.cw-stat__value{font:var(--weight-bold) var(--text-2xl)/1 var(--font-display);letter-spacing:var(--tracking-tight);color:var(--text-strong);font-variant-numeric:tabular-nums}
.cw-stat--lg .cw-stat__value{font-size:var(--text-3xl)}
.cw-stat__unit{font:var(--weight-semibold) var(--text-base)/1 var(--font-body);color:var(--text-muted)}
.cw-stat__foot{display:flex;align-items:center;gap:6px;font:var(--type-caption);color:var(--text-muted)}
.cw-stat__delta{display:inline-flex;align-items:center;gap:3px;font:var(--weight-bold) var(--text-xs)/1 var(--font-body)}
.cw-stat__delta--good{color:var(--good)}
.cw-stat__delta--over{color:var(--over)}
.cw-stat__delta--flat{color:var(--text-muted)}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'stattile');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function StatTile({
  label,
  value,
  unit,
  delta,
  deltaTone = 'flat',
  caption,
  icon,
  variant = 'default',
  size = 'md',
  ...rest
}) {
  inject();
  const cls = ['cw-stat', variant !== 'default' && 'cw-stat--' + variant, size === 'lg' && 'cw-stat--lg'].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "cw-stat__label"
  }, icon, label), /*#__PURE__*/React.createElement("span", {
    className: "cw-stat__row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cw-stat__value"
  }, value), unit && /*#__PURE__*/React.createElement("span", {
    className: "cw-stat__unit"
  }, unit)), (delta || caption) && /*#__PURE__*/React.createElement("span", {
    className: "cw-stat__foot"
  }, delta && /*#__PURE__*/React.createElement("span", {
    className: 'cw-stat__delta cw-stat__delta--' + deltaTone
  }, delta), caption));
}
Object.assign(__ds_scope, { StatTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatTile.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cw-dlg__scrim{position:fixed;inset:0;background:var(--surface-overlay);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;padding:20px;z-index:60;animation:cw-fade var(--dur-base) var(--ease-out-soft)}
.cw-dlg{width:100%;max-width:440px;background:var(--surface-card);border-radius:var(--radius-sheet);box-shadow:var(--shadow-pop);padding:24px;animation:cw-pop var(--dur-base) var(--ease-nudge)}
.cw-dlg--wide{max-width:640px}
.cw-dlg--sheet{max-width:520px;align-self:flex-end;border-bottom-left-radius:0;border-bottom-right-radius:0}
.cw-dlg__head{display:flex;align-items:flex-start;gap:12px;margin-bottom:12px}
.cw-dlg__title{flex:1;font:var(--type-title);font-size:var(--text-xl);color:var(--text-strong)}
.cw-dlg__body{font:var(--type-body);color:var(--text-body)}
.cw-dlg__foot{display:flex;gap:10px;justify-content:flex-end;margin-top:22px;flex-wrap:wrap}
@keyframes cw-fade{from{opacity:0}to{opacity:1}}
@keyframes cw-pop{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'dialog');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Dialog({
  open = true,
  title,
  icon,
  children,
  footer,
  onClose,
  size = 'md',
  ...rest
}) {
  inject();
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "cw-dlg__scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", _extends({
    className: 'cw-dlg' + (size === 'wide' ? ' cw-dlg--wide' : '') + (size === 'sheet' ? ' cw-dlg--sheet' : ''),
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation()
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "cw-dlg__head"
  }, icon, /*#__PURE__*/React.createElement("div", {
    className: "cw-dlg__title"
  }, title)), /*#__PURE__*/React.createElement("div", {
    className: "cw-dlg__body"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: "cw-dlg__foot"
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cw-empty{display:flex;flex-direction:column;align-items:center;text-align:center;gap:12px;padding:32px 24px}
.cw-empty img{width:180px;max-width:60%;height:auto;display:block;margin-bottom:-4px}
.cw-empty--compact{padding:22px 16px}
.cw-empty--compact img{width:110px}
.cw-empty__art{display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:var(--radius-2xl);background:var(--surface-brand-soft);color:var(--green-600)}
.cw-empty__title{font:var(--type-heading);color:var(--text-strong)}
.cw-empty__msg{font:var(--type-body);color:var(--text-muted);max-width:38ch}
.cw-empty__actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'empty');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function EmptyState({
  illustration,
  icon,
  title,
  message,
  actions,
  compact = false,
  ...rest
}) {
  inject();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: 'cw-empty' + (compact ? ' cw-empty--compact' : '')
  }, rest), illustration ? /*#__PURE__*/React.createElement("img", {
    src: illustration,
    alt: ""
  }) : icon ? /*#__PURE__*/React.createElement("span", {
    className: "cw-empty__art"
  }, icon) : null, /*#__PURE__*/React.createElement("div", {
    className: "cw-empty__title"
  }, title), message && /*#__PURE__*/React.createElement("p", {
    className: "cw-empty__msg"
  }, message), actions && /*#__PURE__*/React.createElement("div", {
    className: "cw-empty__actions"
  }, actions));
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cw-toast{display:flex;align-items:flex-start;gap:11px;padding:13px 15px;background:var(--ink-900);color:var(--cream-50);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);max-width:440px;animation:cw-slide var(--dur-base) var(--ease-nudge)}
.cw-toast--good{background:var(--green-800)}
.cw-toast--watch{background:var(--gold-100);color:var(--gold-800);box-shadow:var(--shadow-md)}
.cw-toast--over{background:var(--over)}
.cw-toast__body{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.cw-toast__title{font:var(--weight-bold) var(--text-base)/1.3 var(--font-body)}
.cw-toast__msg{font:var(--type-caption);opacity:.82}
.cw-toast__action{border:0;background:transparent;color:inherit;font:var(--weight-bold) var(--text-sm)/1 var(--font-body);cursor:pointer;text-decoration:underline;padding:4px;border-radius:6px;flex:0 0 auto}
.cw-toast__action:hover{opacity:.75}
@keyframes cw-slide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'toast');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Toast({
  title,
  message,
  tone = 'default',
  icon,
  actionLabel,
  onAction,
  ...rest
}) {
  inject();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: 'cw-toast' + (tone !== 'default' ? ' cw-toast--' + tone : ''),
    role: "status"
  }, rest), icon, /*#__PURE__*/React.createElement("div", {
    className: "cw-toast__body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cw-toast__title"
  }, title), message && /*#__PURE__*/React.createElement("span", {
    className: "cw-toast__msg"
  }, message)), actionLabel && /*#__PURE__*/React.createElement("button", {
    className: "cw-toast__action",
    onClick: onAction
  }, actionLabel));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const CSS = `
.cw-tip-wrap{position:relative;display:inline-flex}
.cw-tip{position:absolute;z-index:40;padding:7px 10px;background:var(--ink-900);color:var(--cream-50);border-radius:var(--radius-sm);font:var(--weight-semibold) var(--text-xs)/1.35 var(--font-body);white-space:nowrap;box-shadow:var(--shadow-md);pointer-events:none;animation:cw-tipin var(--dur-fast) var(--ease-out-soft)}
.cw-tip--wrap{white-space:normal;width:220px}
.cw-tip--top{bottom:calc(100% + 8px);left:50%;transform:translateX(-50%)}
.cw-tip--bottom{top:calc(100% + 8px);left:50%;transform:translateX(-50%)}
.cw-tip--right{left:calc(100% + 8px);top:50%;transform:translateY(-50%)}
.cw-tip--left{right:calc(100% + 8px);top:50%;transform:translateY(-50%)}
@keyframes cw-tipin{from{opacity:0}to{opacity:1}}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'tooltip');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Tooltip({
  label,
  side = 'top',
  wrap = false,
  children,
  ...rest
}) {
  inject();
  const [on, setOn] = useState(false);
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "cw-tip-wrap",
    onMouseEnter: () => setOn(true),
    onMouseLeave: () => setOn(false),
    onFocus: () => setOn(true),
    onBlur: () => setOn(false)
  }, rest), children, on && /*#__PURE__*/React.createElement("span", {
    className: 'cw-tip cw-tip--' + side + (wrap ? ' cw-tip--wrap' : ''),
    role: "tooltip"
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cw-check{display:inline-flex;align-items:flex-start;gap:10px;cursor:pointer;font:var(--type-body);color:var(--text-body);min-height:24px}
.cw-check input{position:absolute;opacity:0;width:0;height:0}
.cw-check__box{flex:0 0 auto;width:20px;height:20px;margin-top:1px;border:1.5px solid var(--border-strong);border-radius:var(--radius-xs);background:var(--surface-card);display:inline-flex;align-items:center;justify-content:center;transition:var(--transition-control)}
.cw-check:hover .cw-check__box{border-color:var(--green-500)}
.cw-check input:checked+.cw-check__box{background:var(--green-700);border-color:var(--green-700)}
.cw-check input:focus-visible+.cw-check__box{box-shadow:var(--ring-focus)}
.cw-check__tick{width:11px;height:11px;stroke:var(--cream-50);stroke-width:3;fill:none;opacity:0;transform:scale(.6);transition:opacity var(--dur-fast) var(--ease-out-soft),transform var(--dur-fast) var(--ease-nudge)}
.cw-check input:checked+.cw-check__box .cw-check__tick{opacity:1;transform:scale(1)}
.cw-check--disabled{opacity:.45;cursor:not-allowed}
.cw-check__text strong{display:block;font-weight:var(--weight-semibold);color:var(--text-strong)}
.cw-check__text span{display:block;font:var(--type-caption);color:var(--text-muted)}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'checkbox');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Checkbox({
  label,
  description,
  disabled = false,
  ...rest
}) {
  inject();
  return /*#__PURE__*/React.createElement("label", {
    className: 'cw-check' + (disabled ? ' cw-check--disabled' : '')
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "cw-check__box"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "cw-check__tick",
    viewBox: "0 0 12 12"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "1.5,6.5 4.5,9.5 10.5,2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "cw-check__text"
  }, description ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", null, label), /*#__PURE__*/React.createElement("span", null, description)) : label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cw-field{display:flex;flex-direction:column;gap:6px}
.cw-field__label{font:var(--type-label);color:var(--text-strong)}
.cw-field__hint{font:var(--type-caption);color:var(--text-muted)}
.cw-field__hint--error{color:var(--over-text)}
.cw-input{display:flex;align-items:center;gap:9px;height:var(--height-control);padding:0 14px;background:var(--surface-card);border:1px solid var(--border-default);border-radius:var(--radius-control);color:var(--text-strong);transition:var(--transition-control)}
.cw-input:hover{border-color:var(--border-strong)}
.cw-input:focus-within{border-color:var(--border-focus);box-shadow:var(--ring-focus)}
.cw-input--error{border-color:var(--over)}
.cw-input--error:focus-within{box-shadow:var(--ring-danger)}
.cw-input--filled{background:var(--surface-sunken);border-color:transparent}
.cw-input--lg{height:52px;padding:0 16px}
.cw-input input{flex:1;min-width:0;border:0;background:transparent;outline:none;font:var(--type-body);color:var(--text-strong)}
.cw-input input::placeholder{color:var(--text-faint)}
.cw-input--disabled{background:var(--cream-100);opacity:.6}
.cw-input__affix{font:var(--type-label);color:var(--text-muted);white-space:nowrap}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'input');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Input({
  label,
  hint,
  error,
  icon,
  suffix,
  size = 'md',
  filled = false,
  id,
  ...rest
}) {
  inject();
  const fid = id || 'cw-in-' + Math.random().toString(36).slice(2, 8);
  const cls = ['cw-input', error && 'cw-input--error', filled && 'cw-input--filled', size === 'lg' && 'cw-input--lg', rest.disabled && 'cw-input--disabled'].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: "cw-field"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "cw-field__label",
    htmlFor: fid
  }, label), /*#__PURE__*/React.createElement("div", {
    className: cls
  }, icon && /*#__PURE__*/React.createElement("span", {
    className: "cw-input__affix",
    style: {
      display: 'inline-flex'
    }
  }, icon), /*#__PURE__*/React.createElement("input", _extends({
    id: fid
  }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
    className: "cw-input__affix"
  }, suffix)), (error || hint) && /*#__PURE__*/React.createElement("span", {
    className: 'cw-field__hint' + (error ? ' cw-field__hint--error' : '')
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/MoneyInput.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cw-money-field{display:flex;flex-direction:column;gap:6px}
.cw-money-field__label{font:var(--type-label);color:var(--text-strong)}
.cw-money-box{display:flex;align-items:center;height:var(--height-control);padding:0 14px;background:var(--surface-card);border:1px solid var(--border-default);border-radius:var(--radius-control);transition:var(--transition-control)}
.cw-money-box:hover{border-color:var(--border-strong)}
.cw-money-box:focus-within{border-color:var(--border-focus);box-shadow:var(--ring-focus)}
.cw-money-box--lg{height:56px;padding:0 16px}
.cw-money-box__cur{font:var(--weight-bold) var(--text-md)/1 var(--font-display);color:var(--text-muted);margin-right:8px}
.cw-money-box--lg .cw-money-box__cur{font-size:var(--text-xl)}
.cw-money-box input{flex:1;min-width:0;border:0;outline:none;background:transparent;font:var(--weight-semibold) var(--text-md)/1 var(--font-mono);font-variant-numeric:tabular-nums;color:var(--text-strong)}
.cw-money-box--lg input{font-size:var(--text-2xl);font-family:var(--font-display);font-weight:700}
.cw-money-box__per{font:var(--type-caption);color:var(--text-muted);margin-left:8px;white-space:nowrap}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'money');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function MoneyInput({
  label,
  currency = '€',
  per,
  size = 'md',
  value,
  onChange,
  ...rest
}) {
  inject();
  return /*#__PURE__*/React.createElement("div", {
    className: "cw-money-field"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "cw-money-field__label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: 'cw-money-box' + (size === 'lg' ? ' cw-money-box--lg' : '')
  }, /*#__PURE__*/React.createElement("span", {
    className: "cw-money-box__cur"
  }, currency), /*#__PURE__*/React.createElement("input", _extends({
    inputMode: "decimal",
    value: value,
    onChange: onChange
  }, rest)), per && /*#__PURE__*/React.createElement("span", {
    className: "cw-money-box__per"
  }, "/ ", per)));
}
Object.assign(__ds_scope, { MoneyInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/MoneyInput.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
const CSS = `
.cw-select-wrap{display:flex;flex-direction:column;gap:6px}
.cw-select-wrap__label{font:var(--type-label);color:var(--text-strong)}
.cw-select{position:relative;display:flex;align-items:center;height:var(--height-control);background:var(--surface-card);border:1px solid var(--border-default);border-radius:var(--radius-control);transition:var(--transition-control)}
.cw-select:hover{border-color:var(--border-strong)}
.cw-select:focus-within{border-color:var(--border-focus);box-shadow:var(--ring-focus)}
.cw-select--filled{background:var(--surface-sunken);border-color:transparent}
.cw-select select{appearance:none;width:100%;height:100%;padding:0 38px 0 14px;border:0;background:transparent;outline:none;font:var(--type-body);color:var(--text-strong);cursor:pointer}
.cw-select__chev{position:absolute;right:12px;pointer-events:none;color:var(--text-muted);display:inline-flex}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'select');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Select({
  label,
  options = [],
  filled = false,
  chevron,
  ...rest
}) {
  inject();
  return /*#__PURE__*/React.createElement("div", {
    className: "cw-select-wrap"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "cw-select-wrap__label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: 'cw-select' + (filled ? ' cw-select--filled' : '')
  }, /*#__PURE__*/React.createElement("select", rest, options.map(o => {
    const v = typeof o === 'string' ? o : o.value,
      l = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })), /*#__PURE__*/React.createElement("span", {
    className: "cw-select__chev"
  }, chevron || '▾')));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cw-switch{display:inline-flex;align-items:center;gap:12px;cursor:pointer;font:var(--type-body);color:var(--text-body)}
.cw-switch input{position:absolute;opacity:0;width:0;height:0}
.cw-switch__track{position:relative;flex:0 0 auto;width:46px;height:28px;border-radius:var(--radius-pill);background:var(--sand-300);transition:background-color var(--dur-base) var(--ease-out-soft)}
.cw-switch__knob{position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:var(--white);box-shadow:var(--shadow-sm);transition:transform var(--dur-base) var(--ease-nudge)}
.cw-switch input:checked+.cw-switch__track{background:var(--green-600)}
.cw-switch input:checked+.cw-switch__track .cw-switch__knob{transform:translateX(18px)}
.cw-switch input:focus-visible+.cw-switch__track{box-shadow:var(--ring-focus)}
.cw-switch--sm .cw-switch__track{width:38px;height:23px}
.cw-switch--sm .cw-switch__knob{width:18px;height:18px;top:2.5px;left:2.5px}
.cw-switch--sm input:checked+.cw-switch__track .cw-switch__knob{transform:translateX(15px)}
.cw-switch--disabled{opacity:.45;cursor:not-allowed}
.cw-switch__text strong{display:block;font-weight:var(--weight-semibold);color:var(--text-strong)}
.cw-switch__text span{display:block;font:var(--type-caption);color:var(--text-muted)}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'switch');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Switch({
  label,
  description,
  size = 'md',
  disabled = false,
  reversed = true,
  ...rest
}) {
  inject();
  const control = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "switch",
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "cw-switch__track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cw-switch__knob"
  })));
  const text = label && /*#__PURE__*/React.createElement("span", {
    className: "cw-switch__text"
  }, description ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", null, label), /*#__PURE__*/React.createElement("span", null, description)) : label);
  return /*#__PURE__*/React.createElement("label", {
    className: ['cw-switch', size === 'sm' && 'cw-switch--sm', disabled && 'cw-switch--disabled'].filter(Boolean).join(' '),
    style: reversed ? {
      width: '100%',
      justifyContent: 'space-between'
    } : undefined
  }, reversed ? /*#__PURE__*/React.createElement(React.Fragment, null, text, control) : /*#__PURE__*/React.createElement(React.Fragment, null, control, text));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SidebarNav.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cw-side{display:flex;flex-direction:column;gap:2px}
.cw-side__group{font:var(--type-overline);letter-spacing:var(--tracking-caps);text-transform:uppercase;color:var(--text-muted);padding:16px 12px 6px}
.cw-side__item{display:flex;align-items:center;gap:11px;width:100%;min-height:42px;padding:0 12px;border:0;border-radius:var(--radius-md);background:transparent;color:var(--text-body);font:var(--weight-semibold) var(--text-base)/1.2 var(--font-body);cursor:pointer;text-align:left;transition:var(--transition-control)}
.cw-side__item:hover{background:var(--cream-100);color:var(--text-strong)}
.cw-side__item--active{background:var(--surface-brand-soft);color:var(--green-800)}
.cw-side__item--active:hover{background:var(--green-100)}
.cw-side__label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cw-side__badge{font:var(--weight-bold) var(--text-2xs)/1 var(--font-body);padding:4px 7px;border-radius:var(--radius-pill);background:var(--gold-300);color:var(--gold-800)}
.cw-side--collapsed .cw-side__item{justify-content:center;padding:0}
.cw-side--collapsed .cw-side__label,.cw-side--collapsed .cw-side__badge,.cw-side--collapsed .cw-side__group{display:none}
.cw-side--inverse .cw-side__item{color:rgba(253,251,246,.78)}
.cw-side--inverse .cw-side__item:hover{background:rgba(253,251,246,.10);color:var(--cream-50)}
.cw-side--inverse .cw-side__item--active{background:rgba(253,251,246,.14);color:var(--cream-50)}
.cw-side--inverse .cw-side__group{color:rgba(253,251,246,.5)}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'sidebar');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function SidebarNav({
  items = [],
  value,
  onChange,
  collapsed = false,
  inverse = false,
  ...rest
}) {
  inject();
  return /*#__PURE__*/React.createElement("nav", _extends({
    className: ['cw-side', collapsed && 'cw-side--collapsed', inverse && 'cw-side--inverse'].filter(Boolean).join(' ')
  }, rest), items.map((it, i) => it.group ? /*#__PURE__*/React.createElement("div", {
    key: 'g' + i,
    className: "cw-side__group"
  }, it.group) : /*#__PURE__*/React.createElement("button", {
    key: it.value,
    className: 'cw-side__item' + (it.value === value ? ' cw-side__item--active' : ''),
    onClick: () => onChange && onChange(it.value),
    title: it.label
  }, it.icon, /*#__PURE__*/React.createElement("span", {
    className: "cw-side__label"
  }, it.label), it.badge && /*#__PURE__*/React.createElement("span", {
    className: "cw-side__badge"
  }, it.badge))));
}
Object.assign(__ds_scope, { SidebarNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SidebarNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.cw-tabs{display:inline-flex;align-items:center;gap:4px;padding:4px;background:var(--surface-sunken);border-radius:var(--radius-pill)}
.cw-tabs--block{display:flex;width:100%}
.cw-tab{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:7px;height:36px;padding:0 16px;border:0;border-radius:var(--radius-pill);background:transparent;color:var(--text-muted);font:var(--weight-bold) var(--text-sm)/1 var(--font-body);cursor:pointer;white-space:nowrap;transition:var(--transition-control)}
.cw-tab:hover{color:var(--text-strong)}
.cw-tab--active{background:var(--surface-card);color:var(--text-strong);box-shadow:var(--shadow-sm)}
.cw-tab__count{font:var(--weight-bold) var(--text-2xs)/1 var(--font-body);padding:3px 6px;border-radius:var(--radius-pill);background:var(--cream-200);color:var(--text-muted)}
.cw-tab--active .cw-tab__count{background:var(--green-100);color:var(--green-800)}
.cw-tabs--underline{background:transparent;padding:0;gap:22px;border-bottom:1px solid var(--border-subtle);border-radius:0}
.cw-tabs--underline .cw-tab{flex:0 0 auto;height:42px;padding:0;border-radius:0;box-shadow:none;background:transparent;position:relative}
.cw-tabs--underline .cw-tab--active{color:var(--text-strong);background:transparent;box-shadow:none}
.cw-tabs--underline .cw-tab--active::after{content:'';position:absolute;left:0;right:0;bottom:-1px;height:2.5px;border-radius:2px;background:var(--green-700)}
`;
let _i = false;
function inject() {
  if (_i || typeof document === 'undefined') return;
  _i = true;
  const s = document.createElement('style');
  s.setAttribute('data-cw', 'tabs');
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Tabs({
  items = [],
  value,
  onChange,
  variant = 'pill',
  block = false,
  ...rest
}) {
  inject();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['cw-tabs', variant === 'underline' && 'cw-tabs--underline', block && 'cw-tabs--block'].filter(Boolean).join(' '),
    role: "tablist"
  }, rest), items.map(it => {
    const id = typeof it === 'string' ? it : it.value,
      label = typeof it === 'string' ? it : it.label;
    const active = id === value;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      role: "tab",
      "aria-selected": active,
      className: 'cw-tab' + (active ? ' cw-tab--active' : ''),
      onClick: () => onChange && onChange(id)
    }, typeof it !== 'string' && it.icon, label, typeof it !== 'string' && it.count != null && /*#__PURE__*/React.createElement("span", {
      className: "cw-tab__count"
    }, it.count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/costwise-app/AppShell.jsx
try { (() => {
(function () {
  if (!window.CostwiseDesignSystem_f2dfa3) {
    if (!document.getElementById('cw-ds-missing')) {
      const d = document.createElement('pre');
      d.id = 'cw-ds-missing';
      d.style.cssText = 'padding:24px;font:14px/1.6 monospace;color:#C0392B';
      d.textContent = 'Costwise design-system bundle not loaded \u2014 _ds_bundle.js is missing. It is generated by the compiler; reload once it exists.';
      document.body.appendChild(d);
    }
    return;
  }
  const {
    Logo,
    SidebarNav,
    Icon,
    IconButton,
    Avatar,
    Composer,
    Toast
  } = window.CostwiseDesignSystem_f2dfa3;
  const {
    useState,
    useEffect
  } = React;
  const {
    EmptyState
  } = window.CostwiseDesignSystem_f2dfa3;
  const getNav = () => [{
    value: 'today',
    label: 'Today',
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "house"
    })
  }, {
    value: 'ask',
    label: 'Ask Costwise',
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles"
    })
  }, {
    group: 'Kitchen'
  }, {
    value: 'dishes',
    label: 'Dishes',
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "utensils"
    })
  }, {
    value: 'ingredients',
    label: 'Ingredients',
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "carrot"
    })
  }, {
    value: 'invoices',
    label: 'Invoices',
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "receipt-text"
    }),
    badge: '2'
  }, {
    group: 'Your place'
  }, {
    value: 'suppliers',
    label: 'Suppliers',
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "truck"
    })
  }, {
    value: 'settings',
    label: 'Settings',
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "settings"
    })
  }];
  function AppShell({
    onSignOut
  }) {
    const NAV = getNav();
    const [view, setView] = useState('today');
    const [toast, setToast] = useState(null);
    useEffect(() => {
      lucide.createIcons && lucide.createIcons();
    }, [view]);
    useEffect(() => {
      if (!toast) return;
      const t = setTimeout(() => setToast(null), 3600);
      return () => clearTimeout(t);
    }, [toast]);
    const go = v => setView(v);
    const screens = {
      today: /*#__PURE__*/React.createElement(TodayScreen, {
        go: go,
        notify: setToast
      }),
      ask: /*#__PURE__*/React.createElement(AskScreen, {
        notify: setToast
      }),
      dishes: /*#__PURE__*/React.createElement(DishScreen, {
        go: go,
        notify: setToast
      }),
      invoices: /*#__PURE__*/React.createElement(InvoicesScreen, {
        notify: setToast
      })
    };
    const body = screens[view] || /*#__PURE__*/React.createElement(PlaceholderScreen, {
      label: (NAV.find(n => n.value === view) || {}).label
    });
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        height: '100%',
        minHeight: 0,
        background: 'var(--surface-page)'
      }
    }, /*#__PURE__*/React.createElement("aside", {
      style: {
        width: 'var(--width-sidebar)',
        flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: '18px 12px',
        borderRight: '1px solid var(--border-subtle)',
        background: 'var(--cream-50)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 6px 10px'
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      size: 26,
      src: "../../assets/logo-mark-transparent.png"
    })), /*#__PURE__*/React.createElement(SidebarNav, {
      value: view,
      onChange: go,
      items: NAV
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--surface-accent-soft)',
        borderRadius: 'var(--radius-card)',
        padding: '14px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--weight-bold) var(--text-sm)/1.3 var(--font-body)',
        color: 'var(--gold-800)'
      }
    }, "You've kept \u20AC1,840 this month"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-caption)',
        color: 'var(--gold-800)',
        opacity: .8,
        marginTop: 4
      }
    }, "Mostly by fixing three dish prices.")), /*#__PURE__*/React.createElement("button", {
      onClick: onSignOut,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 6px',
        border: 0,
        background: 'none',
        cursor: 'pointer',
        font: 'var(--type-label)',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "log-out",
      size: 18
    }), "Sign out")), /*#__PURE__*/React.createElement("main", {
      style: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("header", {
      style: {
        height: 'var(--height-topbar)',
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 26px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--surface-glass)',
        backdropFilter: 'blur(8px)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flex: 1,
        maxWidth: 420,
        height: 36,
        padding: '0 12px',
        background: 'var(--surface-sunken)',
        borderRadius: 'var(--radius-pill)',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 16
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-body)',
        fontSize: 'var(--text-sm)'
      }
    }, "Search dishes, ingredients, invoices\u2026")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "camera"
      }),
      label: "Snap an invoice",
      variant: "outline",
      onClick: () => notifySnap(setToast)
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "bell"
      }),
      label: "Nudges"
    }), /*#__PURE__*/React.createElement(Avatar, {
      name: "Marta Ruiz",
      online: true
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflow: 'auto'
      }
    }, body)), toast && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'fixed',
        left: '50%',
        bottom: 26,
        transform: 'translateX(-50%)',
        zIndex: 80
      }
    }, /*#__PURE__*/React.createElement(Toast, toast)));
  }
  function notifySnap(setToast) {
    setToast({
      tone: 'good',
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 18
      }),
      title: 'Got it — reading the invoice',
      message: 'I\u2019ll flag anything that went up.'
    });
  }
  function PlaceholderScreen({
    label
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '48px 26px',
        maxWidth: 560,
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement(EmptyState, {
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "hard-hat",
        size: 30
      }),
      title: (label || 'This screen') + ' isn\u2019t in the kit yet',
      message: "Nothing was supplied for this view, so it has been left blank on purpose rather than invented."
    }));
  }
  window.AppShell = AppShell;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/costwise-app/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/costwise-app/AskScreen.jsx
try { (() => {
(function () {
  if (!window.CostwiseDesignSystem_f2dfa3) {
    if (!document.getElementById('cw-ds-missing')) {
      const d = document.createElement('pre');
      d.id = 'cw-ds-missing';
      d.style.cssText = 'padding:24px;font:14px/1.6 monospace;color:#C0392B';
      d.textContent = 'Costwise design-system bundle not loaded \u2014 _ds_bundle.js is missing. It is generated by the compiler; reload once it exists.';
      document.body.appendChild(d);
    }
    return;
  }
  const {
    ChatBubble,
    Avatar,
    Composer,
    SuggestionChip,
    IconButton,
    Icon,
    Card,
    ProgressMeter,
    DataRow,
    Badge,
    Button,
    Dialog
  } = window.CostwiseDesignSystem_f2dfa3;
  const {
    useState,
    useEffect,
    useRef
  } = React;
  const MARK = '../../assets/logo-mark-transparent.png';
  function AskScreen({
    notify
  }) {
    const [q, setQ] = useState('');
    const [turns, setTurns] = useState([{
      from: 'agent',
      meta: 'Today, 8:04',
      text: /*#__PURE__*/React.createElement(React.Fragment, null, "Morning. Your ", /*#__PURE__*/React.createElement("strong", null, "carbonara"), " costs \u20AC3.90 a plate this week \u2014 40c more than last, because Metro put eggs up 14%."),
      attach: 'meter'
    }, {
      from: 'me',
      text: 'Do I need to change the price?'
    }, {
      from: 'agent',
      tone: 'note',
      text: /*#__PURE__*/React.createElement(React.Fragment, null, "Only if you want to keep the same margin. At ", /*#__PURE__*/React.createElement("strong", null, "\u20AC15.50"), " you're back to 68% \u2014 that's 50c more than today, and still under what the two places on your street charge."),
      attach: 'compare'
    }]);
    const [thinking, setThinking] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const end = useRef(null);
    useEffect(() => {
      lucide.createIcons && lucide.createIcons();
    }, [turns, thinking, confirm]);
    const ask = text => {
      setTurns(t => [...t, {
        from: 'me',
        text
      }]);
      setThinking(true);
      setTimeout(() => {
        setThinking(false);
        setTurns(t => [...t, {
          from: 'agent',
          meta: 'Just now',
          text: /*#__PURE__*/React.createElement(React.Fragment, null, "Push the ", /*#__PURE__*/React.createElement("strong", null, "sea bass"), ". It's your widest margin at 28% food cost, and you have 4kg landing tomorrow that won't keep past Friday."),
          attach: 'rows'
        }]);
      }, 1200);
    };
    const attachments = {
      meter: /*#__PURE__*/React.createElement(Card, {
        padding: "tight",
        style: {
          minWidth: 320
        }
      }, /*#__PURE__*/React.createElement(ProgressMeter, {
        label: "Carbonara plate cost",
        value: 3.9,
        max: 6,
        target: 4.2,
        tone: "watch",
        display: "\u20AC3.90 of \u20AC4.20"
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 8,
          marginTop: 12,
          flexWrap: 'wrap'
        }
      }, /*#__PURE__*/React.createElement(Badge, {
        tone: "watch"
      }, "Eggs +14%"), /*#__PURE__*/React.createElement(Badge, {
        tone: "neutral"
      }, "Guanciale flat"), /*#__PURE__*/React.createElement(Badge, {
        tone: "neutral"
      }, "Pecorino flat"))),
      compare: /*#__PURE__*/React.createElement(Card, {
        padding: "tight",
        style: {
          minWidth: 320
        }
      }, /*#__PURE__*/React.createElement(DataRow, {
        title: "Keep \u20AC15.00",
        subtitle: "Margin drops to 65%",
        amount: "\u20AC11.10",
        amountNote: "you keep"
      }), /*#__PURE__*/React.createElement(DataRow, {
        title: "Move to \u20AC15.50",
        subtitle: "Back to your usual 68%",
        amount: "\u20AC11.60",
        amountNote: "you keep",
        end: /*#__PURE__*/React.createElement(Badge, {
          tone: "good"
        }, "Suggested")
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 10,
          paddingTop: 12
        }
      }, /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        onClick: () => setConfirm(true)
      }, "Update the menu price"), /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        variant: "ghost"
      }, "Leave it"))),
      rows: /*#__PURE__*/React.createElement(Card, {
        padding: "tight",
        style: {
          minWidth: 320
        }
      }, /*#__PURE__*/React.createElement(DataRow, {
        thumb: /*#__PURE__*/React.createElement(Icon, {
          name: "fish"
        }),
        title: "Grilled sea bass",
        subtitle: "4kg arriving tomorrow",
        amount: "28%",
        amountNote: "food cost",
        end: /*#__PURE__*/React.createElement(Badge, {
          tone: "good"
        }, "Push")
      }), /*#__PURE__*/React.createElement(DataRow, {
        thumb: /*#__PURE__*/React.createElement(Icon, {
          name: "salad"
        }),
        title: "Tomato & burrata",
        subtitle: "Burrata up 9%",
        amount: "32%",
        amountNote: "food cost",
        end: /*#__PURE__*/React.createElement(Badge, {
          tone: "over"
        }, "Hold")
      }))
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minHeight: 0,
        overflow: 'auto',
        padding: '26px 26px 8px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 760,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        paddingBottom: 6
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      agent: true,
      src: MARK,
      size: "lg"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-heading)',
        color: 'var(--text-strong)'
      }
    }, "Costwise"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-caption)',
        color: 'var(--text-muted)'
      }
    }, "Knows your last 14 weeks of invoices \xB7 Casa Ruiz"))), turns.map((t, i) => /*#__PURE__*/React.createElement(ChatBubble, {
      key: i,
      from: t.from,
      tone: t.tone,
      meta: t.meta,
      avatar: t.from === 'agent' ? /*#__PURE__*/React.createElement(Avatar, {
        agent: true,
        src: MARK
      }) : null,
      attachment: t.attach ? attachments[t.attach] : null
    }, t.text)), thinking && /*#__PURE__*/React.createElement(ChatBubble, {
      typing: true,
      avatar: /*#__PURE__*/React.createElement(Avatar, {
        agent: true,
        src: MARK
      })
    }), /*#__PURE__*/React.createElement("div", {
      ref: end
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: '0 0 auto',
        padding: '12px 26px 22px',
        background: 'linear-gradient(to top,var(--surface-page) 70%,rgba(253,251,246,0))'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 760,
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement(SuggestionChip, {
      onClick: () => ask('What should I push tonight?')
    }, "What should I push tonight?"), /*#__PURE__*/React.createElement(SuggestionChip, {
      variant: "accent",
      onClick: () => ask('Which supplier got dearer?')
    }, "Which supplier got dearer?"), /*#__PURE__*/React.createElement(SuggestionChip, {
      onClick: () => ask('How was last month?')
    }, "How was last month?")), /*#__PURE__*/React.createElement(Composer, {
      value: q,
      onChange: e => setQ(e.target.value),
      onSend: () => {
        if (q.trim()) {
          ask(q.trim());
          setQ('');
        }
      },
      lead: /*#__PURE__*/React.createElement(Icon, {
        name: "sparkles",
        size: 16
      }),
      sendIcon: /*#__PURE__*/React.createElement(Icon, {
        name: "arrow-up",
        size: 18
      }),
      tools: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IconButton, {
        size: "sm",
        round: true,
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "camera",
          size: 18
        }),
        label: "Snap an invoice"
      }), /*#__PURE__*/React.createElement(IconButton, {
        size: "sm",
        round: true,
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "mic",
          size: 18
        }),
        label: "Speak"
      }))
    }))), /*#__PURE__*/React.createElement(Dialog, {
      open: confirm,
      title: "Raise the carbonara to \u20AC15.50?",
      onClose: () => setConfirm(false),
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        onClick: () => setConfirm(false)
      }, "Not yet"), /*#__PURE__*/React.createElement(Button, {
        onClick: () => {
          setConfirm(false);
          notify({
            tone: 'good',
            icon: /*#__PURE__*/React.createElement(Icon, {
              name: "check",
              size: 18
            }),
            title: 'Menu price updated',
            message: 'Carbonara is €15.50 from tonight.',
            actionLabel: 'Undo'
          });
        }
      }, "Update the menu"))
    }, "That keeps you at a 68% margin even if eggs stay where they are. I'll let you know if they come back down."));
  }
  window.AskScreen = AskScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/costwise-app/AskScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/costwise-app/DishScreen.jsx
try { (() => {
(function () {
  if (!window.CostwiseDesignSystem_f2dfa3) {
    if (!document.getElementById('cw-ds-missing')) {
      const d = document.createElement('pre');
      d.id = 'cw-ds-missing';
      d.style.cssText = 'padding:24px;font:14px/1.6 monospace;color:#C0392B';
      d.textContent = 'Costwise design-system bundle not loaded \u2014 _ds_bundle.js is missing. It is generated by the compiler; reload once it exists.';
      document.body.appendChild(d);
    }
    return;
  }
  const {
    Card,
    Badge,
    Button,
    IconButton,
    Icon,
    DataRow,
    ProgressMeter,
    StatTile,
    MoneyInput,
    Tabs,
    Tooltip,
    SuggestionChip
  } = window.CostwiseDesignSystem_f2dfa3;
  const {
    useState,
    useEffect
  } = React;
  const ING = [{
    n: 'Guanciale',
    s: 'Bidfood · 14 Aug',
    q: '60 g',
    c: '€1.44',
    up: false,
    i: 'beef'
  }, {
    n: 'Free-range eggs',
    s: 'Metro · price up 14%',
    q: '2 yolks',
    c: '€0.72',
    up: true,
    i: 'egg'
  }, {
    n: 'Pecorino romano',
    s: 'Metro · 11 Aug',
    q: '30 g',
    c: '€0.81',
    up: false,
    i: 'milk'
  }, {
    n: 'Spaghetti',
    s: 'Dry store',
    q: '110 g',
    c: '€0.28',
    up: false,
    i: 'wheat'
  }, {
    n: 'Black pepper, oil, salt',
    s: 'Store cupboard',
    q: '—',
    c: '€0.65',
    up: false,
    i: 'utensils'
  }];
  function DishScreen({
    go,
    notify
  }) {
    const [tab, setTab] = useState('Ingredients');
    const [price, setPrice] = useState('15.00');
    useEffect(() => {
      lucide.createIcons && lucide.createIcons();
    }, [tab]);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1000,
        margin: '0 auto',
        padding: '26px 26px 60px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      variant: "outline",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "arrow-left"
      }),
      label: "Back to dishes",
      onClick: () => go('today')
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 240
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "cw-overline"
    }, "Dish"), /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--type-title)',
        color: 'var(--text-strong)',
        marginTop: 2
      }
    }, "Carbonara")), /*#__PURE__*/React.createElement(Badge, {
      tone: "watch",
      size: "lg",
      dot: true
    }, "Cost up 40c this week"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "pencil",
        size: 18
      })
    }, "Edit recipe")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gap: 'var(--gap-cards)'
      }
    }, /*#__PURE__*/React.createElement(StatTile, {
      label: "Plate cost",
      value: "\u20AC3.90",
      delta: "\u2191 \u20AC0.40",
      deltaTone: "over",
      caption: "vs last week"
    }), /*#__PURE__*/React.createElement(StatTile, {
      label: "Menu price",
      value: '€' + price
    }), /*#__PURE__*/React.createElement(StatTile, {
      label: "Food cost",
      value: "26",
      unit: "%",
      delta: "\u2191 2.6 pts",
      deltaTone: "over",
      caption: "target 25%"
    }), /*#__PURE__*/React.createElement(StatTile, {
      variant: "brand",
      label: "You keep",
      value: "\u20AC11.10",
      unit: "/ plate"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: 'var(--gap-cards)',
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "tight"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '2px 2px 12px'
      }
    }, /*#__PURE__*/React.createElement(Tabs, {
      variant: "underline",
      value: tab,
      onChange: setTab,
      items: ['Ingredients', 'History', 'Notes']
    })), tab === 'Ingredients' && /*#__PURE__*/React.createElement(React.Fragment, null, ING.map(r => /*#__PURE__*/React.createElement(DataRow, {
      key: r.n,
      thumb: /*#__PURE__*/React.createElement(Icon, {
        name: r.i
      }),
      title: r.n,
      subtitle: r.s,
      amount: r.c,
      amountNote: r.q,
      end: r.up ? /*#__PURE__*/React.createElement(Badge, {
        tone: "over"
      }, "+14%") : null
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        paddingTop: 14
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 18
      })
    }, "Add ingredient"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-label)',
        color: 'var(--text-muted)'
      }
    }, "Plate cost"), /*#__PURE__*/React.createElement("span", {
      className: "cw-money",
      style: {
        fontSize: 'var(--text-md)',
        color: 'var(--text-strong)'
      }
    }, "\u20AC3.90"))), tab === 'History' && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '6px 2px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, [['Week 30', '€3.42', 57], ['Week 31', '€3.48', 58], ['Week 32', '€3.50', 58], ['Week 33', '€3.90', 65]].map(([w, c, v]) => /*#__PURE__*/React.createElement(ProgressMeter, {
      key: w,
      label: w,
      display: c,
      value: v,
      max: 100,
      tone: v > 62 ? 'watch' : 'good'
    }))), tab === 'Notes' && /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-body)',
        color: 'var(--text-muted)',
        padding: '8px 2px 12px'
      }
    }, "Nothing written down for this dish yet.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--gap-cards)'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      variant: "accent",
      eyebrow: "Costwise suggests",
      title: "\u20AC15.50 keeps your margin"
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-body)',
        color: 'var(--ink-800)'
      }
    }, "50c more than now. Still the cheapest carbonara on your street."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(MoneyInput, {
      label: "Menu price",
      size: "lg",
      value: price,
      onChange: e => setPrice(e.target.value)
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      onClick: () => {
        setPrice('15.50');
        notify({
          tone: 'good',
          icon: /*#__PURE__*/React.createElement(Icon, {
            name: "check",
            size: 18
          }),
          title: 'Menu price updated',
          message: 'Carbonara is €15.50 from tonight.',
          actionLabel: 'Undo'
        });
      }
    }, "Use \u20AC15.50"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost"
    }, "Keep \u20AC15.00")))), /*#__PURE__*/React.createElement(Card, {
      padding: "tight",
      title: "What's in the plate cost",
      icon: /*#__PURE__*/React.createElement(Tooltip, {
        wrap: true,
        label: "What you pay for the food on one plate, before staff and rent."
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "circle-help",
        size: 16
      }))
    }, /*#__PURE__*/React.createElement(ProgressMeter, {
      thick: true,
      segments: [{
        value: 37
      }, {
        value: 21
      }, {
        value: 18
      }, {
        value: 7
      }, {
        value: 17
      }],
      max: 100,
      caption: "Guanciale \xB7 Pecorino \xB7 Eggs \xB7 Pasta \xB7 Cupboard"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement(SuggestionChip, {
      variant: "filter"
    }, "Swap the guanciale"), /*#__PURE__*/React.createElement(SuggestionChip, {
      variant: "filter"
    }, "Compare suppliers"))))));
  }
  window.DishScreen = DishScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/costwise-app/DishScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/costwise-app/InvoicesScreen.jsx
try { (() => {
(function () {
  if (!window.CostwiseDesignSystem_f2dfa3) {
    if (!document.getElementById('cw-ds-missing')) {
      const d = document.createElement('pre');
      d.id = 'cw-ds-missing';
      d.style.cssText = 'padding:24px;font:14px/1.6 monospace;color:#C0392B';
      d.textContent = 'Costwise design-system bundle not loaded \u2014 _ds_bundle.js is missing. It is generated by the compiler; reload once it exists.';
      document.body.appendChild(d);
    }
    return;
  }
  const {
    Card,
    Badge,
    Button,
    IconButton,
    Icon,
    DataRow,
    Tabs,
    SuggestionChip,
    EmptyState,
    Checkbox,
    Select,
    StatTile
  } = window.CostwiseDesignSystem_f2dfa3;
  const {
    useState,
    useEffect
  } = React;
  const INV = [{
    id: 1,
    who: 'Metro',
    date: '18 Aug',
    items: '14 items · 3 prices changed',
    amt: '€412.60',
    tone: 'watch',
    label: 'Check'
  }, {
    id: 2,
    who: 'Local market',
    date: '17 Aug',
    items: 'Photo, not read yet',
    amt: '€96.20',
    tone: 'info',
    label: 'New'
  }, {
    id: 3,
    who: 'Bidfood',
    date: '14 Aug',
    items: '22 items · all as expected',
    amt: '€688.40',
    tone: 'good',
    label: 'Filed'
  }, {
    id: 4,
    who: 'Metro',
    date: '11 Aug',
    items: '9 items · all as expected',
    amt: '€204.15',
    tone: 'good',
    label: 'Filed'
  }];
  function InvoicesScreen({
    notify
  }) {
    const [tab, setTab] = useState('todo');
    const [open, setOpen] = useState(INV[0]);
    useEffect(() => {
      lucide.createIcons && lucide.createIcons();
    }, [tab, open]);
    const list = tab === 'todo' ? INV.filter(i => i.tone !== 'good') : INV;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1060,
        margin: '0 auto',
        padding: '26px 26px 60px',
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 14,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 260
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--type-title)',
        color: 'var(--text-strong)'
      }
    }, "Invoices"), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-body)',
        color: 'var(--text-muted)',
        marginTop: 6
      }
    }, "Snap them, I'll read them and tell you what moved.")), /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      items: [{
        value: 'todo',
        label: 'Needs you',
        count: 2
      }, {
        value: 'all',
        label: 'Everything'
      }]
    }), /*#__PURE__*/React.createElement(Button, {
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "camera",
        size: 18
      }),
      onClick: () => notify({
        tone: 'good',
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "check",
          size: 18
        }),
        title: 'Got it — reading the invoice',
        message: 'I\u2019ll flag anything that went up.'
      })
    }, "Snap an invoice")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 'var(--gap-cards)'
      }
    }, /*#__PURE__*/React.createElement(StatTile, {
      label: "Spent this month",
      value: "\u20AC4,120",
      delta: "\u2191 \u20AC260",
      deltaTone: "over",
      caption: "vs July"
    }), /*#__PURE__*/React.createElement(StatTile, {
      label: "Prices that moved",
      value: "7",
      unit: "items",
      delta: "5 up \xB7 2 down",
      deltaTone: "flat"
    }), /*#__PURE__*/React.createElement(StatTile, {
      label: "Invoices waiting",
      value: "2"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1.15fr',
        gap: 'var(--gap-cards)',
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "tight"
    }, list.map(i => /*#__PURE__*/React.createElement(DataRow, {
      key: i.id,
      thumb: /*#__PURE__*/React.createElement(Icon, {
        name: "receipt-text"
      }),
      title: i.who + ' · ' + i.date,
      subtitle: i.items,
      amount: i.amt,
      end: /*#__PURE__*/React.createElement(Badge, {
        tone: i.tone
      }, i.label),
      onClick: () => setOpen(i)
    })), !list.length && /*#__PURE__*/React.createElement(EmptyState, {
      compact: true,
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 28
      }),
      title: "All caught up",
      message: "Nothing waiting on you."
    })), /*#__PURE__*/React.createElement(Card, {
      eyebrow: 'Invoice · ' + open.who,
      title: open.who + ' · ' + open.date,
      action: /*#__PURE__*/React.createElement(IconButton, {
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "ellipsis"
        }),
        label: "More"
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "watch",
      dot: true
    }, "3 prices changed"), /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, open.amt), /*#__PURE__*/React.createElement(Badge, {
      tone: "outline"
    }, "Read by Costwise")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement(DataRow, {
      thumb: /*#__PURE__*/React.createElement(Icon, {
        name: "egg"
      }),
      title: "Free-range eggs, 30s",
      subtitle: "was \u20AC3.68 \xB7 now \u20AC4.20",
      amount: "+14%",
      end: /*#__PURE__*/React.createElement(Badge, {
        tone: "over"
      }, "Up")
    }), /*#__PURE__*/React.createElement(DataRow, {
      thumb: /*#__PURE__*/React.createElement(Icon, {
        name: "milk"
      }),
      title: "Cream 35%, 1L",
      subtitle: "was \u20AC2.45 \xB7 now \u20AC2.65",
      amount: "+8%",
      end: /*#__PURE__*/React.createElement(Badge, {
        tone: "over"
      }, "Up")
    }), /*#__PURE__*/React.createElement(DataRow, {
      thumb: /*#__PURE__*/React.createElement(Icon, {
        name: "carrot"
      }),
      title: "Carrots, 10kg",
      subtitle: "was \u20AC12.40 \xB7 now \u20AC11.00",
      amount: "\u221211%",
      end: /*#__PURE__*/React.createElement(Badge, {
        tone: "good"
      }, "Down")
    }), /*#__PURE__*/React.createElement(DataRow, {
      thumb: /*#__PURE__*/React.createElement(Icon, {
        name: "wheat"
      }),
      title: "11 other items",
      subtitle: "No change",
      amount: "\u20AC318.75"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16,
        paddingTop: 16,
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Checkbox, {
      label: "Update my dish costs with these prices",
      defaultChecked: true,
      description: "Three dishes use eggs or cream."
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      onClick: () => notify({
        tone: 'good',
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "check",
          size: 18
        }),
        title: 'Invoice filed',
        message: 'Three dish costs updated.',
        actionLabel: 'See them'
      })
    }, "File it"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary"
    }, "Something looks wrong"))))));
  }
  window.InvoicesScreen = InvoicesScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/costwise-app/InvoicesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/costwise-app/LoginScreen.jsx
try { (() => {
(function () {
  if (!window.CostwiseDesignSystem_f2dfa3) {
    if (!document.getElementById('cw-ds-missing')) {
      const d = document.createElement('pre');
      d.id = 'cw-ds-missing';
      d.style.cssText = 'padding:24px;font:14px/1.6 monospace;color:#C0392B';
      d.textContent = 'Costwise design-system bundle not loaded \u2014 _ds_bundle.js is missing. It is generated by the compiler; reload once it exists.';
      document.body.appendChild(d);
    }
    return;
  }
  const {
    Logo,
    Button,
    Input,
    Icon
  } = window.CostwiseDesignSystem_f2dfa3;
  function LoginScreen({
    onSignIn
  }) {
    React.useEffect(() => {
      lucide.createIcons && lucide.createIcons();
    }, []);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.05fr 1fr',
        height: '100%',
        minHeight: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 clamp(32px,7vw,96px)',
        gap: 22
      }
    }, /*#__PURE__*/React.createElement(Logo, {
      size: 30,
      src: "../../assets/logo-mark-transparent.png"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--type-display)',
        fontSize: 'var(--text-3xl)',
        color: 'var(--text-strong)'
      }
    }, "Let's see where your money goes."), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-body)',
        color: 'var(--text-muted)',
        marginTop: 10,
        maxWidth: '42ch'
      }
    }, "Costwise keeps an eye on what your dishes cost, so you can spend your evening in the kitchen instead of the spreadsheet.")), /*#__PURE__*/React.createElement("form", {
      onSubmit: e => {
        e.preventDefault();
        onSignIn();
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        maxWidth: 380
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Email",
      type: "email",
      defaultValue: "marta@casaruiz.es",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "mail",
        size: 18
      })
    }), /*#__PURE__*/React.createElement(Input, {
      label: "Password",
      type: "password",
      defaultValue: "\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7\xB7",
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "lock",
        size: 18
      })
    }), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      block: true,
      type: "submit",
      iconRight: /*#__PURE__*/React.createElement(Icon, {
        name: "arrow-right",
        size: 18
      })
    }, "Come on in"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        color: 'var(--text-faint)',
        font: 'var(--type-caption)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        height: 1,
        background: 'var(--border-subtle)'
      }
    }), "or", /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        height: 1,
        background: 'var(--border-subtle)'
      }
    })), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "lg",
      block: true,
      type: "button",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "smartphone",
        size: 18
      })
    }, "Send me a code instead"), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-caption)',
        color: 'var(--text-muted)',
        textAlign: 'center'
      }
    }, "New here? ", /*#__PURE__*/React.createElement("a", {
      href: "#"
    }, "Set up your place")))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--surface-brand-soft)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        padding: 40,
        borderLeft: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/brand-illustration-cast-transparent.png",
      alt: "",
      style: {
        width: 'min(78%,440px)',
        height: 'auto'
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-subheading)',
        color: 'var(--green-800)',
        textAlign: 'center',
        maxWidth: '26ch'
      }
    }, "Food, money and a calculator walk into a kitchen.")));
  }
  window.LoginScreen = LoginScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/costwise-app/LoginScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/costwise-app/TodayScreen.jsx
try { (() => {
(function () {
  if (!window.CostwiseDesignSystem_f2dfa3) {
    if (!document.getElementById('cw-ds-missing')) {
      const d = document.createElement('pre');
      d.id = 'cw-ds-missing';
      d.style.cssText = 'padding:24px;font:14px/1.6 monospace;color:#C0392B';
      d.textContent = 'Costwise design-system bundle not loaded \u2014 _ds_bundle.js is missing. It is generated by the compiler; reload once it exists.';
      document.body.appendChild(d);
    }
    return;
  }
  const {
    Card,
    StatTile,
    ProgressMeter,
    DataRow,
    Badge,
    Button,
    SuggestionChip,
    Composer,
    IconButton,
    Icon,
    Avatar,
    Tabs
  } = window.CostwiseDesignSystem_f2dfa3;
  const {
    useState,
    useEffect
  } = React;
  function TodayScreen({
    go,
    notify
  }) {
    const [q, setQ] = useState('');
    const [range, setRange] = useState('week');
    useEffect(() => {
      lucide.createIcons && lucide.createIcons();
    }, [range]);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1000,
        margin: '0 auto',
        padding: '26px 26px 120px',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--gap-section)'
      }
    }, /*#__PURE__*/React.createElement("section", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 14,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 280
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--type-title)',
        color: 'var(--text-strong)'
      }
    }, "Morning, Marta."), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-body)',
        color: 'var(--text-muted)',
        marginTop: 6
      }
    }, "Two things worth a look before service, and one bit of good news.")), /*#__PURE__*/React.createElement(Tabs, {
      value: range,
      onChange: setRange,
      items: [{
        value: 'week',
        label: 'This week'
      }, {
        value: 'month',
        label: 'Month'
      }]
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gap: 'var(--gap-cards)'
      }
    }, /*#__PURE__*/React.createElement(StatTile, {
      label: "Food cost",
      value: "31.4",
      unit: "%",
      delta: "\u2193 2.1 pts",
      deltaTone: "good",
      caption: "target 30%"
    }), /*#__PURE__*/React.createElement(StatTile, {
      label: "Plate cost avg",
      value: "\u20AC4.18",
      delta: "\u2191 \u20AC0.22",
      deltaTone: "over",
      caption: "eggs, cream"
    }), /*#__PURE__*/React.createElement(StatTile, {
      label: "Waste",
      value: "\u20AC184",
      delta: "\u2193 \u20AC31",
      deltaTone: "good",
      caption: "best month yet"
    }), /*#__PURE__*/React.createElement(StatTile, {
      variant: "brand",
      label: "Kept this month",
      value: "\u20AC1,840"
    }))), /*#__PURE__*/React.createElement("section", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.35fr 1fr',
        gap: 'var(--gap-cards)',
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      variant: "accent",
      eyebrow: "Costwise spotted this",
      title: "Eggs are up 14% at Metro",
      action: /*#__PURE__*/React.createElement(Badge, {
        tone: "watch",
        dot: true
      }, "Worth a look")
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--type-body)',
        color: 'var(--ink-800)'
      }
    }, "That's 40c a plate on the carbonara. Two options: hold the price and take the hit for a fortnight, or go to \u20AC15.50 and stay at a 68% margin."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        marginTop: 16,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      onClick: () => go('dishes')
    }, "Look at the carbonara"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary",
      onClick: () => notify({
        title: 'Parked until Monday',
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "clock",
          size: 18
        })
      })
    }, "Remind me Monday"))), /*#__PURE__*/React.createElement(Card, {
      eyebrow: "This week",
      title: "Where the money went"
    }, /*#__PURE__*/React.createElement(ProgressMeter, {
      thick: true,
      segments: [{
        value: 42
      }, {
        value: 24
      }, {
        value: 19
      }, {
        value: 15
      }],
      max: 100
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        marginTop: 14
      }
    }, [['Produce', '€1,240', '--viz-1'], ['Dairy & eggs', '€712', '--viz-2'], ['Meat & fish', '€560', '--viz-3'], ['Dry goods', '€442', '--viz-4']].map(([l, v, c]) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        font: 'var(--type-body)',
        fontSize: 'var(--text-sm)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 9,
        height: 9,
        borderRadius: 3,
        background: 'var(' + c + ')'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        color: 'var(--text-body)'
      }
    }, l), /*#__PURE__*/React.createElement("span", {
      className: "cw-money",
      style: {
        color: 'var(--text-strong)'
      }
    }, v)))))), /*#__PURE__*/React.createElement("section", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--gap-cards)',
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "tight",
      eyebrow: "Your dishes",
      title: "Costs that moved",
      action: /*#__PURE__*/React.createElement(IconButton, {
        size: "sm",
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "chevron-right"
        }),
        label: "All dishes",
        onClick: () => go('dishes')
      })
    }, /*#__PURE__*/React.createElement(DataRow, {
      thumb: /*#__PURE__*/React.createElement(Icon, {
        name: "utensils"
      }),
      title: "Carbonara",
      subtitle: "Plate cost \u20AC3.90 \xB7 menu \u20AC15.00",
      amount: "26%",
      amountNote: "food cost",
      end: /*#__PURE__*/React.createElement(Badge, {
        tone: "watch"
      }, "Up 40c"),
      onClick: () => go('dishes')
    }), /*#__PURE__*/React.createElement(DataRow, {
      thumb: /*#__PURE__*/React.createElement(Icon, {
        name: "salad"
      }),
      title: "Tomato & burrata",
      subtitle: "Plate cost \u20AC4.35 \xB7 menu \u20AC13.50",
      amount: "32%",
      amountNote: "food cost",
      end: /*#__PURE__*/React.createElement(Badge, {
        tone: "over"
      }, "Thin"),
      onClick: () => go('dishes')
    }), /*#__PURE__*/React.createElement(DataRow, {
      thumb: /*#__PURE__*/React.createElement(Icon, {
        name: "fish"
      }),
      title: "Grilled sea bass",
      subtitle: "Plate cost \u20AC6.10 \xB7 menu \u20AC22.00",
      amount: "28%",
      amountNote: "food cost",
      end: /*#__PURE__*/React.createElement(Badge, {
        tone: "good"
      }, "Fine"),
      onClick: () => go('dishes')
    })), /*#__PURE__*/React.createElement(Card, {
      padding: "tight",
      eyebrow: "Waiting on you",
      title: "Two invoices to file",
      action: /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        variant: "ghost",
        onClick: () => go('invoices')
      }, "Open")
    }, /*#__PURE__*/React.createElement(DataRow, {
      thumb: /*#__PURE__*/React.createElement(Icon, {
        name: "receipt-text"
      }),
      title: "Metro \xB7 18 Aug",
      subtitle: "14 items \xB7 3 prices changed",
      amount: "\u20AC412.60",
      end: /*#__PURE__*/React.createElement(Badge, {
        tone: "watch"
      }, "Check"),
      onClick: () => go('invoices')
    }), /*#__PURE__*/React.createElement(DataRow, {
      thumb: /*#__PURE__*/React.createElement(Icon, {
        name: "receipt-text"
      }),
      title: "Local market \xB7 17 Aug",
      subtitle: "Photo, not read yet",
      amount: "\u20AC96.20",
      end: /*#__PURE__*/React.createElement(Badge, {
        tone: "info"
      }, "New"),
      onClick: () => go('invoices')
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        paddingTop: 12,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(SuggestionChip, {
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "camera",
        size: 15
      }),
      onClick: () => notify({
        tone: 'good',
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "check",
          size: 18
        }),
        title: 'Got it — reading the invoice',
        message: 'I\u2019ll flag anything that went up.'
      })
    }, "Snap a new one")))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'sticky',
        bottom: 0,
        paddingBottom: 8,
        background: 'linear-gradient(to top,var(--surface-page) 62%,rgba(253,251,246,0))',
        paddingTop: 22
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement(SuggestionChip, {
      variant: "accent",
      onClick: () => notify({
        title: 'Opening the carbonara',
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "sparkles",
          size: 18
        })
      })
    }, "Why did my margin drop?"), /*#__PURE__*/React.createElement(SuggestionChip, null, "What should I push tonight?"), /*#__PURE__*/React.createElement(SuggestionChip, null, "Cheapest dish on the menu")), /*#__PURE__*/React.createElement(Composer, {
      value: q,
      onChange: e => setQ(e.target.value),
      onSend: () => {
        setQ('');
        notify({
          tone: 'good',
          title: 'On it',
          message: 'Costwise is looking at your last four weeks.'
        });
      },
      lead: /*#__PURE__*/React.createElement(Icon, {
        name: "sparkles",
        size: 16
      }),
      sendIcon: /*#__PURE__*/React.createElement(Icon, {
        name: "arrow-up",
        size: 18
      }),
      tools: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IconButton, {
        size: "sm",
        round: true,
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "camera",
          size: 18
        }),
        label: "Snap an invoice"
      }), /*#__PURE__*/React.createElement(IconButton, {
        size: "sm",
        round: true,
        icon: /*#__PURE__*/React.createElement(Icon, {
          name: "mic",
          size: 18
        }),
        label: "Speak"
      }))
    })));
  }
  window.TodayScreen = TodayScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/costwise-app/TodayScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.ChatBubble = __ds_scope.ChatBubble;

__ds_ns.Composer = __ds_scope.Composer;

__ds_ns.SuggestionChip = __ds_scope.SuggestionChip;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.DataRow = __ds_scope.DataRow;

__ds_ns.ProgressMeter = __ds_scope.ProgressMeter;

__ds_ns.StatTile = __ds_scope.StatTile;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.MoneyInput = __ds_scope.MoneyInput;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.SidebarNav = __ds_scope.SidebarNav;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
