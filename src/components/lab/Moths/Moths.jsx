import CreatureStage from '../CreatureStage/CreatureStage.jsx';
import { makeMoths } from './moths.js';

export default function Moths() {
  return <CreatureStage make={makeMoths} />;
}
