"use client";
import { useState, useEffect } from 'react';
import { format, isSameMonth, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Menu, Search, HelpCircle, Settings, Plus, X } from 'lucide-react';
import { getMonth, cn } from '../lib/utils';
import EventModal from '../components/EventModal';
import axios from 'axios';

// FAIL-SAFE: Direct Hex codes for Background (light) and Text (dark)
const colorStyles: any = {
  blue:   { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe' }, // blue-100 / blue-700
  red:    { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' }, // red-100 / red-700
  green:  { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' }, // green-100 / green-700
  purple: { bg: '#f3e8ff', text: '#7e22ce', border: '#e9d5ff' }, // purple-100 / purple-700
  yellow: { bg: '#fef9c3', text: '#854d0e', border: '#fde047' }, // yellow-100 / yellow-800
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // New state to track if we are editing
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const days = getMonth(currentDate);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events');
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events");
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  // Handle Save (Create OR Update)
  const handleSaveEvent = async (eventData: any) => {
    try {
      if (eventData.id) {
        // UPDATE existing event
        await axios.put(`/api/events/${eventData.id}`, eventData);
      } else {
        // CREATE new event
        await axios.post('/api/events', eventData);
      }
      fetchEvents();
      setEditingEvent(null); 
    } catch (err) {
      alert("Failed to save event");
    }
  };

  // Handle Delete
  const handleDelete = async (id: number) => {
    if(confirm('Delete this event?')) {
      try {
        await axios.delete(`/api/events/${id}`);
        fetchEvents();
      } catch (err) {
        alert("Failed to delete");
      }
    }
  };

  // Open Modal for New Event
  const handleDateClick = (date: Date) => {
    setEditingEvent(null);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  // Open Modal for Editing
  const handleEventClick = (e: React.MouseEvent, event: any) => {
    e.stopPropagation();
    setEditingEvent(event);
    setSelectedDate(new Date(event.startTime));
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-white text-gray-800">
      <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-full"><Menu className="w-6 h-6 text-gray-600" /></button>
          <span className="text-xl text-gray-600 pr-2 font-normal">Calendar</span>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 ml-8 text-gray-700">Today</button>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-1.5 hover:bg-gray-100 rounded-full"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-1.5 hover:bg-gray-100 rounded-full"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
          </div>
          <h2 className="text-xl text-gray-700 ml-2 font-normal">{format(currentDate, 'MMMM yyyy')}</h2>
        </div>
        <div className="flex items-center gap-4">
          <Search className="w-6 h-6 text-gray-600 cursor-pointer" />
          <HelpCircle className="w-6 h-6 text-gray-600 cursor-pointer" />
          <Settings className="w-6 h-6 text-gray-600 cursor-pointer" />
          <div className="w-8 h-8 bg-purple-700 rounded-full text-white flex items-center justify-center text-sm">D</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 p-4 hidden md:block border-r border-gray-200 bg-white">
          <button 
            onClick={() => { setEditingEvent(null); setSelectedDate(new Date()); setIsModalOpen(true); }}
            className="flex items-center gap-3 px-4 py-3 bg-white shadow-md rounded-full border hover:shadow-lg transition-all mb-6 cursor-pointer"
          >
            <Plus className="w-7 h-7 text-blue-600" />
            <span className="font-medium text-gray-600">Create</span>
          </button>
          <div className="text-xs font-medium text-gray-500 mb-2 mt-4">MY CALENDARS</div>
          <div className="flex items-center gap-2 mb-2">
            <input type="checkbox" checked className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" readOnly />
            <span className="text-sm text-gray-700">My Calendar</span>
          </div>
        </aside>

        <main className="flex-1 flex flex-col bg-white">
          <div className="grid grid-cols-7 border-b border-gray-200">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <div key={day} className="text-[11px] font-medium text-gray-500 text-center py-2">{day}</div>
            ))}
          </div>
          <div className="flex-1 grid grid-cols-7 grid-rows-5">
            {days.map((day, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "border-b border-r min-h-[100px] p-1 transition-colors hover:bg-gray-50 cursor-pointer",
                  !isSameMonth(day, currentDate) && "bg-gray-50/50"
                )}
                onClick={() => handleDateClick(day)}
              >
                <div className="flex justify-center mb-1">
                  <span className={cn(
                    "text-xs font-medium w-7 h-7 flex items-center justify-center rounded-full",
                    isToday(day) ? "bg-blue-600 text-white" : "text-gray-700"
                  )}>
                    {format(day, 'd')}
                  </span>
                </div>
                
                <div className="flex flex-col gap-1">
                  {events
                    .filter(e => new Date(e.startTime).toDateString() === day.toDateString())
                    .map((e) => {
                      // Get color styles safely
                      const style = colorStyles[e.color] || colorStyles.blue;
                      
                      return (
                        <div 
                          key={e.id}
                          onClick={(ev) => handleEventClick(ev, e)}
                          // HERE IS THE FIX: Applying inline styles directly
                          style={{ 
                            backgroundColor: style.bg, 
                            color: style.text,
                            borderColor: style.border 
                          }}
                          className="group text-xs rounded px-2 py-1 truncate font-medium border mb-1 flex justify-between items-center transition-all hover:brightness-95"
                          title={e.description || e.title}
                        >
                          <span className="truncate">{e.title}</span>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveEvent}
        onDelete={handleDelete} 
        selectedDate={selectedDate}
        defaultEvent={editingEvent} 
      />
    </div>
  );
}