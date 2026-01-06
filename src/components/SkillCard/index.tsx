import React from 'react';
import styles from './styles.module.css';
import { getSkill, formatSkillRoll } from '@site/src/data/skills';

// Parse markdown syntax into React elements
// Supports: **bold**, *italic/highlight*, and bullet lists (lines starting with *)
function parseMarkdown(text: string): React.ReactNode {
  // Split by newlines to handle bullet points
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const parseInline = (line: string, keyPrefix: string): React.ReactNode => {
    // Match **bold** and *highlight* patterns
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={`${keyPrefix}-${i}`} className={styles.highlight}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  lines.forEach((line, lineIndex) => {
    const trimmed = line.trim();

    // Check if line is a bullet point (starts with * followed by space or text)
    if (trimmed.startsWith('* ') || (trimmed.startsWith('*') && trimmed.length > 1 && trimmed[1] !== '*')) {
      const bulletContent = trimmed.startsWith('* ') ? trimmed.slice(2) : trimmed.slice(1);
      currentList.push(<li key={`li-${lineIndex}`}>{parseInline(bulletContent, `li-${lineIndex}`)}</li>);
    } else {
      // Flush current list if we have one
      if (currentList.length > 0) {
        result.push(<ul key={`ul-${lineIndex}`} className={styles.inlineList}>{currentList}</ul>);
        currentList = [];
      }

      // Add non-bullet content
      if (trimmed) {
        if (result.length > 0) {
          result.push(<br key={`br-${lineIndex}`} />);
        }
        result.push(<span key={`span-${lineIndex}`}>{parseInline(trimmed, `span-${lineIndex}`)}</span>);
      } else if (result.length > 0 && lines[lineIndex - 1]?.trim()) {
        // Empty line after content = paragraph break
        result.push(<br key={`br-${lineIndex}`} />);
      }
    }
  });

  // Flush any remaining list
  if (currentList.length > 0) {
    result.push(<ul key="ul-final" className={styles.inlineList}>{currentList}</ul>);
  }

  return result;
}

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
        <span className={styles.description}>{parseMarkdown(skill.description ?? '')}</span>
      </div>

      {skill.roll !== undefined && (
        <div className={styles.section}>
          When {skill.clause}, roll <strong>{formatSkillRoll(skill)}</strong>.
        </div>
      )}

      {skill.roll === undefined && (
        <div className={styles.section}>
          When {skill.clause},
        </div>
      )}

      {skill.subclauses ? (
        <ul className={styles.subclauses}>
          {skill.subclauses.map((subclause, index) => (
            <li key={index}>{parseMarkdown(subclause)}</li>
          ))}
        </ul>
      ) : (
        <div className={styles.outcomes}>
          <div className={styles.outcome}>
            <strong className={styles.outcomeLabel}>On a 10+:</strong> {parseMarkdown(skill.success ?? '')}
          </div>

          <div className={styles.outcome}>
            <strong className={styles.outcomeLabel}>On a 6-9:</strong> {parseMarkdown(skill.partialSuccess ?? '')}
          </div>

          <div className={styles.outcome}>
            <strong className={styles.outcomeLabel}>Otherwise:</strong> {parseMarkdown(skill.failure ?? '')}
          </div>
        </div>
      )}
    </div>
  );
}
