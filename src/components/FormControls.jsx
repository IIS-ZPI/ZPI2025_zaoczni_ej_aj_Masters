import React from 'react'

export function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

export function Readonly({ label, value }) {
  return (
    <div>
      <label>{label}</label>
      <input value={value} readOnly />
    </div>
  )
}
