import { useState } from 'react'

export default function CharacterSheet() {
  const [character, setCharacter] = useState(null)
  const [rollResult, setRollResult] = useState(null)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result)
          setCharacter(data)
        } catch (error) {
          alert('Invalid character file')
        }
      }
      reader.readAsText(file)
    }
  }

  const rollDice = (sides) => {
    const result = Math.floor(Math.random() * sides) + 1
    setRollResult({ sides, result })
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '20px' }}>
      <h3>Character Sheet</h3>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Upload Character (JSON):
          <input type="file" accept=".json" onChange={handleFileUpload} style={{ marginLeft: '10px' }} />
        </label>
      </div>

      {character && (
        <div style={{ marginBottom: '20px' }}>
          <h4>Character: {character.name || 'Unknown'}</h4>
          {character.skills && (
            <div>
              <strong>Skills:</strong>
              <ul>
                {Object.entries(character.skills).map(([skill, value]) => (
                  <li key={skill}>{skill}: {value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h4>Dice Roller</h4>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button onClick={() => rollDice(4)} style={{ padding: '8px 16px' }}>Roll d4</button>
          <button onClick={() => rollDice(6)} style={{ padding: '8px 16px' }}>Roll d6</button>
          <button onClick={() => rollDice(8)} style={{ padding: '8px 16px' }}>Roll d8</button>
          <button onClick={() => rollDice(10)} style={{ padding: '8px 16px' }}>Roll d10</button>
          <button onClick={() => rollDice(20)} style={{ padding: '8px 16px' }}>Roll d20</button>
        </div>
        {rollResult && (
          <p style={{ marginTop: '10px', fontSize: '18px', fontWeight: 'bold' }}>
            You rolled a d{rollResult.sides}: {rollResult.result}
          </p>
        )}
      </div>
    </div>
  )
}
