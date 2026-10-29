import CreatureStage from '../CreatureStage/CreatureStage.jsx';
import { makeChoir } from './choir.js';

export default function Choir() {
  return <CreatureStage make={makeChoir} height={420} />;
}
