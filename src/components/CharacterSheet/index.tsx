import React, { useState, useCallback } from 'react';
import styles from './styles.module.css';
import type {
  Character,
  CharacterStats,
  DerivedStats,
  StatName,
  RollResult,
  Item,
  EquipmentSlots,
  CharacterSkill,
} from '@site/src/types';
import BackgroundPicker, { type AppliedBackground } from '@site/src/components/BackgroundPicker';
import { getSkill } from '@site/src/data/skills';

// Helper: Calculate derived stats from base stats and equipment
const calculateDerivedStats = (stats: CharacterStats, equipment: EquipmentSlots): DerivedStats => {
  const defence = equipment.armor?.defence || 0;

  return {
    hp: 12 + stats.CON * 3,
    maxHp: 12 + stats.CON * 3,
    wp: 12 + stats.WIL * 3,
    maxWp: 12 + stats.WIL * 3,
    carryCapacity: 12 + stats.POW * 3,
    defence,
    speed: 8 + stats.POW,
  };
};

// Helper: Create initial character
const createInitialCharacter = (): Character => {
  const initialStats: CharacterStats = {
    POW: -2,
    PRE: -2,
    CON: -2,
    WIT: -2,
    WIL: -2,
  };

  const initialEquipment: EquipmentSlots = {
    armor: null,
    leftHand: null,
    rightHand: null,
    accessories: [],
  };

  return {
    name: '',
    description: '',
    biography: '',
    relations: '',
    notes: '',
    stats: initialStats,
    derivedStats: calculateDerivedStats(initialStats, initialEquipment),
    background: null,
    experiences: [],
    skills: [],
    items: [],
    equipment: initialEquipment,
    freeStatPoints: 8,
  };
};

// Helper: Roll 2d6 with modifier
const roll2d6 = (statModifier: number, statName: StatName): RollResult => {
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  const total = die1 + die2 + statModifier;

  return { die1, die2, modifier: statModifier, total, statName };
};

