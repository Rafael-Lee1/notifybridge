
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { MoreVertical, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AgendaItem {
  id: string;
  date: string;
  title: string;
}

const AgendaPanel: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Sample agenda data
  const agendaItems: AgendaItem[] = [
    {
      id: '1',
      date: '8 March',
      title: 'Client Meeting because Muhammad Fauzi has forgotten to notify about my proposal'
    },
    {
      id: '2',
      date: '9 March',
      title: 'Deadline project desain aplikasi $2000'
    },
    {
      id: '3',
      date: '10 March',
      title: 'Meeting floww perubahan tombol aktivitas di Digimap dan review summary'
    },
    {
      id: '4',
      date: '13 March',
      title: 'Reschedule my apps untuk technical meeting'
    },
    {
      id: '5',
      date: '23 March',
      title: 'Launching new product'
    }
  ];
  
  // Calculate the month name and year for the current date
  const currentMonth = date ? new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' }) : '';
  
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h2 className="font-medium text-sm">My Agenda</h2>
        <button className="p-1 rounded-full hover:bg-gray-100">
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">{currentMonth}</h3>
          <div className="flex gap-1">
            <button className="p-1 rounded hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="p-1 rounded hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
        
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="p-0"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {agendaItems.map(item => (
          <div key={item.id} className="p-2 mb-2">
            <div className="text-xs text-gray-500 mb-1">{item.date}</div>
            <p className="text-sm">{item.title}</p>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t text-center">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs text-blue-500 border-blue-200 flex items-center gap-1 mx-auto"
        >
          <Plus className="w-3 h-3" />
          Add New Agenda
        </Button>
      </div>
    </div>
  );
};

export default AgendaPanel;
