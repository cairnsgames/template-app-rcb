import React from 'react';
import { Button, Image } from 'react-bootstrap';

const ExamplesHero1 = () => {
    return (<div className="px-4 pb-5 my-5 text-center">
    <Image className="mb-4" src="https://getbootstrap.com/docs/5.0/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57" />
    <h1 className="display-5 fw-bold">Centered hero</h1>
    <div className="w-75 mx-auto">
      <div className="lead mb-4">Quickly design and customize responsive mobile-first sites with Bootstrap, the world’s most popular front-end open source toolkit, featuring Sass variables and mixins, responsive grid system, extensive prebuilt components, and powerful JavaScript plugins.</div>
      <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
        <Button variant="primary" size="lg" className="px-4 gap-3">Primary button</Button>
        <Button variant="outline-secondary" size="lg" className="px-4">Secondary</Button>
      </div>
    </div>
  </div>)
}

export default ExamplesHero1;