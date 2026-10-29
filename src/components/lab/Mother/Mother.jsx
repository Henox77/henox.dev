import CreatureStage from '../CreatureStage/CreatureStage.jsx';
import { makeMother } from './mother.js';

export default function Mother() {
  return <CreatureStage make={makeMother} height={420} />;
}
