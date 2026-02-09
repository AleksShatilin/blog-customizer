import { createRoot } from 'react-dom/client';
import { StrictMode, useState, CSSProperties, FC } from 'react';
import clsx from 'clsx';

import { Article } from './components/article/Article';
import { ArticleParamsForm } from './components/article-params-form/ArticleParamsForm';
import { defaultArticleState, ArticleStateType } from './constants/articleProps';

import './styles/index.scss';
import styles from './styles/index.module.scss';

// Получаем корневой элемент для рендера React
const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

/**
 * Главный компонент приложения - блог с настройками оформления
 * Управляет состоянием стилей статьи и отображением панели настроек
 */
const App: FC = () => {
  // Текущие настройки стилей статьи
  const [articleSettings, setArticleSettings] = useState<ArticleStateType>(defaultArticleState);
  
  // Флаг отображения панели настроек
  const [isSettingsVisible, setIsSettingsVisible] = useState<boolean>(false);

  /**
   * Обработчик применения новых настроек статьи
   * Обновляет состояние при нажатии "Применить" в форме
   */
  const handleSettingsUpdate = (newSettings: ArticleStateType): void => {
    setArticleSettings({ ...newSettings });
  };

  /**
   * Переключатель видимости панели настроек
   * Открывает/закрывает сайдбар с параметрами оформления
   */
  const toggleSettingsVisibility = (): void => {
    setIsSettingsVisible(prev => !prev);
  };

  // CSS-переменные для динамического применения стилей к статье
  const cssVariables: React.CSSProperties & Record<string, string> = {
    '--font-family': articleSettings.fontFamilyOption.value,
    '--font-size': articleSettings.fontSizeOption.value,
    '--font-color': articleSettings.fontColor.value,
    '--container-width': articleSettings.contentWidth.value,
    '--bg-color': articleSettings.backgroundColor.value,
  };

  return (
    <main
      className={clsx(styles.main)}
      style={cssVariables}
    >
      {/* Компонент формы настройки параметров статьи */}
      <ArticleParamsForm
        isOpen={isSettingsVisible}
        onToggle={toggleSettingsVisibility}
        currentValues={articleSettings}
        onApply={handleSettingsUpdate}
      />
      
      {/* Компонент статьи с настраиваемым оформлением */}
      <Article />
    </main>
  );
};

// Рендер приложения в строгом режиме React
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);