'use client';

import React, { useState } from 'react';
import { Paperclip, Hammer } from 'lucide-react';
import { useHomeContext } from '../../context/homeContext/homeContext';
import { createMessage } from '@/app/services/services';

const ChatInput = () => {
  const { state, dispatch } = useHomeContext();
  const [text, setText] = useState<string>('');

  const handleSend = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!text.trim()) return;

    const newMessage = createMessage(text, 'me');
    dispatch({ type: 'UPDATE_MESSAGES', payload: newMessage });
    setText('');

  };

  return (
    <form onSubmit={handleSend} className="border-1 w-full lg:h-1/8 h-1/6 min-h-26 p-3 rounded-2xl bg-white border-gray-300">
      <div className="flex">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-1/4 p-2 focus:outline-none text-gray-600 placeholder:text-gray-400"
          placeholder="Type your message here..."
        />
        <button
          type="submit"
          className="border-1 border-gray-400 text-gray-500 p-1 ml-1 rounded-md cursor-pointer"
        >
          Send
        </button>
      </div>

      <div className='flex w-fit mt-6 ml-2'>
        <Paperclip className="text-gray-500 lg:size-5 cursor-pointer" />
        <Hammer className="text-gray-500 lg:size-5 cursor-pointer ml-2" />
      </div>
    </form>
  );
};

export default ChatInput;