export default function CharacterSheet(): React.JSX.Element {
  const [character, setCharacter] = useState<Character>(createInitialCharacter());
  const [rollResult, setRollResult] = useState<RollResult | null>(null);
  const [selectedStat, setSelectedStat] = useState<StatName>('POW');
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);

  // Edit mode states
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingBiography, setEditingBiography] = useState(false);
  const [editingRelations, setEditingRelations] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);

  // Temporary edit values
  const [tempValue, setTempValue] = useState('');

  // Edit handlers
  const startEdit = (field: 'name' | 'description' | 'biography' | 'relations' | 'notes') => {
    setTempValue(character[field]);
    switch (field) {
      case 'name': setEditingName(true); break;
      case 'description': setEditingDescription(true); break;
      case 'biography': setEditingBiography(true); break;
      case 'relations': setEditingRelations(true); break;
      case 'notes': setEditingNotes(true); break;
    }
  };

  const saveEdit = (field: 'name' | 'description' | 'biography' | 'relations' | 'notes') => {
    setCharacter(prev => ({ ...prev, [field]: tempValue }));
    cancelEdit(field);
  };

  const cancelEdit = (field: 'name' | 'description' | 'biography' | 'relations' | 'notes') => {
    setTempValue('');
    switch (field) {
      case 'name': setEditingName(false); break;
      case 'description': setEditingDescription(false); break;
      case 'biography': setEditingBiography(false); break;
      case 'relations': setEditingRelations(false); break;
      case 'notes': setEditingNotes(false); break;
    }
  };

  // Check if stat can be increased
  const canIncreaseStat = (statValue: number): boolean => {
    // Can't increase if no free points
    if (character.freeStatPoints <= 0) return false;

    // Natural limit is +2, but supernatural bonuses can go higher
    // For now, we'll allow increases up to +2 with free points
    return statValue < 2;
  };

  // Check if stat can be decreased
  const canDecreaseStat = (statValue: number): boolean => {
    // Can't decrease below -2
    return statValue > -2;
  };

  // Adjust a stat
  const adjustStat = useCallback((stat: StatName, delta: number) => {
    setCharacter(prev => {
      const currentValue = prev.stats[stat];
      const newValue = currentValue + delta;

      // Validate the change
      if (delta > 0 && !canIncreaseStat(currentValue)) return prev;
      if (delta < 0 && !canDecreaseStat(currentValue)) return prev;

      const newStats = { ...prev.stats, [stat]: newValue };
      const newFreePoints = prev.freeStatPoints - delta;

      return {
        ...prev,
        stats: newStats,
        freeStatPoints: newFreePoints,
        derivedStats: calculateDerivedStats(newStats, prev.equipment),
      };
    });
  }, [character.freeStatPoints]);

  // Handle roll
  const handleRoll = () => {
    const modifier = character.stats[selectedStat];
    const result = roll2d6(modifier, selectedStat);
    setRollResult(result);
  };

  // Export character
  const handleExport = () => {
    const dataStr = JSON.stringify(character, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${character.name || 'character'}-urs-character.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import character
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);

        // Basic validation
        if (!data.stats || !data.name || data.freeStatPoints === undefined) {
          alert('Invalid character file: missing required fields');
          return;
        }

        // Ensure equipment and derived stats are properly set
        const equipment: EquipmentSlots = data.equipment || {
          armor: null,
          leftHand: null,
          rightHand: null,
          accessories: [],
        };

        const imported: Character = {
          ...data,
          equipment,
          derivedStats: calculateDerivedStats(data.stats, equipment),
        };

        setCharacter(imported);
      } catch (error) {
        alert('Invalid character file: not valid JSON');
      }
    };
    reader.readAsText(file);
  };

  // Get stat label with supernatural indicator
  const getStatLabel = (stat: StatName, value: number): string => {
    const isSupernatural = value > 2 || value < -2;
    return isSupernatural ? `${value} (Supernatural)` : `${value}`;
  };

  // Handle applying a background
  const handleApplyBackground = (result: AppliedBackground) => {
    setCharacter(prev => {
      // Apply stat bonuses
      const newStats = { ...prev.stats };
      for (const stat of ['POW', 'PRE', 'CON', 'WIT', 'WIL'] as StatName[]) {
        newStats[stat] += result.statBonuses[stat];
      }

      // Add skills
      const newSkills: CharacterSkill[] = [...prev.skills, ...result.skills];

      // Add items to inventory
      const newItems: Item[] = [...prev.items];
      for (const { item, amount } of result.items) {
        // For stackable items, add with quantity
        const newItem = { ...item, quantity: amount };
        newItems.push(newItem);
      }

      // Check if any items are armor and auto-equip if no armor equipped
      let newEquipment = { ...prev.equipment };
      for (const { item } of result.items) {
        if (item.isArmor && !newEquipment.armor) {
          newEquipment.armor = item;
        }
      }

      return {
        ...prev,
        stats: newStats,
        skills: newSkills,
        items: newItems,
        equipment: newEquipment,
        background: result.background,
        derivedStats: calculateDerivedStats(newStats, newEquipment),
      };
    });
    setShowBackgroundPicker(false);
  };

  // Stat descriptions
  const statDescriptions: Record<StatName, string> = {
    POW: 'Physical force and speed',
    PRE: 'Dexterity and balance',
    CON: 'Hardiness and endurance',
    WIT: 'Learning and knowledge',
    WIL: 'Focus and mental fortitude',
  };

  return (
    <div className={styles.characterSheet}>
      <h3>Character Sheet</h3>

      {/* Character Info Section */}
      <div className={styles.characterInfoSection}>
        {/* Name */}
        <div className={styles.infoField}>
          <div className={styles.infoHeader}>
            <strong>Name:</strong>
            {!editingName && (
              <button
                className={styles.editButton}
                onClick={() => startEdit('name')}
                title="Edit name"
              >
                ✏️
              </button>
            )}
          </div>
          {editingName ? (
            <div className={styles.editMode}>
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className={styles.editInput}
                autoFocus
              />
              <div className={styles.editButtons}>
                <button onClick={() => saveEdit('name')} className={styles.saveButton}>Save</button>
                <button onClick={() => cancelEdit('name')} className={styles.cancelButton}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className={styles.infoContent}>
              {character.name || <span className={styles.placeholder}>Click edit to add name</span>}
            </div>
          )}
        </div>

        {/* Physical Description */}
        <div className={styles.infoField}>
          <div className={styles.infoHeader}>
            <strong>Physical Description:</strong>
            {!editingDescription && (
              <button
                className={styles.editButton}
                onClick={() => startEdit('description')}
                title="Edit physical description"
              >
                ✏️
              </button>
            )}
          </div>
          {editingDescription ? (
            <div className={styles.editMode}>
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className={styles.editTextarea}
                rows={3}
                autoFocus
              />
              <div className={styles.editButtons}>
                <button onClick={() => saveEdit('description')} className={styles.saveButton}>Save</button>
                <button onClick={() => cancelEdit('description')} className={styles.cancelButton}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className={styles.infoContent}>
              {character.description || <span className={styles.placeholder}>Click edit to add physical description</span>}
            </div>
          )}
        </div>

        {/* Biography */}
        <div className={styles.infoField}>
          <div className={styles.infoHeader}>
            <strong>Biography:</strong>
            {!editingBiography && (
              <button
                className={styles.editButton}
                onClick={() => startEdit('biography')}
                title="Edit biography"
              >
                ✏️
              </button>
            )}
          </div>
          {editingBiography ? (
            <div className={styles.editMode}>
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className={styles.editTextarea}
                rows={4}
                autoFocus
              />
              <div className={styles.editButtons}>
                <button onClick={() => saveEdit('biography')} className={styles.saveButton}>Save</button>
                <button onClick={() => cancelEdit('biography')} className={styles.cancelButton}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className={styles.infoContent}>
              {character.biography || <span className={styles.placeholder}>Click edit to add biography</span>}
            </div>
          )}
        </div>

        {/* Relations */}
        <div className={styles.infoField}>
          <div className={styles.infoHeader}>
            <strong>Relations with Other Characters:</strong>
            {!editingRelations && (
              <button
                className={styles.editButton}
                onClick={() => startEdit('relations')}
                title="Edit relations"
              >
                ✏️
              </button>
            )}
          </div>
          {editingRelations ? (
            <div className={styles.editMode}>
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className={styles.editTextarea}
                rows={3}
                autoFocus
              />
              <div className={styles.editButtons}>
                <button onClick={() => saveEdit('relations')} className={styles.saveButton}>Save</button>
                <button onClick={() => cancelEdit('relations')} className={styles.cancelButton}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className={styles.infoContent}>
              {character.relations || <span className={styles.placeholder}>Click edit to add relations</span>}
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <div className={styles.infoField}>
          <div className={styles.infoHeader}>
            <strong>Additional Notes:</strong>
            {!editingNotes && (
              <button
                className={styles.editButton}
                onClick={() => startEdit('notes')}
                title="Edit notes"
              >
                ✏️
              </button>
            )}
          </div>
          {editingNotes ? (
            <div className={styles.editMode}>
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className={styles.editTextarea}
                rows={3}
                autoFocus
              />
              <div className={styles.editButtons}>
                <button onClick={() => saveEdit('notes')} className={styles.saveButton}>Save</button>
                <button onClick={() => cancelEdit('notes')} className={styles.cancelButton}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className={styles.infoContent}>
              {character.notes || <span className={styles.placeholder}>Click edit to add notes</span>}
            </div>
          )}
        </div>
      </div>

      {/* Background Section */}
      <div className={styles.backgroundSection}>
        <h4>Background</h4>
        {showBackgroundPicker ? (
          <BackgroundPicker
            onApply={handleApplyBackground}
            onCancel={() => setShowBackgroundPicker(false)}
          />
        ) : character.background ? (
          <div className={styles.currentBackground}>
            <div className={styles.backgroundInfo}>
              <strong>{character.background.name}</strong>
              <p>{character.background.description}</p>
            </div>
            <button
              className={styles.changeBackgroundButton}
              onClick={() => setShowBackgroundPicker(true)}
            >
              Change Background
            </button>
          </div>
        ) : (
          <div className={styles.noBackground}>
            <p className={styles.placeholder}>No background selected</p>
            <button
              className={styles.selectBackgroundButton}
              onClick={() => setShowBackgroundPicker(true)}
            >
              Select Background
            </button>
          </div>
        )}
      </div>

      {/* Skills Section */}
      {character.skills.length > 0 && (
        <div className={styles.skillsSection}>
          <h4>Skills</h4>
          <div className={styles.skillsList}>
            {character.skills.map((charSkill, index) => {
              const skill = getSkill(charSkill.skillId);
              if (!skill) return null;
              return (
                <div key={index} className={styles.skillItem}>
                  <strong>{skill.name}</strong>
                  {charSkill.chosenStat && (
                    <span className={styles.skillStat}>({charSkill.chosenStat})</span>
                  )}
                  {charSkill.chosenStats && charSkill.chosenStats.length > 0 && (
                    <span className={styles.skillStat}>({charSkill.chosenStats.join('/')})</span>
                  )}
                  {charSkill.promptAnswers && Object.entries(charSkill.promptAnswers).map(([prompt, answer]) => (
                    answer && <div key={prompt} className={styles.skillAnswer}>{answer}</div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Base Stats Editor */}
      <div className={styles.statsSection}>
        <h4>Base Stats <span className={styles.freePoints}>(Free Points: {character.freeStatPoints}/8)</span></h4>
        <div className={styles.statsList}>
          {(['POW', 'PRE', 'CON', 'WIT', 'WIL'] as StatName[]).map(stat => (
            <div key={stat} className={styles.statRow}>
              <div className={styles.statLabel}>
                <strong>{stat}</strong>
                <span className={styles.statDescription}>{statDescriptions[stat]}</span>
              </div>
              <div className={styles.statControls}>
                <button
                  onClick={() => adjustStat(stat, -1)}
                  disabled={!canDecreaseStat(character.stats[stat])}
                  className={styles.statButton}
                >
                  −
                </button>
                <span className={styles.statValue}>
                  {getStatLabel(stat, character.stats[stat])}
                </span>
                <button
                  onClick={() => adjustStat(stat, 1)}
                  disabled={!canIncreaseStat(character.stats[stat])}
                  className={styles.statButton}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Slots */}
      <div className={styles.equipmentSection}>
        <h4>Equipment</h4>
        <div className={styles.equipmentSlots}>
          <div className={styles.equipmentSlot}>
            <span className={styles.slotLabel}>Armor:</span>
            <span className={styles.slotValue}>
              {character.equipment.armor ? character.equipment.armor.name : 'None'}
            </span>
            <span className={styles.slotStats}>
              Defence: {character.derivedStats.defence}
            </span>
          </div>
          <div className={styles.equipmentSlot}>
            <span className={styles.slotLabel}>Left Hand:</span>
            <span className={styles.slotValue}>
              {character.equipment.leftHand ? character.equipment.leftHand.name : 'Fist'}
            </span>
          </div>
          <div className={styles.equipmentSlot}>
            <span className={styles.slotLabel}>Right Hand:</span>
            <span className={styles.slotValue}>
              {character.equipment.rightHand ? character.equipment.rightHand.name : 'Fist'}
            </span>
            <span className={styles.slotStats}>
              Reach: {(() => {
                const weapon = character.equipment.leftHand || character.equipment.rightHand;
                return weapon?.reach ? `${weapon.reach}m` : '1m';
              })()} | Damage: {(() => {
                const weapon = character.equipment.leftHand || character.equipment.rightHand;
                return weapon?.damage ?? '1d3';
              })()}
            </span>
          </div>
          <div className={styles.equipmentSlot}>
            <span className={styles.slotLabel}>Accessories:</span>
            <span className={styles.slotValue}>
              {character.equipment.accessories.length > 0
                ? character.equipment.accessories.map(a => a.name).join(', ')
                : 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Derived Stats Display */}
      <div className={styles.derivedStatsSection}>
        <h4>Combat Stats</h4>
        <div className={styles.derivedStatsGrid}>
          <div className={styles.derivedStat}>
            <span className={styles.derivedStatLabel}>HP:</span>
            <span className={styles.derivedStatValue}>
              {character.derivedStats.hp}/{character.derivedStats.maxHp}
            </span>
          </div>
          <div className={styles.derivedStat}>
            <span className={styles.derivedStatLabel}>WP:</span>
            <span className={styles.derivedStatValue}>
              {character.derivedStats.wp}/{character.derivedStats.maxWp}
            </span>
          </div>
          <div className={styles.derivedStat}>
            <span className={styles.derivedStatLabel}>Carry Capacity:</span>
            <span className={styles.derivedStatValue}>
              0/{character.derivedStats.carryCapacity}kg
            </span>
          </div>
          <div className={styles.derivedStat}>
            <span className={styles.derivedStatLabel}>Speed:</span>
            <span className={styles.derivedStatValue}>
              {character.derivedStats.speed}m
            </span>
          </div>
        </div>
      </div>

      {/* 2d6 Roller */}
      <div className={styles.diceRoller}>
        <h4>Skill Roll (2d6 + Stat)</h4>
        <div className={styles.rollControls}>
          <label>
            Select Stat:
            <select
              value={selectedStat}
              onChange={(e) => setSelectedStat(e.target.value as StatName)}
              className={styles.statSelect}
            >
              {(['POW', 'PRE', 'CON', 'WIT', 'WIL'] as StatName[]).map(stat => (
                <option key={stat} value={stat}>
                  {stat} ({character.stats[stat] >= 0 ? '+' : ''}{character.stats[stat]})
                </option>
              ))}
            </select>
          </label>
          <button onClick={handleRoll} className={styles.rollButton}>
            Roll 2d6 + {selectedStat} ({character.stats[selectedStat] >= 0 ? '+' : ''}{character.stats[selectedStat]})
          </button>
        </div>
        {rollResult && (
          <div className={styles.rollResult}>
            <p className={styles.rollBreakdown}>
              <span className={styles.die}>[{rollResult.die1}]</span> +
              <span className={styles.die}>[{rollResult.die2}]</span> +
              <span className={styles.modifier}>{rollResult.modifier >= 0 ? '+' : ''}{rollResult.modifier}</span> =
              <strong className={styles.total}>{rollResult.total}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Import/Export */}
      <div className={styles.importExportSection}>
        <div className={styles.buttonGroup}>
          <label className={styles.importButton}>
            Import Character
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </label>
          <button onClick={handleExport} className={styles.exportButton}>
            Export Character
          </button>
        </div>
      </div>
    </div>
  );
}
