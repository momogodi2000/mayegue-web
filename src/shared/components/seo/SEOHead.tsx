import { Helmet } from 'react-helmet-async';

interface Props {
  title?: string;
  description?: string;
  canonical?: string;
}

export function SEOHead({ title, description, canonical }: Props) {
  const fullTitle = title ? `${title} | Mayegue` : 'Mayegue - Langues Camerounaises';
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
}


