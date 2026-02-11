import { createRoot } from 'react-dom/client';
import { StrictMode, FC } from 'react';
import clsx from 'clsx';

import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';

import './styles/index.scss';
import styles from './styles/index.module.scss';

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

const App: FC = () => {
  return (
    <main className={clsx(styles.main)}>
      <ArticleParamsForm />
      <Article />
    </main>
  );
};

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);