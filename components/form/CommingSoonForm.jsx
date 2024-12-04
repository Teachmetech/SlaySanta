

'use client'


import React from 'react'

export default function CommingSoonForm() {
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  return (
    <form onClick="">
      <input
        placeholder="SANTA"
        maxlength="5"
        onInput={(e) => e.target.value = e.target.value.toUpperCase()}
      />
      <button>Join Secret Santa</button>
    </form>
  )
}
