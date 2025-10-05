import React from 'react';
import { Helmet } from 'react-helmet-async';
import LevelTestComponent from '../components/LevelTestComponent';

export default function LevelTestPage() {
  return (
    <>
      <Helmet>
        <title>Test de Niveau - Ma'a yegue</title>
        <meta name="description" content="Évaluez votre niveau en dualaba avec notre test adaptatif intelligent" />
        <meta name="keywords" content="test de niveau, dualaba, évaluation, apprentissage linguistique" />
      </Helmet>
      
      <LevelTestComponent />
    </>
  );
}
