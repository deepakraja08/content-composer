import React, { useState, useMemo, useCallback } from 'react';
import contentPPTSerializer from '../../model/content-ppt-serializer';
import './index.css';

function ContentComposerRenderer() {
    const [config, setConfig] = useState();
    const serializer = useMemo(() => new contentPPTSerializer(), []);

    const generatePPT = useCallback(async () => {
        await serializer.create(JSON.parse(config));
    }, [serializer, config])

    return (
        <div className='content-composer__wrapper'>
            <h1>Content Composer</h1>
            <textarea className='content-composer__input' onChange={(event) => setConfig(event.target.value)} rows="36" cols="70" placeholder='config goes here...' />
            <button className='content-composer__button' onClick={generatePPT} >Generate PPT</button>
        </div>
    )
}

export default ContentComposerRenderer;