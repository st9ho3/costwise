import React from 'react';

const Label = ({text, children}: {text: string, children: string}) => {


    return <label htmlFor={text} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {children}
    </label>
};


export default Label;
