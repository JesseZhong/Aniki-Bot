import React from 'react';
import image from '../assets/surprised-pikachu.png';
import './PageNotFound.sass';

const PageNotFound = () => (
    <div
        className='not-found-page text-white'
    >
        <h1>{'404'}</h1>
        <img
            src={image}
            alt='Surprised Pikachu.'
        />
    </div>
)

export default PageNotFound;