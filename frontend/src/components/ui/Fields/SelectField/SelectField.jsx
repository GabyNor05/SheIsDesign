import "./SelectField.css";

function SelectField({ label, name, value, onChange, options, placeholder, error }) {
  return (
    <div className="select-field">
      {label && <label className="select-field__label">{label}</label>}
      <div className="select-field__wrap">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`select-field__select ${error ? "select-field__select--error" : ""}`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <span className="select-field__chevron" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
      {error && <span className="select-field__error">{error}</span>}
    </div>
  );
}

export default SelectField;