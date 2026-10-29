import CreatureStage from '../CreatureStage/CreatureStage.jsx';
import { makeReptile } from './creature.js';

export default function Reptile() {
  return <CreatureStage make={makeReptile} minFrameMs={33} />;
}
