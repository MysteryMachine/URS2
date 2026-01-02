import React from 'react';
import styles from './styles.module.css';
import { getSkill, formatSkillRoll } from '@site/src/data/skills';

interface SkillCardProps {
  id: string;
}

export default function SkillCard({ id }: SkillCardProps): React.JSX.Element {
  const skill = getSkill(id);

  if (!skill) {
    return (
      <div className={styles.skillCard}>
        <p className={styles.error}>Skill not found: {id}</p>
      </div>
    );
  }

  return (
    <div className={styles.skillCard}>
      <div className={styles.header}>
        <h3 className={styles.skillName}>{skill.name}</h3>
      </div>

      <div className={styles.section}>
        <span className={styles.description}>{skill.description}</span>
      </div>

      {skill.roll !== undefined && (
        <div className={styles.section}>
          When {skill.clause}, roll <strong>{formatSkillRoll(skill)}</strong>.
        </div>
      )}

      {skill.roll === undefined && (
        <div className={styles.section}>
          When {skill.clause}:
        </div>
      )}

      {skill.subclauses ? (
        <ul className={styles.subclauses}>
          {skill.subclauses.map((subclause, index) => (
            <li key={index}>{subclause}</li>
          ))}
        </ul>
      ) : (
        <div className={styles.outcomes}>
          <div className={styles.outcome}>
            <strong className={styles.outcomeLabel}>On a 10+:</strong> {skill.success}
          </div>

          <div className={styles.outcome}>
            <strong className={styles.outcomeLabel}>On a 6-9:</strong> {skill.partialSuccess}
          </div>

          <div className={styles.outcome}>
            <strong className={styles.outcomeLabel}>Otherwise:</strong> {skill.failure}
          </div>
        </div>
      )}
    </div>
  );
}
