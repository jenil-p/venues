import React from 'react';
import { 
  FaParking, FaWifi, FaRegSnowflake, FaTv, 
  FaVolumeUp, FaBolt, FaWheelchair, FaShieldAlt, FaCoffee 
} from 'react-icons/fa';

const iconMap = {
  parking: <FaParking className="text-sm" />,
  wifi: <FaWifi className="text-sm" />,
  ac: <FaRegSnowflake className="text-sm" />,
  projector: <FaTv className="text-sm" />,
  sound: <FaVolumeUp className="text-sm" />,
  power: <FaBolt className="text-sm" />,
  wheelchair: <FaWheelchair className="text-sm" />,
  security: <FaShieldAlt className="text-sm" />,
  coffee: <FaCoffee className="text-sm" />
};

const AmenitiesList = ({ features }) => {
  if (!features || features.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-mono tracking-wider uppercase text-[#A8A29E]">INCLUDED AMENITIES</h4>
      <div className="flex flex-wrap gap-2">
        {features.map((f, idx) => {
          const iconKey = f.feature?.icon?.toLowerCase();
          return (
            <span 
              key={idx} 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EBE6DD] rounded-xl text-sm font-medium text-[#44403C]"
            >
              {iconMap[iconKey] || iconMap['wifi']}
              {f.feature?.name}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default AmenitiesList;