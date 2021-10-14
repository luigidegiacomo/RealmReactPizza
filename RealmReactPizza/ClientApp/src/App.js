﻿import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { Ordinazioni } from './components/Ordinazioni';
import { OrdinazioniWK } from './components/OrdinazioniWK';



import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/counter' component={Counter} />
        <Route path='/fetch-data' component={FetchData} />
        <Route path='/ordinazioni' component={Ordinazioni} />
        <Route path='/ordinazioniwk' component={OrdinazioniWK} />
      </Layout>
    );
  }
}
