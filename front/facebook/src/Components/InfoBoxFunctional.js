import { Component, useEffect, useRef } from 'react';

export function InfoBox(props) {
  const ref = useRef(null);
  const { onClickOutside } = props;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [ onClickOutside ]);

  if(!props.show)
    return null;

  return (
    <div ref={ref} className='info-box'>
        {props.message}
    </div> );
}

// 1. ask shlomi if this file needs to be in assets
// 2. ask shlomi how this component can be imported to diffrent page(topnav) without export default.
// i mean i can see that there is export function InfoBox but theres no export default in the end.

// 3. just so i understand the command 'export function' it means that i can use this function with every page in the project?