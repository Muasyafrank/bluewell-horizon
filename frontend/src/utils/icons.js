/**
 * Icon name resolution for content that comes from the database.
 *
 * Services and technologies store an icon as a string such as "FaTint". Pages
 * used to do `import * as FaIcons from 'react-icons/fa'`, which pulls the whole
 * icon set (1,600+ components) into the bundle. This module registers only the
 * icons the content actually uses, so the bundle stays small.
 */
import {
  FaAward, FaBuilding, FaBullseye, FaChartLine, FaCheckCircle, FaClock, FaCogs,
  FaEye, FaFilter, FaFlask, FaHandshake, FaHome, FaIndustry, FaLeaf, FaLightbulb,
  FaMicroscope, FaProjectDiagram, FaRecycle, FaShieldAlt, FaSnowflake, FaSolarPanel,
  FaTachometerAlt, FaTint, FaTools, FaTruck, FaUsers, FaVial, FaWater, FaWrench,
} from 'react-icons/fa';

const ICONS = {
  FaAward, FaBuilding, FaBullseye, FaChartLine, FaCheckCircle, FaClock, FaCogs,
  FaEye, FaFilter, FaFlask, FaHandshake, FaHome, FaIndustry, FaLeaf, FaLightbulb,
  FaMicroscope, FaProjectDiagram, FaRecycle, FaShieldAlt, FaSnowflake, FaSolarPanel,
  FaTachometerAlt, FaTint, FaTools, FaTruck, FaUsers, FaVial, FaWater, FaWrench,
};

/** Names offered to admins in the icon picker. */
export const ICON_NAMES = Object.keys(ICONS).sort();

/** Returns the icon component for a stored name, falling back to a water drop. */
export function resolveIcon(name, fallback = FaTint) {
  return ICONS[name] || fallback;
}
