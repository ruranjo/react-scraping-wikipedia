import React from 'react';
import { HistoricalEvent } from '../../interfaces/date.interface';

interface EventCardProps {
  event: HistoricalEvent;
  emoji: string; // Agregamos una propiedad para el emoji
}

const EventCard: React.FC<EventCardProps> = ({ event, emoji }) => {
  return (
    <div className="flex justify-center items-center">
      
      <div className="bg-blue-300 shadow-md rounded-lg p-4 flex items-center">
        <div className='p-4' >{emoji}</div> 
        <div>
        <h3 className="text-lg font-semibold">{event.year}</h3>
        <p className="text-gray-600">{event.content}</p>
        </div>
      </div>
      
    </div>
  );
};

export default EventCard;