import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { DateOfBirthInput } from './components';
import { ApiResponse, HistoricalEvent } from './interfaces/date.interface';
import EventCard from './components/CartEvent/CartEvent';

const App: React.FC = () => {
  const [date, setDate] = useState<{ day: number; month: number; year: number }>({
    day: 1,
    month: 1,
    year: new Date().getFullYear(),
  });

  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [dataType, setDataType] = useState<string>(''); 
  const [show, setShow] = useState<boolean>(false); 
  const [loading, setLoading] = useState<boolean>(false);

  const handleDateChange = (newDate: { day: number; month: number; year: number }) => {
    setDate(newDate);
    console.log('Fecha de nacimiento:', newDate);
  };

  const handleSearch = async () => {
    setShow(false)
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/endpoint', {
        day: date.day,
        month: date.month,
        year: date.year,
      });

      setApiResponse(response.data);
      console.log('Respuesta de la API:', response.data);
    } catch (error) {
      console.error('Error al realizar la petición:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowBirths = () => {
    setShow(true)
    setDataType('births');
  };

  const handleShowEvents = () => {
    setShow(true)
    setDataType('events');
  };

  const handleShowDeaths = () => {
    setShow(true)
    setDataType('deaths');
  };

  const getRandomEmoji = () => {
    const faceEmojis = ["😀", "😎", "😂", "😊", "🥳", "😜", "🤩", "😇", "😍", "🤔", "😋", "🥺", "😴", "🙄", "😬", "🤗", "😱", "🤯", "😈", "👻", "👽", "🤖", "💩", "👏", "🙌", "👍", "👌", "✌️", "🤘"];
    const foodEmojis = ["🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥒", "🌶️", "🌽", "🥕", "🥔", "🍠", "🥐", "🍞", "🥖", "🥨", "🧀", "🥚"];
    const otherEmojis = ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🏓", "🏸", "🥏", "🏒", "🏑", "🥍", "🏏", "🎿", "⛷️", "🏂", "🪂", "🏋️", "🤼", "🤸", "⛹️", "🤺", "🚴", "🏆", "🎖️", "🎪", "🎭", "🎲"];
    
    const emojis = [faceEmojis, foodEmojis, otherEmojis];
    const categoryIndex = Math.floor(Math.random() * emojis.length);
    const category = emojis[categoryIndex];
    
    const randomIndex = Math.floor(Math.random() * category.length);
    return category[randomIndex];
};

  const getEventsForYear = (year: number) => {
    if (!apiResponse) return { birth: null, event: null, death: null };

    const births = apiResponse.scrapedData.births.filter((b) => b.year === year) || null;
    const events = apiResponse.scrapedData.events.filter((e) => e.year === year) || null;
    const deaths = apiResponse.scrapedData.deaths.filter((d) => d.year === year) || null;

    const getRandomEvent = (events: HistoricalEvent[]) => {
        if (events.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * events.length);
        return events[randomIndex];
    };

    return { birth: getRandomEvent(births), event: getRandomEvent(events), death: getRandomEvent(deaths) };
};

  const renderSingleEvent = (event: HistoricalEvent | null, title: string) => (
    event ? (
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <EventCard event={event} emoji={getRandomEmoji()} />
      </div>
    ) : null
  );

  const renderEvents = (events: HistoricalEvent[]) => (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
      {events.map((event, index) => (
        event.year !== 0 && <EventCard key={index} event={event} emoji={getRandomEmoji()} />
      ))}
    </div>
  );

  const renderData = () => {
    if (!apiResponse) return null;

    switch (dataType) {
      case 'births':
        return (
          <div>
            <div className='flex justify-center mt-8'>
              <h2 className="text-xl font-semibold mb-4 text-blue-900">NACIMIENTOS</h2>
            </div>
            {renderEvents(apiResponse.scrapedData.births)}
          </div>
        );
      case 'events':
        return (
          <div>
            <div className='flex justify-center mt-8'>
              <h2 className="text-xl font-semibold mb-4 text-blue-900">ACONTECIMIENTOS</h2>
            </div>
            {renderEvents(apiResponse.scrapedData.events)}
          </div>
        );
      case 'deaths':
        return (
          <div>
            <div className='flex justify-center mt-8'>
              <h2 className="text-xl font-semibold mb-4 text-blue-900">FALLECIMIENTOS</h2>
            </div>
            {renderEvents(apiResponse.scrapedData.deaths)}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <main className="flex flex-1 justify-center h-screen">
        <div className="p-4 flex flex-col items-center w-full">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800">Introduce tu fecha de nacimiento</h1>
          <DateOfBirthInput onDateChange={handleDateChange} />
          <button
            onClick={handleSearch}
            className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Buscar
          </button>
          <div className='border-[1px] w-full border-gray-600 mt-4'></div>
          

          {loading ? (
            <div className="mt-4">Cargando...</div>
          ) : apiResponse && (
            <div className='w-full '>
              <div className="flex mt-4 gap-4 justify-center">
                <button onClick={handleShowBirths} className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">Nacimientos</button>
                <button onClick={handleShowEvents} className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">Acontecimientos</button>
                <button onClick={handleShowDeaths} className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">Fallecimientos</button>
              </div>
              
                {(() => {
                  const { birth, event, death } = getEventsForYear(date.year);
                  return (
                    <>
                    {
                      (birth === null && event === null && death === null) ? 
                      <div className="flex p-8 m-8 w-[90%] gap-4 justify-center bg-blue-500 text-gray-800 border border-blue-950 rounded-2xl">
                        <h2 className='text-white font-bold text-xl'>
                          No hay registros
                        </h2>
                      </div>
                      :
                      <div className="flex p-8 m-8 w-[90%] gap-4 justify-between bg-blue-500 text-gray-800 border border-blue-950 rounded-2xl">
                        {birth !== null && renderSingleEvent(birth, 'Nacimiento')}
                        {event !== null && renderSingleEvent(event, 'Acontecimiento')}
                        {death !== null && renderSingleEvent(death, 'Fallecimiento')}
                      </div>
                    }
                    </>
                );
                })()}
              
              
              
            </div>
          )}
          
          { show && renderData()}
        </div>
      </main>
    </>
  );
};

export default App;
